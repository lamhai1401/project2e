const ipInfo        = require("ipinfo");
const ipdetail      = require('../models/ipdetail');
const request       = require('../foundation/httpget');
const IPPUBLIC_URL  = require('../config/config').ip_pubblic;

const ippublic_middleware = (req, res, next) => {
    request(IPPUBLIC_URL, ippublic => {
        ipInfo(ippublic.ip, (err, data) => {
            ipdetail.create(data);
        });
        next();
    });
};

module.exports = ippublic_middleware;