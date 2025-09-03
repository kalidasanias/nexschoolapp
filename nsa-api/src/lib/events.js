/**
 * Created by Sai Deepak on 12-Sep-16.
 */
var events = require('events');

//create an object of EventEmitter class by using above reference
var rem = new events.EventEmitter();

rem.on('JsonResponse', function (req, res, data) {
    res.send(data);
});

rem.on('ErrorJsonResponse', function (req, res, err) {
    res.status(500).send(err);
});

module.exports = rem;