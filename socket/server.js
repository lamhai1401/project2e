const socketio = require('socket.io');

function socketserver(server) {
    var socket_server = {};

    socket_server.io = socketio.listen(server);
    socket_server.io.sockets.on('connection', socket => {
        console.log('  [SocketIO] Socker server connecting');
    });

    // get system percent ram and cpu
    socket_server.receiveSystemInfo = (data) => {
        socket_server.io.emit('chart_system_cpu', data);
    };

    // get detail process running
    socket_server.receiveProcessInfo = (data) => {
        socket_server.io.emit('table_process_info', data);
    };

<<<<<<< HEAD
  // get disk info
  socket_server.receiveDiskInfo = (data) => {
    socket_server.io.emit('table_disk_info', data);
  }

  // get process exit code
  socket_server.receiveProcessExitCode = (data) => {
    socket_server.io.emit('table_process_exitcode', data);
  };

  // get mongo infomation
  socket_server.receiveMongoInfo = (data) => {
    socket_server.io.emit('table_mongo_info', data)
  };

  return socket_server;
=======
    // get process exit code
    socket_server.receiveProcessExitCode = (data) => {
        socket_server.io.emit('table_process_exitcode', data);
    };

    // get mongo infomation
    socket_server.receiveMongoInfo = (data) => {
        socket_server.io.emit('table_mongo_info', data)
    }
    return socket_server;
>>>>>>> origin/master
};

module.exports = socketserver;