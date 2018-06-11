const io = require('../index').io;

module.exports = {
    receiveSystemInfo: (data) => {
        io.emit('chart_system_cpu', data);
    },
    receiveProcessInfo: (data) => {
        io.emit('table_process_info', data);
    },
    receiveDiskInfo: (data) => {
        io.emit('table_disk_info', data);
    },
    receiveNetworkTraffic: (data) => {
        io.emit('table_network_traffic', data);
    },
    // receiveProcessExitCode: (data) => {
    //     io.emit('table_process_exitcode', data);
    // },
    receiveMongoInfo: (data) => {
        io.emit('table_mongo_info', data);
    },
    receiveMysqlStatus: (data) => {
        io.emit('table_mysql_status', data);
    },
    receiveMysqlProcess: (data) => {
        io.emit('table_mysql_process', data);
    }
};