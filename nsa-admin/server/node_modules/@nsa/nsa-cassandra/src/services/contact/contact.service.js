
var express = require('express')
    , router = express.Router();

var models = require('../../models/index');

var Contact = function f(options) {
    var self = this;
};

Contact.suggestions = function(req, callback) {
    /*var queryParam = req.query;
    var data = require(dataBaseUrl + 'contact/contact-suggestions.json');
    res.send(data);*/
    var tenant_id = req.headers.tenant_id;
    var school_id = req.headers.school_id;
    var q = req.query.q;
    var query = {
        primary_phone: {'$like': q +'%'}
    }
    models.instance.UserByRole.find(query, {tenant_id: models.timeuuidFromString(tenant_id),
        school_id: models.uuidFromString(school_id)}, function(err, result){
        if(err) {
            callback(err, {success: false, data: err});
        } else if (JSON.stringify(result) != '[]') {
            callback(err, {success: true, data: result});
        } else {
            callback(err, {success: false, data: err});
        }
    });
};

Contact.roles = function(req, callback) {
    var query ={ id : {'$token' : { '$gt': 1}}};
    models.instance.RoleType.find(query, function(err, result){
        if(err) {
            callback(err, {success: false, data: err});
        } else {
            callback(err, {success: true, data: result});
        }
    });
};