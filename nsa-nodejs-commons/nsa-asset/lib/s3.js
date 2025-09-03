/**
 * Created by admin on 26/04/17.
 */

var AWS = require('aws-sdk'),
    baseService = require('./common/base.service'),
    multer = require('multer'),
    formidable = require('formidable')
    multerS3 = require('multer-s3'),
    nodeClient = require('s3-node-client'),
    imageSize = require('s3-image-size');

AWS.config.update({
    secretAccessKey: 'pS3CO5e3aY/UdzPIO/x6yqDvMii96zdS60i+eUtO',
    accessKeyId: 'AKIAIJ34EBCU2FQBWG2A',
    region: 'ap-south-1',
});

var s3 = new AWS.S3();

function getImageDimensions(bucket, key, callback) {
    imageSize(s3, bucket, key, function(err, dimensions) {
        callback(err, dimensions);
    });
};
exports.getImageDimensions = getImageDimensions;


var upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: function (req, file, cb) {
            cb(null, baseService.getBucketName(req))
        },
        key: function (req, file, cb) {
            var uploadId = req.body.uploadId
            var host = req.headers.host.split(":");
            if(uploadId == undefined) {
                var headers = req.headers;
                cb(null, host[0] + '/' + req.headers.basepath + headers.uploadid + '/' + file.originalname);
            }
            if(uploadId != undefined) {
                cb(null, host[0] + '/' + req.headers.basepath + uploadId + '/' + file.originalname);
            }
        }
    })
}).any()
exports.upload = upload;

function checkBucket(req) {
    isBucketAvailble(req, function (err, data) {
        if(err) {
            createBuckets(req, function (err, data) {
                return baseService.getBucketName(req);
            })
        } else {
            if(data.sucess) {
                return baseService.getBucketName(req);
            }
            createBuckets(req, function (err, data) {
                return baseService.getBucketName(req);
            })
        }
    })
};

function listBuckets(req, callback) {
    s3.listBuckets(function(err, data) {
        callback(err, data)
    });
};

exports.listBuckets = listBuckets;

function createBuckets(req, callback) {
    var bucketName = baseService.getBucketName(req);
    var bucketParams = {
        Bucket : bucketName
    }
    s3.createBucket(bucketParams, function(err, data) {
        callback(err, data)
    });
};

exports.createBuckets = createBuckets;

function isBucketAvailble(req, callback) {
    var bucketName = baseService.getBucketName(req);
    var bucketParams = {
        Bucket : bucketName
    }
    s3.headBucket(bucketParams, function(err, data) {
        callback(err, data)
    });
};

exports.isBucketAvailble = isBucketAvailble;


function deleteObject(req, objects, callback) {
    var bucketName = baseService.getBucketName(req);
    var params = {
        Bucket: baseService.getBucketName(req),
        Delete: {
            Objects: objects
        },
    };

    s3.deleteObjects(params, function(err, data) {
        callback(err, data)
    });
};

exports.deleteObject = deleteObject;

function uploadFile(req, buffer, filename, uploadid, cb) {
    var host = req.headers.host.split(":");
    var key = host[0] + '/' + req.headers.basepath + uploadid + '/' + (new Date()).getTime() + '/' + filename;
    s3.putObject({
        ACL: 'public-read',
        Bucket: baseService.getBucketName(req),
        Key: key,
        Body: buffer
    }, function(err, data){
        if (err) {
            cb(err, null);
        } else {
            cb(null, key);
        }
    })
};
exports.uploadFile = uploadFile;
