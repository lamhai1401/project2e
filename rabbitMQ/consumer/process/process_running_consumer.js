const func                = require('../func');
const io                  = require('../../../socket/events');
const convertProcessList  = require('../../../method').string.formatDetail2String;
const process_running     = require('../../../models').Hardware_runnings;

function process_info_consumer(conn) {
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
    const routing_key = 'process_running';

    ch.assertExchange(exchange, 'direct', {durable: false});

    // binding message
    ch.assertQueue("", {exclusive: true}, (err, q) => {
      if(func.closeOnErr(err)) return;
      console.log('  [AMQP] Process running info exchange waiting for logs');

      ch.bindQueue(q.queue, exchange, routing_key);

      ch.consume(q.queue, msg => {
        ch.ack(msg);
        console.log('Receive [ %s ] from server', msg.content.toString());
        convertProcessList(msg.content.toString())
        .then( (list) => {
          list.forEach( async (document) => {
            process_running.create({
              pid   : document.pid,
              detail: document.detail,
            })
          });
          io.receiveProcessInfo(list);
          //console.log(list.length);
        })
      }, {noAck: false});
    });
  });
};

module.exports = process_info_consumer;