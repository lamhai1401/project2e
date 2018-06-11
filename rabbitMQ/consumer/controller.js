const system_info_consumer              = require('./cpu_info/systeminfo_consumer');
const process_running_consumer          = require('./process/process_running_consumer');
//const system_process_exitcode_consumer  = require('./system_process_exitcode_consumer');
const mongoinfo_consumer                = require('./databse/mongoinfo_consumer');
const diskinfo_consumer                 = require('./disk/diskinfo_consumer');
const network_traffic_consumer          = require('./network/network_traffic_consumer');
const mysqlinfo_consumer                = require('./databse/mysqlstatus_consumer');
const mysqlprocess_consumer             = require('./databse/mysqlprocess_consumer');

function connected(conn) {

  /**
   * System consumer
   */
  system_info_consumer(conn);
  process_running_consumer(conn);
  network_traffic_consumer(conn);
  //system_process_exitcode_consumer(conn);
  diskinfo_consumer(conn);

  /**
   * MongoDB consumer
   */
  mongoinfo_consumer(conn);

   /**
   * Mysql consumer
   */
  mysqlinfo_consumer(conn)
  mysqlprocess_consumer(conn)
};

module.exports = connected;