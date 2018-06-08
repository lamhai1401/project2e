from __future__ import unicode_literals
from future.utils import bytes_to_native_str as n
import threading
import logging
import time
import sys
from datetime import datetime
import MySQLdb as Database

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

"""
Keywords for show status list
"""
keywords = (
  "Aborted_connects",
  "Binlog_cache_disk_use",
  "Bytes_received",
  "Bytes_sent",
  "Connections",
  "Created_tmp_disk_tables",
  "Created_tmp_files",
  "Created_tmp_tables",
  "Handler_delete",
  "Handler_read_first",
  "Handler_read_rnd",
  "Handler_read_rnd_next",
  "Handler_update",
  "Handler_write",
  "Key_read_requests",
  "Key_reads",
  "Max_used_connections",
  "Open_files",
  "Opened_table_definitions",
  "Opened_tables",
  "Opened_tables",
  "Qcache_free_memory",
  "Qcache_hits",
  "Qcache_queries_in_cache",
  "Questions",
  "Select_full_join",
  "Select_full_range_join",
  "Select_range",
  "Select_range_check",
  "Select_scan",
  "Slave_running",
  "Slow_queries",
  "Sort_merge_passes",
  "Sort_scan",
  "Table_locks_immediate",
  "Table_locks_waited",
  "Threads_connected",
  "Threads_created",
  "Threads_running",
  "Uptime",
)

"""
Main Function
"""
@timeit
def MySQLInfo(command):
  try:
    # get sql status info
    if(command == 'status'):
      sql = mode(command)
      status = show_update_status(sql)
      return status
    # get sql process list
    if(command == 'process'):
      sql = mode(command)
      processlist = query(sql)
      for process in processlist:
        for key in process:
          if( key == 'Info'):
            if (process[key] is not None):
              process[key] = n(process[key])
            if (process[key] is None):
              process[key] = "None"
      return processlist
  
  except Exception as err:
    logging.exception(err)
    print(err)
    sys.exit()


"""
Necessary Function
"""
def mode(x):
    return {
        'status': 'SHOW GLOBAL STATUS',
        'process': 'SHOW FULL PROCESSLIST'
    }.get(x, 'SHOW GLOBAL STATUS')  
def connectDB():
  try:
    db = Database.connect(
      host='192.168.3.191',
      user='root',
      port=3306,
      passwd='123456'
    )
    return db
  except Exception as err:
    logging.exception(err)
    print(err)
    sys.exit()

# Get status variable
def show_update_status(sql):
  result = query(sql)
  status = to_dict(result)
  result = {}
  for k in keywords:
   result.update({ k: status[k] })
  get_query_per_second(result)
  return result
def get_query_per_second(status):
  if status is None:
    return 0.0
  if status is not None:
    [current, last] = map(lambda x: float(x),
      (status.get('Uptime'),
        status.get('Uptime')))
    elapsed_time = last - current

    [current, last] = map(lambda x: float(x),
      (status.get('Questions', 0),
      status.get('Questions', 0)))
    inc_query = last - current
  else:
    [elapsed_time, inc_query] = map(lambda x: float(x),
      (status.get('Uptime', 0),
      status.get('Questions', 0)))
  try:
      qps = inc_query / elapsed_time
  except:
      qps = 0.0
  status.update({'QPS': "%0.2f" % qps})
  return qps

# Do query and convert to dict type
def query(sql):
  result = ()
  db = connectDB()
  cursor = db.cursor(Database.cursors.DictCursor)
  try:
    cursor.execute(sql)
    result = cursor.fetchall()
  except Exception as err:
    logging.exception(err)
  return result
def to_dict(dictset):
  return dict(
    map(
      lambda x: (x.get('Variable_name'), x.get('Value')),
      dictset))
