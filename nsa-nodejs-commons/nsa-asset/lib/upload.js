/**
 * Created by karthik on 04-04-2017.
 */

var express = require('express'),
    AWS = require('aws-sdk'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    multiparty = require('multiparty'),
    async = require('async');

//var s3 = new AWS.S3();

var s3 = new AWS.S3({
    endpoint: 's3.ap-south-1.amazonaws.com',
    signatureVersion: 'v4',
    region: 'ap-south-1'
});

exports.uploadFiles = function(req, data, callback) {
    var form = new multiparty.Form();
    form.parse(req, function(err, form, files){

        async.map(files, function (values, callback) {
            saveFileObject(values, data, function(err, result){
                callback(err, result);
            });
        }, function allDone() {
            callback(null, 'successfully uploaded');
        }, callback);
    });
};


function saveFileObject(values, data, callback) {
    async.map(values, function (value, callback) {
        var fieldName = value['fieldName'];
        var path = value['path'];
        var header = value['headers'];
        var headers = header['content-type'];
        fs.readFile(path, function (err, result) {
            var folder = data.url + fieldName;
            var params = {Bucket: data.bucketId, Key: folder, ACL: 'public-read', Body: result};
            if (err) {
                throw err;
            }
            s3.putObject(params, function (err, res) {
                callback(err, res);
            })
        });
    }, function allDone() {
        callback(null, 'successfully uploaded');
    }, callback);
};