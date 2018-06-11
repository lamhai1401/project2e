const connectDB = require('../foundation/connectDB');
const Diskinfo_Schema = new connectDB.mongoose.Schema({
    name:        {type: String},
    detail:     {
      total:          {type: String},
      used:           {type: String}, // percent cpu usage
      free:           {type: String}, // percent ram usage
      percent_used:   {type: String},
      type:           {type: String},       
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

const Diskinfo = connectDB.mongoose.model('Disk_info', Diskinfo_Schema);
module.exports = Diskinfo;