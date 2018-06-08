const connectDB = require('../../foundation/connectDB');
const moment   = require('../../method').moment;

const ProcessExitcode_Schema = new connectDB.mongoose.Schema({
    pid:      {type: String},
    name:     {type: String},
    exitcode: {type: String},
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
});

const Exitcode = connectDB.mongoose.model('Process_exitcodes', ProcessExitcode_Schema);

module.exports = Exitcode;