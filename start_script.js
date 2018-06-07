const io = require('./socket');

setInterval(() => {
    io.io.emit('chart_system_cpu', 111);
}, 1000);

const server_socket = io;
const startConsumer = require('./rabbitMQ/start');
startConsumer(server_socket);