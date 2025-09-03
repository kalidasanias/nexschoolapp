/**
 * Created by bharatkumarr on 17/04/17.
 */
var nsaCassandra = require('@nsa/nsa-cassandra'),
    _ = require('lodash'),
    speakeasy = require("speakeasy");

exports.waterfallOver =  function(req, list, saveObj, data, callback) {
    var nextItemIndex = 0;  //keep track of the index of the next item to be processed

    function report(err, result) {
        nextItemIndex++;

        if (err) {
            callback(err, result);
            return;
        }
        // if nextItemIndex equals the number of items in list, then we're done
        if(nextItemIndex === list.length) {
            callback(err, result);
        } else
        // otherwise, call the iterator on the next item
            saveObj(req, list[nextItemIndex], data, report);
    }
    // instead of starting all the iterations, we only start the 1st one
    saveObj(req, list[0], data, report);
}


exports.updateIdsFromHeader = function(req, obj, dateAlone) {
    obj.school_id = models.uuidFromString(req.headers.userInfo.school_id);
    obj.tenant_id = models.timeuuidFromString(req.headers.userInfo.tenant_id);
    obj.updated_date = new Date();
    if (!dateAlone) {
        obj.updated_by = req.headers.userInfo.user_name;
        obj.updated_username = req.headers.userInfo.first_name;
        obj.created_date = new Date();
        obj.created_by = req.headers.userInfo.user_name;
        obj.created_firstname = req.headers.userInfo.first_name;
    }
    return obj;
};

exports.getAssetUrl = function(req, res, next) {
    nsaCassandra.Feature.getFeatureDetails(req, function(err, result){
        var assetUrl = result.asset_url;
        req.headers.basepath = assetUrl;
        next();
    });
};

exports.generateSecret = function (req) {
    var secret = speakeasy.generateSecret({length: 20});
    var token = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
        window: 4,
        step: 60
    });

    return secret;
}

exports.generateToken = function (secret) {
    var token = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
        window: 2,
        step: 60
    });

    return token;
}

exports.verifySecret = function (req) {
    var sec = req.body.secret;
    var otp = req.body.otp;
    var verified = speakeasy.totp.verify({
        secret: sec.base32,
        encoding: 'base32',
        token: otp,
        window: 2,
        step: 60
    });

    return verified;
}

function constructS3DeleteObjs(ids) {
    var s3Objects = []
    _.forEach(ids, function (value, key) {
        var obj = {Key: value}
        s3Objects.push(obj);
    })

    return s3Objects;

}
exports.constructS3DeleteObjs = constructS3DeleteObjs;

function filterObjByKeyValue(objs, filterObj) {
    return _.filter(objs, filterObj);
}
exports.filterObjByKeyValue = filterObjByKeyValue;