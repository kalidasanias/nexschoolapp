/**
 * Created by senthil on 2/23/2017.
 */
'use strict';

var email 	= require("emailjs/email");

var Email = function f(options) {
    var self = this;
};

Email.sendEmail = function(req, callback) {
    var server 	= email.server.connect({
        user:    "psenthil@intellishine.com",
        password:"Smagesh_48",
        host:    "smtp.zoho.com",
        ssl:     true
    });

    server.send({
        text:    "i hope this works",
        from:    "Senthil <psenthil@intellishine.com>",
        to:      "cyril<cyril@intellishine.com>",
        subject: "testing emailjs"
    }, function(err, message) {
        callback(err, message)
    });
}

module.exports = Email;