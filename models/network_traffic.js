const connectDB = require('../foundation/connectDB');

const Network_traffic_schema = new connectDB.mongoose.Schema({
  bytes_sent:   {type: String},
  bytes_recv:   {type: String},
  packets_sent: {type: String},
  packets_recv: {type: String},
  error_in:     {type: String},
  error_out:    {type: String},
  drop_in:      {type: String},
  drop_out:     {type: String},
  created_at: {
      type: String,
      default: Date.now()
  },
  updated_at: {
      type: String,
      default: Date.now()
  },
});

const NetworkTraffic = connectDB.mongoose.model('Network_traffic',Network_traffic_schema);
module.exports = NetworkTraffic;