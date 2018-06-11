const func          = require('../func');
const io            = require('../../../socket/events');

function diskinfo_consumer(conn) {
  conn.createChannel((err, ch) => {
    // print to cmd if err
    if(func.closeOnErr(err)) return;
    ch.on("error", (err) => {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", () => {
      console.log("[AMQP] channel closed");
    });

    // make sure message was save if has error
    ch.prefetch(10);

    // create percific exchange
    const exchange = 'system_data';
    const routing_key = 'disk_info';
    
    ch.assertExchange(exchange, 'direct', {durable: false});

    // binding message
    ch.assertQueue("", {exclusive: true}, (err, q) => {
      if(func.closeOnErr(err)) return;
      console.log('  [AMQP] Disk info exchange waiting for logs');

      ch.bindQueue(q.queue, exchange, routing_key);

      ch.consume(q.queue, msg => {
        ch.ack(msg);
        // console.log(JSON.parse(msg.content.toString()).C);
        // console.log('Receive [ %s ] from server', msg.content.toString());
        io.receiveDiskInfo(JSON.parse(msg.content.toString()));
      }, {noAck: false});
    });
  });
};

module.exports = diskinfo_consumer;