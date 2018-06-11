const func                = require('../func');
const io                  = require('../../../socket/events');
const convertJSON         = require('../../../method').string.convertJSON;
const hardware_exitcode   = require('../../../models').Hardware_exitcode;

function process_exitcode_consumer(conn) {
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
    const exchange = 'process_exitcode';
    ch.assertExchange(exchange, 'fanout', {durable: false});

    // binding message
    ch.assertQueue("", {exclusive: true}, (err, q) => {
      if(func.closeOnErr(err)) return;
      console.log('  [AMQP] Process exitcode exchange waiting for logs');

      ch.bindQueue(q.queue, exchange, '');

      ch.consume(q.queue, msg => {
        ch.ack(msg);
        // console.log('Receive [ %s ] from server', msg.content.toString());
        hardware_exitcode.create(convertJSON(msg.content.toString()));
        io.receiveProcessExitCode(convertJSON(msg.content.toString()));
      }, {noAck: false});
    });
  });
};

module.exports = process_exitcode_consumer;