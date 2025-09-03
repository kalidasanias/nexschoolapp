
var express = require('express')
    , router = express.Router();

var models = require('../../models');

const dataBaseUrl = '../../test/json-data/';

exports.suggestions = function(req, res) {
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
            res.status(403).send({success: false, data: err});
        } else if (JSON.stringify(result) != '[]') {
            res.status(201).send({success: true, data: result});
        } else {
            res.send(require(dataBaseUrl + 'failure/failure.json'));
        }
    });
};

exports.roles = function(req, res) {
    var query ={ id : {'$token' : { '$gt': 1}}};
    models.instance.RoleType.find(query, function(err, result){
        if(err) {
            res.status(403).send({success: false, data: err});
        } else {
            res.status(201).send({success: true, data: result});
        }
    });
};