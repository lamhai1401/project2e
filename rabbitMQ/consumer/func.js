function closeOnErr(conn, err) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  conn.close();
  return true;
};

// function processMsg(msg) {
//   work(msg, function(ok) {
//     try {
//       if (ok)
//         ch.ack(msg);
//       else
//         ch.reject(msg, true);
//     } catch (e) {
//       closeOnErr(e);
//     }
//   });
// }

// function work(msg, cb) {
//   console.log("PDF processing of ", msg.content.toString());
//   cb(true);
// }

// producer
// const connection = require('../connectMQ');

// async function sender(mess) {
//     try {
//         const conn = await connection();
//         conn.createChannel((err, ch) => {
//             const ex = 'test';

//             ch.assertExchange(ex, 'fanout', {durable: false});
//             ch.publish(ex, '', new Buffer(mess));
//             console.log('Sent %s', mess);
//         });

//         setTimeout(() => {
//             conn.close();
//             process.exit(0);
//         }, 500);
//     } catch(err) {
//         return err.message;
//     }
// };

// module.exports = sender;

// const msg = "{'pcpu': '199.9', 'pmem': '58.7', 'total_proc': '248'}";

// sender(msg);

module.exports = {
  closeOnErr: closeOnErr
}

