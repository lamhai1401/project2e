const Ipdetail            = require('./models/ipdetail');
//const Hardware          = require('./models/hardware');
//const Hardware_time     = require('./models/Hardware/time');
//const Hardware_osinfo   = require('./models/Hardware/osinfo');
//const Hardware_network  = require('./models/Hardware/network');
//const Hardware_memory   = require('./models/Hardware/memory');
const Hardware_process    = require('./models/Hardware/process_state');
const Hardware_runnings   = require('./models/Hardware/process_running');
const Hardware_exitcode   = require('./models/Hardware/process_exitcode');
const Network_traffic     = require('./models/network_traffic');
const Disk_info           = require('./models/disk_info');
const MongoInfo           = require('./models/Database/mongoinfo'); 
const MysqlStatus         = require('./models/Database/mysq_status');
const MysqlProcess        = require('./models/Database/mysql_process');

module.exports = {
    Ipdetail            : Ipdetail,
    Hardware_process    : Hardware_process,
    Hardware_runnings   : Hardware_runnings,
    Hardware_exitcode   : Hardware_exitcode,
    Network_traffic     : Network_traffic,
    Disk_info           : Disk_info,
    MongoInfo           : MongoInfo,
    MysqlStatus         : MysqlStatus,
    MysqlProcess        : MysqlProcess,
};
