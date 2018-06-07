const func = require('../func');
const hardware = require('../../foundation/hardware');
const convertJSON = require('../../method').string.convertJSON;
const socket_server = require('../../socket/server');

function system_consumer(socket_server, conn) {
    conn.createChannel((err, ch) => {
        // print to cmd if err
        if (func.closeOnErr(err)) return;
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
        const routing_key = 'system_infomation';

        ch.assertExchange(exchange, 'direct', {durable: false});

        // binding message
        ch.assertQueue("", {exclusive: true}, (err, q) => {
            if (func.closeOnErr(err)) return;
            console.log('  [AMQP] System infomation exchange waiting for logs');

            ch.bindQueue(q.queue, exchange, routing_key);

            ch.consume(q.queue, msg => {
                ch.ack(msg);
                console.log('Receive [ %s ] from server', msg.content.toString());
                socket_server.receiveSystemInfo(convertJSON(msg.content.toString()));
                hardware(convertJSON(msg.content.toString()));
            }, {noAck: false});
        });

        setInterval(() => {
            let io = require('../../socket/events');
            io.receiveSystemInfo(115)
        }, 1000);
    });
};

module.exports = system_consumer;