const connectDB = require('../foundation/connectDB');

const IPdetai_Schema = new connectDB.Schema({
    ip:     {type: String},
    city:   {type: String},
    region: {type: String},
    country:{type: String},
    loc:    {type: String},
    org:    {type: String},
    created_at: {
        type: String,
        default: Date.now()
    },
    updated_at: {
        type: String,
        default: Date.now()
    },
});

const Ipdetail = connectDB.mongoose.model('Ipdetail',IPdetai_Schema);

module.exports = Ipdetail;