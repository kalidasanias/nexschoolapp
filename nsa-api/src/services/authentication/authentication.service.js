/**
 * Created by senthilPeriyasamy on 12/23/2016.
 */
var models = require('../../models');
var jwt = require('jwt-simple');
var passwordHash = require('password-hash');
var env = process.env.NODE_ENV || "development";
var config = require('../../../config/config.json')[env];
var _ = require('lodash');
var jwta = require('jsonwebtoken');
var session = require('express-session');

exports.authenticate = function(req, res) {
    var username = req.body.username;
    console.info('username = ', username);
    console.info('password = ', req.body.password);
    models.instance.User.findOne({user_name: username},{allow_filtering: true} ,function(err, result){
        if(err) {
            res.status(400).send({success: false, data: err});
        } else if (!result){
            res.status(403).send({success: false, message: 'Authentication failed, User not found'});
        } else {
            if(result && passwordHash.verify(req.body.password, result.password)) {

                var user = {id: result.id, user_name: result.user_name, name : result.name, school_id : result.school_id, school_name : result.school_name, tenant_id: result.tenant_id,
                    registration_id: result.registration_id, endpoint_arn: result.endpoint_arn, device_id: result.device_id};

                /*var sessionUser = req.session.user;
                 console.info('sessionUser = ', sessionUser);
                 if (!sessionUser) {
                 sessionUser = req.session.user = {}
                 }*/

                res.status(200).send({success: true, user: user});
            } else {
                return res.status(403).send({success: false, msg: 'Authenticaton failed, wrong password.'});
            }
        }
    });
};

function createToken(user) {
    return jwta.sign(_.omit(user, ''), config.password, { expiresIn: 6000*5 });
}