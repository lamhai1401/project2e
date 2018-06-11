const connectDB = require('../../foundation/connectDB');

const Mongoinfo_Schema = new connectDB.mongoose.Schema({
    opcounters: {
      total : {type: String}, 
      insert: {type: String}, 
      query : {type: String}, 
      update: {type: String},
      delete: {type: String},
    },
    database_size: {
      size: {type: String}
    },
    collections: {
      count: {type: String}
    },
    created_at: {
        type: String,
        default: Date.now()
    },
    updated_at: {
        type: String,
        default: Date.now()
    },
});

const MongoInfo = connectDB.mongoose.model('Mongoinfos',Mongoinfo_Schema);
module.exports = MongoInfo;