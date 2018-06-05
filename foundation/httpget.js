const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

// httpGetAsync("http://bot.whatismyipaddress.com/", data => {
//     console.log(data);
// });

module.exports = httpGetAsync;