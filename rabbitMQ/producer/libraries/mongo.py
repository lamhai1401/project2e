import platform
import os
import signal
import sys
import subprocess
import time
import datetime

import pymongo
from pymongo import MongoClient

# -----------------------------------Create Database connection-----------------------------#
client = MongoClient('localhost', 27017)
db = client['test']
# -----------------------------------End create Database connection-----------------------------#


PRIMARY_NODE = None
BACKUP_NODE = []

# -----------------------------------logging-----------------------------#
import gzip
import logging
import logging.handlers
from logging.handlers import TimedRotatingFileHandler

# logger format
logger = logging.getLogger('monitorMongoDB')
logger.setLevel(logging.INFO)
# ----------------------------------- End logging-----------------------------#


# As of pymongo v 1.9 the SON API is part of the BSON package, therefore attempt
# to import from there and fall back to pymongo in cases of older pymongo
if pymongo.version >= "1.9":
    import bson.son as son
else:
    import pymongo.son_manipulator as son

def set_read_preference(db):
  """"
  supplement function for choosing data for preference.
  """
  if (pymongo.version >= "2.2") and (pymongo.version < "2.8"):
    pymongo.read_preferences.Secondary
  else:
    db.read_preference = pymongo.ReadPreference.SECONDARY

def timeit(method):
    def timed(*args, **kw):
        ts = time.time()
        result = method(*args, **kw)
        te = time.time()
        if 'log_time' in kw:
            name = kw.get('log_name', method.__name__.upper())
            kw['log_time'][name] = int((te - ts) * 1000)
        else:
            print ('%r  %2.2f miniseconds' % (method.__name__, (te - ts) * 1000))
        return result
    return timed

def get_server_status(mongo_connection):
  """"
  read server information from mongoDB connection.
  """
  try:
    set_read_preference(mongo_connection.admin)
    data = mongo_connection.admin.command(pymongo.son_manipulator.SON([('serverStatus', 1)]))
  except:
    data = mongo_connection.admin.command(son.SON([('serverStatus', 1)]))
  return data


def mongo_check_memory(mongo_connection):
  """"
  check for memory usage.
  """
  data = get_server_status(mongo_connection)
  if not data['mem']['supported']:
      logger.warning("Uhmm - Platform not supported for memory info.")
      return None
  else:
      logger.info("OK - Platform supported for memory info")
      #
      # convert to gigs
      #
      message = "Memory Usage:"
      try:
          mem_resident = float(data['mem']['resident']) / 1024.0
          message += " %.2fGB resident," % (mem_resident)
      except Exception as expt_msg:
          logger.warning(expt_msg)
          mem_resident = 0
          message += " resident unsupported,"

      try:
          mem_virtual = float(data['mem']['virtual']) / 1024.0
          message += " %.2fGB virtual," % mem_virtual
      except Exception as expt_msg:
          logger.warning(expt_msg)
          mem_virtual = 0
          message += " virtual unsupported,"

      try:
          mem_mapped = float(data['mem']['mapped']) / 1024.0
          message += " %.2fGB mapped," % mem_mapped
      except Exception as expt_msg:
          logger.warning(expt_msg)
          mem_mapped = 0
          message += " mapped unsupported,"

      try:
          mem_mapped_journal = float(data['mem']['mappedWithJournal']) / 1024.0
          message += " %.2fGB mappedWithJournal" % mem_mapped_journal
      except Exception as expt_msg:
          logger.warning(expt_msg)
          mem_mapped_journal = 0

      return message


# -----------------------------------Opcounters-----------------------------#
  # using for saving opcounters.
old_delta_opcounters = []

def calc_delta(old, new):
  delta = []
  if len(old) != len(new):
    raise Exception("unequal number of parameters")
  for i in range(0, len(old)):
    val = float(new[i]) - float(old[i])
    if val < 0:
        val = new[i]
    delta.append(val)
  return delta

def check_opcounters():
    """
    A function to get all opcounters delta per minute.
    In case of a replication - gets the opcounters+opcountersRepl
    """
    old_delta_opcounters = {}
    data = get_server_status(client)
    delta_opcounters = get_opcounters(data, 'opcounters', "")
    # delta_opcounters_repl = get_opcounters(data, 'opcountersRepl', "")
    # message = None
    if delta_opcounters is not None:
      if len(old_delta_opcounters) <= 0:
        message = "Opcounters: total=%d,insert=%d,query=%d,update=%d,delete=%d" % tuple(delta_opcounters)
      else:
        calc_data = calc_delta(old_delta_opcounters, delta_opcounters)
        message = "Opcounters: total=%d,insert=%d,query=%d,update=%d,delete=%d" % tuple(calc_data)

    old_delta_opcounters = {'total': delta_opcounters[0], 'insert': delta_opcounters[1], 'query': delta_opcounters[2], 'update': delta_opcounters[3], 'delete': delta_opcounters[4]}
    # logger.warning(message)

    return old_delta_opcounters

def get_opcounters(data, opcounters_name, host=""):
  try:
    insert = data[opcounters_name]['insert']
    query = data[opcounters_name]['query']
    update = data[opcounters_name]['update']
    delete = data[opcounters_name]['delete']
    # getmore = data[opcounters_name]['getmore']
    # command = data[opcounters_name]['command']
  except Exception as expt_msg:
    logger.error(expt_msg)
    return None

  total_commands = insert + query + update + delete
  new_vals = [total_commands, insert, query, update, delete]
  return new_vals
# -----------------------------------End Opcounters-----------------------------#


# -----------------------------------Connection-----------------------------#
def close_mongo_connection():
  """"
  close mongodb connection after using.
  """
  try:
    client.close()
    logger.info("Close mongoDB connection successfully.")
  except Exception as expt_msg:
    logger.warning("Close mongoDB connection failed")

def list_all_replica_nodes():
    """"
    list out all possible nodes in the replica set now.
    """
    try:
        logger.info(client.nodes)
        time.sleep(0.1)
        logger.info(client.nodes)
    except Exception as expt_msg:
        logger.warning(expt_msg)

def mongo_check_connection(list_host):
    """"
    connect to mongodb with replica set name.
    """
    # 1. connect to mongodb replica
    try:
        string_connection = "mongodb://" + list_host + ":27017"
        con = pymongo.MongoClient(string_connection, replicaset='rs1')
        logger.info("Connect to " + str(list_host) + " successfully.")
        return con
    except Exception as expt_msg:
        logger.warning(expt_msg)

def mongo_check_detail_nodes():
  """"
  list out all nodes in replica set.
  """
  global PRIMARY_NODE

  PRIMARY_NODE = None
  if len(BACKUP_NODE) > 0:
      del BACKUP_NODE[:]

  try:
    rs_status = client.admin.command("replSetGetStatus")
    logger.info("")

    # show up nodes information
    for member in rs_status["members"]:
        if member["stateStr"] == "PRIMARY":
            logger.info(member["stateStr"] + " --> " + member["name"])
            PRIMARY_NODE = member
            break

    list_nodes_backup = []
    for member in rs_status["members"]:
        if member["stateStr"] == "SECONDARY":
            list_nodes_backup.append(member["name"])
            BACKUP_NODE.append(member)

    if len(list_nodes_backup) > 0:
        logger.info("SECONDARY" + " --> " + str(list_nodes_backup))
    del list_nodes_backup[:]

    for member in rs_status["members"]:
        if member["stateStr"] == "ARBITER":
            logger.info(member["stateStr"] + " --> " + member["name"])
  except Exception as expt_msg:
    logger.error(expt_msg)
# -----------------------------------End Connection-----------------------------#


# -----------------------------------Database size-----------------------------#
def check_database_size(mongo_connection, database):
  """"
  get size of specific database.
  """
  warning = 100.0
  critical = 300.0
  perfdata = ""
  try:
    # set_read_preference(con.admin)
    # data_test = mongo_connection[database_name]
    # print("ddddddddddd")
    data = database.command("dbstats")
    # print(data)
    storage_size = float(data['dataSize']) / float(1024) / float(1024)
    # print(data['storageSize'])
    # print(storage_size)
    
    if storage_size >= critical:
        # logger.critical("CRITICAL - Database size: %.0f MB, Database: %s" % (storage_size, database))
        logger.critical("CRITICAL - Database size: " + str(storage_size) + "MB, Database: " + str(database))
    elif storage_size >= warning:
        # logger.warning("WARNING - Database size: %.0f MB, Database: %s" % (storage_size, database))
        logger.warning("WARNING - Database size: " + str(storage_size) + "MB, Database: " + str(database))
    else:
        logger.info("OK - Database size: " + str(storage_size) + "MB, Database: " + str(database))
    return {'size': storage_size}
  except Exception as expt_msg:
    logger.error(expt_msg)
# -----------------------------------End database size-----------------------------#


# -----------------------------------Collections-----------------------------#
def check_collections_by_db(con, db_name, perf_data=None):
    """
    count the number of databases in mongodb.
    """
    try:
        # data_test = con["test"]
        count = len(db_name.collection_names())
        # logger.warning("Number of collections in " + str(db_name) + " is " + str(count))
        return {'count':count}
    except Exception as expt_msg:
        logger.error(expt_msg)
# -----------------------------------Collections-----------------------------#

@timeit
def get_mongodata():
  data = {
    'opcounters': check_opcounters(),
    'database_size': check_database_size(client, db),
    'collections': check_collections_by_db(client, db),
  }
  return data