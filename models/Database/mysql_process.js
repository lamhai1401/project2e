const connectDB = require('../../foundation/connectDB');

const MysqlProcess_Schema = new connectDB.mongoose.Schema({
  Id:      {type: String},
  User:    {type: String},
  Host:    {type: String},
  database:{type: String},
  Command: {type: String},
  Time:    {type: String},
  State:   {type: String},
  Info:    {type: String},
  Progress:{type: String},
  created_at: {
      type: String,
      default: Date.now()
  },
  updated_at: {
      type: String,
      default: Date.now()
  },
});

const Mysql_process = connectDB.mongoose.model('mysql_process', MysqlProcess_Schema);
module.exports = Mysql_process;