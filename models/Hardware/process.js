const connectDB = require('../../foundation/connectDB');

const Process_Schema = new connectDB.Schema({
    total_proc:     {type: String},
    pcpu:           {type: String}, // total of cpu usage
    pmem:           {type: String}, // total of ram usage
    status:         {type: Number},
    created_at: {
        type: String,
        default: Date.now()
    },
    updated_at: {
        type: String,
        default: Date.now()
    }
});

const Process_State = connectDB.mongoose.model('Process_State', Process_Schema);

module.exports = Process_State;