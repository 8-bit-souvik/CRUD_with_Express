const moment = require('moment');
const fs = require('fs');




const logger = (req, res, next) => {







    const remoteIP = req.connection.remoteAddress;
    var array = remoteIP.split(':')
    var clientIP = array[array.length - 1]

    const serverIP = req.connection.localAddress;
    var array = serverIP.split(':')
    var hostIP = array[array.length - 1]

    if (hostIP == 1) {
        hostIP = 'localhost'
    }
    if (clientIP == 1) {
        clientIP = 'localhost'
    }



    var consoleView = `${req.protocol}://${clientIP}:${req.connection.remotePort}      ${req.protocol}://${hostIP}:${req.connection.localPort}${req.originalUrl}      time: ${moment().format()} `;

    console.log(`${consoleView}`);



    var log = `from ${req.protocol}://${clientIP}:${req.connection.remotePort}      to ${req.protocol}://${hostIP}:${req.connection.localPort}${req.originalUrl}: ${moment().format()} \n`;

    fs.appendFile(`${__dirname}/../logs/request_details.log`, log, 'utf8', (err => {
        if (err) return (console.log(err));
    }))


    next();
};


module.exports = logger;