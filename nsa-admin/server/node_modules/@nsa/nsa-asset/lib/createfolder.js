/**
 * Created by Cyril on 4/10/2017.
 */



var AWS = require('aws-sdk'),
    fs = require('fs'),
    asyncLoop = require('node-async-loop');
s3Client = new AWS.S3();


var directories = {
    "data": [{
        "schoolId": "ihj5420-ea0d-11e6-8b3a-9d7cc28d7cch",
        "tenantId": "uu85420-ea0d-11e6-8b3a-9d7cc28d7cch",
        "acadamicYear": "2018 - 2019",
        "features": [{
            "featureId": "c6445420-ea0d-11e6-8b3a-9d7cc28d7cch",
            "featureName": "Assignements",
            "subFeatures": [{
                "subFeatureId": "5545454",
                "subFeatureName": "Create Assignment"
            }]
        }, {
            "featureId": "c6445420-ea0d-11e6-8b3a-9d7cc28d7cch",
            "featureName": "Timetable",

            "subfeatures": [{
                "subfeatureId": "5545454",
                "subFeatureName": "Class notes"

            }]
        }, {
            "featureId": "77xjj20-ea0d-11e6-8b3a-9d7cc28d7cch",
            "featureName": "Asset management",
            "subfeatures": [{
                "subfeatureId": "223555",
                "subFeatureName": "Files"

            }, {
                "subfeatureId": "2259896",
                "subFeatureName": "Documents"

            }, {
                "subfeatureId": "2259556",
                "subFeatureName": "Gallery"

            }]
        }]
    }]
};

exports.makeDir = function(req, callback) {

    asyncLoop(directories, function (directory, next)
    {
        var directory1 = directory.value[0].schoolId;
        var directory2 = directory.value[0].features[0].featureId;
        var directory3 = directory.value[0].features[0].featureName;
        var directory4 = directory.value[0].features[0].subFeatures[0].subFeatureId;
        var directory5 = directory.value[0].features[0].subFeatures[0].subFeatureName;
        var directory6 = directory.value[0].acadamicYear;

        var folder = directory1 + '/' + directory2 + '/' + directory3 + '/' + directory4 + '/' + directory5 + '/' + directory6 + '/';
        var params = { Bucket: directory1, Key: folder, ACL: 'public-read', Body:'body does not matter' };
        s3Client.upload(params, function (err, data) {
            if (err) {
                console.log("Error creating the folder: ", err);
            } else {
                console.log("Successfully created a folder on S3");
            }

        });
        next();
        callback(err, next);
    });

};

exports.createBucket = function(req, callback) {
    asyncLoop(directories, function (directory, next) {
        var directory1 = directory.value[0].schoolId;
        var s3 = new AWS.S3({params: {Bucket: directory1,ACL: 'public-read',

        }});
        s3.createBucket(function (err, result) {
        });
    });

};

exports.getFile = function(req, callback) {
    var directory1 = 'nexrise-cyril';
    var s3 = new AWS.S3({params: {Bucket: directory1, Key: "1.jpg", ACL: 'public-read'}});
    console.log("s3", s3);
    var filesOnly = [];
        if(!err1) {
            for(var i = 0; i < files.length; i++) {
                (function(index) {
                    var imgFilePath = SYNCDIR + '/' + files[index];
                    s3.getObject(function (err, result) {
                        console.log("error s3 ", err);
                        test.push(result);
                    });
                })(i);
            }
        }
    /*asyncLoop(directories, function (directory, next) {
        var directory1 = 'nexrise-cyril';
        var s3 = new AWS.S3({params: {Bucket: directory1, Key: "1.jpg", ACL: 'public-read'}});
        s3.getObject(function (err, result) {
            console.log("error s3 ", err);
            test.push(result);
        });
    });*/
};


/*
function folderCreate() {
    asyncLoop(directories, function (directory, next)
    {
        var directory1 = directory.value[0].schoolId;
        var directory2 = directory.value[0].features[0].featureId;
        var directory3 = directory.value[0].features[0].featureName;
        var directory4 = directory.value[0].features[0].subFeatures[0].subFeatureId;
        var directory5 = directory.value[0].features[0].subFeatures[0].subFeatureName;
        var directory6 = directory.value[0].acadamicYear;

        var folder = directory1 + '/' + directory2 + '/' + directory3 + '/' + directory4 + '/' + directory5 + '/' + directory6 + '/';
        var params = { Bucket: directory1, Key: folder, ACL: 'public-read', Body:'body does not matter' };
        s3Client.upload(params, function (err, data) {
            if (err) {
                console.log("Error creating the folder: ", err);
            } else {
                console.log("Successfully created a folder on S3");
            }
        });
        next();

    }, function (err)
    {
        if (err)
        {
            console.error('Error: ' + err.message);
            return;
        }

        console.log('Finished!');
    });
}*/
