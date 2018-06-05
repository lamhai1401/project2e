const connectDB = require('../../foundation/connectDB');
const moment    = require('../../foundation/moment');

const ProcessRunning_Schema = new connectDB.Schema({
    pid:        {type: String},
    detail:     {
      user:     {type: String},
      pcpu:     {type: String}, // percent cpu usage
      pmem:     {type: String}, // percent ram usage
      status:   {type: String},
      startAt:  {type: String},
      duration: {type: String},
      name:     {type: String}, // time duration       
    },
    day:        {
      type: String,
      default: moment.getDay(Date.now()),
    },
    month:        {
      type: String,
      default: moment.getMonth(Date.now()),
    },
    year:        {
      type: String,
      default: moment.getYear(Date.now())
    },
    created_at: {
        type: String,
        default: Date.now()
    },
    updated_at: {
        type: String,
        default: Date.now()
    }
});

const Running = connectDB.mongoose.model('Process_runnings', ProcessRunning_Schema);

module.exports = Running;