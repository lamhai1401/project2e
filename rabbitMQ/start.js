const controller= require('./consumer/controller');
const amqp      = require('amqplib/callback_api');
const url       = require('../config/config').rabbitmq_url;
//const url   = 'amqp://localhost';

/**
 * The start function will establish a connection to RabbitMQ.
 * If the connection is closed or fails to be established
 * it will try to reconnect.
 */
function start(socket_server) {
  amqp.connect(url, (err, conn) => {
    
    // try to restart if err
    if(err) {
      console.error("[AMQP]", err.message);
      return setTimeout(start, 1000);
    };

    // if connection has problem or close suddenly will try to restart
    conn.on('error', (err) => {
      if(err.message != 'Connection closing') {
        console.error("  [AMQP] conn error", err.message);
      }
    });
    conn.on('close', () => {
      console.error("  [AMQP] reconnecting");
      return setTimeout(start, 1000);
    });

    console.log("  [AMQP] connected  ");
    controller(socket_server, conn);
  });
};

module.exports = start;