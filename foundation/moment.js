const moment = require('moment');

function timeConverter(UNIX_timestamp){
    var dateTimeString = moment(UNIX_timestamp).format("DD-MM-YYYY h:mm:ss a");
    return dateTimeString;
};

function showMonthAndYear (UNIX_timestamp) { 
    return moment(UNIX_timestamp).locale('vn').format("MMMM YYYY");
};

function getMonth (UNIX_timestamp) { 
    return moment(UNIX_timestamp).locale('vn').format("MMMM");
};

function getYear (UNIX_timestamp) { 
    return moment(UNIX_timestamp).locale('vn').format("YYYY");
};

function getDay (UNIX_timestamp) { 
    return moment(UNIX_timestamp).locale('vn').format("DD");
};

module.exports = {
    timeConverter,
    showMonthAndYear,
    getDay,
    getMonth,
    getYear
};