var express = require('express')
var cors = require('cors')
var parseurl = require('parseurl')
var session = require('express-session')
var http = require('http')
var fs = require('fs')

var app = express()

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(cors());

app.use(function (req, res, next) {
    var views = req.session.views

    if (!views) {
        views = req.session.views = {}
    }

    // get the url pathname
    var pathname = parseurl(req).pathname

    // count the views
    views[pathname] = (views[pathname] || 0) + 1

    next()
})

app.get('/foo', function (req, res, next) {
    // console.info('session', req.session);
    res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
})

app.get('/bar', function (req, res, next) {
    res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})

var index = 0;
var obj1 = JSON.parse(fs.readFileSync('./19_04_data.json', 'utf8'));
var obj2 = JSON.parse(fs.readFileSync('./data.json', 'utf8'));



app.get('/vehicleinfo/:id', function (req, res, next) {
    console.info('vehicleinfo.....',req.params.id)
    var vehicleLocation, length, array = [];

    console.info('obj1....',obj1.vehicleLocations.length,req.params.id === 'TN14E1869');
    console.info('obj2....',obj2.vehicleLocations.length,req.params.id === 'TN22CF8989');
    if (req.params.id === 'TN14E1869' && index < obj1.vehicleLocations.length) {
        console.info('if...');
    // var obj = JSON.parse(fs.readFileSync('./diffpath.json', 'utf8'));
        vehicleLocation = obj1.vehicleLocations[index];
        vehicleLocation.regNo= "TN14E1869";
        vehicleLocation.vehicleType= "Car";
        vehicleLocation.vehicleId= "TN14E1869";
        var json = { rowId: 0, group:"7ca3fad4-a571-495e-be1b-ac25de3a2009:SMP", vehicleLocations: [vehicleLocation] }
        array.push(json);
        index++;
        if (index === 75) {
            index = 0;
        }
    } else if (req.params.id === 'TN22CF8989' && index < obj2.vehicleLocations.length) {
        console.info('else if...')
        // obj2 = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
    // var obj = JSON.parse(fs.readFileSync('./diffpath.json', 'utf8'));
        vehicleLocation = obj2.vehicleLocations[index];
        vehicleLocation.regNo= "TN22CF8989";
        vehicleLocation.vehicleType= "Car";
        vehicleLocation.vehicleId= "TN22CF8989";
        var json = { rowId: 1, group:"magsun:SMP", vehicleLocations: [vehicleLocation] }
        array.push(json);
        index++;
        if (index === 93) {
            index = 0;
        }
    }
    
    res.send(vehicleLocation);
})

http.createServer(app).listen(9090, function () {
    console.log('Nexrise server listening on port 9090');
});