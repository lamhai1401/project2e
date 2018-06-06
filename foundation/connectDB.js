const mongoose = require('mongoose');
const mongo = require('config').MONGODB.URI;
//const mongo       = 'mongodb://localhost/test';
mongoose.connect(mongo)
    .then(connection => {
        console.log('  [Mongodb] Connected to MongoDB');
        console.log('======================== \n');
    })
    .catch(error => {
        console.log('  [Mongodb] ' + error.message);
    });
mongoose.Promise = global.Promise;

module.exports = {
    mongoose: mongoose,
    Schema: mongoose.Schema
};