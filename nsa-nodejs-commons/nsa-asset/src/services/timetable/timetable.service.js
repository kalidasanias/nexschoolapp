/**
 * Created by karthik on 04-04-2017.
 */

var express = require('express'),
    AWS = require('aws-sdk'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    multiparty = require('multiparty');

var s3 = new AWS.S3();

exports.uploadNotes = function(req, callback) {
    var form = new multiparty.Form();
    form.parse(req, function(err, form, files){
        Object.keys(files).forEach(function(name){
            files[name].forEach(function(values){

                var fieldName = values['fieldName'];
                var path =  values['path'];
                var header = values['headers'];
                var headers = header['content-type'];
                fs.readFile(path, function (err, data) {
                    var params = {Bucket: 'nexrise-cyril', Key: fieldName, ACL: 'public-read', Body: data};
                    if (err) { throw err; }
                    s3.putObject(params, function (res) {
                        console.log('Successfully uploaded file.', fieldName);
                    })

                });
            });
        });
    });
};

