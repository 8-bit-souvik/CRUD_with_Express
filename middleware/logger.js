const moment = require('moment');
const fs = require('fs');

const logger = (req, res, next) => {

    var log =  `${req.protocol}://${req.get('host')}${req.originalUrl}: ${moment().format()} \n`;
    

fs.appendFile("../logs/request_details.log", log, 'utf8', (err => {
    if (err) return (console.log(err));
}))


    next();
};

module.exports = logger;