const system_info_consumer              = require('./systeminfo_consumer');
const process_running_consumer          = require('./process_running_consumer');
//const system_process_exitcode_consumer  = require('./system_process_exitcode_consumer');
const mongoinfo_consumer                = require('./mongoinfo_consumer');
const diskinfo_consumer                 = require('./diskinfo_consumer');

function connected(socket_server, conn) {

  /**
   * System consumer
   */
  system_info_consumer(socket_server, conn);
  process_running_consumer(socket_server, conn);
  //system_process_exitcode_consumer(socket_server, conn);
  diskinfo_consumer(socket_server, conn);

  /**
   * MongoDB consumer
   */
  mongoinfo_consumer(socket_server, conn);

};

module.exports = connected;