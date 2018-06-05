const Random = require('random-js');
const random = new Random(Random.engines.mt19937().autoSeed());

// độ dài chữ số muốn random từ param1 -> param2
function getRandomInteger (param1, param2) { 
    return new Promise ( (resolve, reject) => {
        const value = random.integer(param1, param2);
        if (!value) return reject('Can not get random number !');
        return resolve(value);
    });
};

// độ dài xâu muốn lấy
function getRandomString (param1) {
    return new Promise ( (resolve, reject) => {
        const str = random.string(param1);
        if (!str) return reject ('Can not get random string !');
        return resolve(str);
    });
};

module.exports = { getRandomInteger, getRandomString };