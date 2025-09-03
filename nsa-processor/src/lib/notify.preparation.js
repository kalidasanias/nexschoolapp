/**
 * Created by bharatkumarr on 01/06/17.
 */

var http = require('http');

exports.preparation = function(data, cb) {
    // setTimeout(function() {
        var url = 'http://'+ global.config.server.host + ':' +  global.config.server.port + '/processor/prepare/';
        var requestObj = http.get(url, function (res) {
            var body = '';
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                body += chunk;
            });

            res.on('end', function () {
                var response = JSON.parse(body);
                data = response.data;
                cb(null, data);
            });

            res.on('error', cb);
        }).on('error', cb).end();
    // }, 1000);
};

exports.sendNotification = function(preparationData, school_id, users, params, callback) {
    var url = 'http://'+ global.config.server.host + ':' +  global.config.server.port + '/notification/';

    var json = {};
    json['preparationData'] = preparationData;
    json['school_id'] = school_id;
    json['users'] = users;
    json['params'] = params;

    var jsonObject = JSON.stringify(json);

    // prepare the header
    var postheaders = {
        'Content-Type' : 'application/json',
        'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
    };

    // the post options
    var optionspost = {
        host : global.config.server.host,
        port : global.config.server.port,
        path : '/notification/',
        method : 'POST',
        headers : postheaders
    };

    var reqPost = http.request(optionspost, function(res) {
        console.log("statusCode: ", res.statusCode);
        // uncomment it for header details

        res.on('data', function(d) {
            console.info('POST result:\n');
            callback(d);
            console.info('\n\nPOST completed');
        });
    });

    // write the json data
    reqPost.write(jsonObject);
    reqPost.end();
    reqPost.on('error', function(e) {
        console.error(e);
    });
};