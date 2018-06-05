const jwt = require('jsonwebtoken');
const KEY = 'q225234454>>*(&*^&%^*%@!651d.0g654gd8fh/97t83AGDHGNNGF4t53er1df.b0fg2.h1e89t';

function createToken(payload) { 
    return new Promise((resolve, reject) =>{
        jwt.sign(payload, KEY, { algorithm: 'HS256', expiresIn: '2 days' }, (err, token) => {
            if (err) return reject(err);
            return resolve(token);
        });
    });
}

function verifyToken(token) { 
    return new Promise((resolve, reject) => {
        jwt.verify(token, KEY, (err, payload) => {
            if (err) return reject(err);
            return resolve(payload);
        });
    });
}

// const payload = {
//     username: 'test10',
//     password: '123456'
// };

// createToken(payload)
// .then(token => console.log(token))
// .catch(err => console.log(err));

module.exports = { 
    createToken: createToken, 
    verifyToken: verifyToken
};