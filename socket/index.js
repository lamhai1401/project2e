const socket = require('socket.io');
let io = null;

function initEvents(socket) {

}

module.exports = {
    io: () => {
        if (io) throw new Error('Socket doesn\'t exit');
        return io;
    },
    init: (server) => {
        io = socket(server, {});
        return io;
    }
};