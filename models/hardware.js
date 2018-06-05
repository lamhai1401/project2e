// const connectDB = require('../foundation/connectDB');

// const HardwareSchema = new connectDB.Schema({
//     process: {
//         type: connectDB.Schema.ObjectId,
//         ref:   'Hardware_Process'
//     },
//     memory: {
//         type: connectDB.Schema.ObjectId,
//         ref:   'Hardware_Memory'
//     },
//     // network:[ {
//     //     type: connectDB.Schema.ObjectId,
//     //     ref:   'Hardware_Network'
//     // }],
//     // osinfo: {
//     //     type: connectDB.Schema.ObjectId,
//     //     ref:   'Hardware_Osinfo'
//     // },
//     // time: {
//     //     type: connectDB.Schema.ObjectId,
//     //     ref:   'Hardware_Time'
//     // },
//     status: {
//         type: Number,
//         default: 1
//     },
//     created_at: {
//         type: String
//     },
//     updated_at: {
//         type: String
//     }
// });

// const Hardware = connectDB.mongoose.model('Hardware', HardwareSchema);

// module.exports = Hardware;