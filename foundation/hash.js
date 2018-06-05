const bcrypt = require('bcrypt');

function hash(password) { 
    return new Promise( (resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return reject (err);
            bcrypt.hash(password, salt, (err, data) => {
                if (err) return reject(err);
                return resolve(data);
            });
        });
    });
}

// trả về true | false
function compare(password, hashPassword) { 
    return new Promise( (resolve, reject) => {
        bcrypt.compare(password, hashPassword, (err, res) => {
            if (err) return reject(err);
            return resolve(res);
        });
    });
}

module.exports = { 
    hash: hash,
    compare: compare };