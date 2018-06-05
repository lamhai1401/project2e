const string    = require('./foundation/string');
const hash      = require('./foundation/hash');
const moment    = require('./foundation/moment');
const jwt       = require('./foundation/jwt');
const hardware  = require('./foundation/hardware');
const random    = require('./foundation/random');
const sendmail  = require('./foundation/nodemailer');

module.exports = {
    string  : string,
    hash    : hash.hash,
    sendCode: sendmail.ConfirmEmail,
    compare : hash.compare,
    moment  : moment,
    jwt     : jwt,
    random  : random,
    hardware: hardware
};