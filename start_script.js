// setInterval(() => {
//     io.io.emit('chart_system_cpu', 111);
// }, 1000);

const startConsumer = require('./rabbitMQ/consumer/start');
startConsumer();