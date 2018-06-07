const Server = require('socket.io');

let defaultInstance;

exports.create = function () {
    let self = this;
    self.io = new Server();
    self.io.on('connection', socket => {
        console.log('  [SocketIO] Socker server connecting');
    });

    self.attach = function (server, opts) {
        //TODO: Verify opts
        self.io.attach(server, {});
    }
};

defaultInstance = new exports.create();
exports.attach = defaultInstance.attach;
exports.io = defaultInstance.io;
Object.assign(exports, defaultInstance);