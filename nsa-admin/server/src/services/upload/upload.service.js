/**
 * Created by admin on 25/04/17.
 */
var AWS = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')

AWS.config.update({
    secretAccessKey: 'pS3CO5e3aY/UdzPIO/x6yqDvMii96zdS60i+eUtO',
    accessKeyId: 'AKIAIJ34EBCU2FQBWG2A',
    region: 'ap-south-1',
});

var s3 = new AWS.S3();

var upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: function (req, file, cb) {
            cb(null, getBucketName(req))
        },
        key: function (req, file, cb) {
            cb(null, req.headers.basepath + file.originalname);
        }
    })
}).any()
exports.upload = upload;

function getHeaders(req) {
    var headers = {user_id: req.headers.userInfo.user_name, user_name:req.headers.userInfo.first_name,
        user_type: req.headers.userInfo.user_type, tenant_id: req.headers.userInfo.tenant_id,
        school_id: req.headers.userInfo.school_id,
        school_name: req.headers.userInfo.school_name
    }
    return headers;
};

function getBucketName(req) {
    var headers = getHeaders(req);
    return headers.school_id;
};