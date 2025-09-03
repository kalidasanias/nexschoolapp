/**
 * Created by Kiranmai A on 2/9/2017.
 */

var featureDomain = require('../common/domains/Feature'),
    mobileFeatureDomain = require('../common/domains/MobileFeature'),
    models = require('../models'),
    _ = require ('lodash'),
    logger = require('../../config/logger');

exports.schoolFeatureObjs = function(req, data) {
    var convertSchoolfeatureObjs = [];
    try {
        data.forEach(function (featureObj) {
            convertSchoolfeatureObjs.push(convertObj(featureObj));
        });
    }
    catch (err) {
        logger.debug(err);
        return err;
    }

    return buildNavObj(convertSchoolfeatureObjs);
};

exports.schoolFeatureObjsMobile = function(req, data) {
    var convertSchoolfeatureMobileObjs = [];
    try {
        data.forEach(function (featureObj) {
            var convertSchoolMobilefeatureObj = Object.assign({}, mobileFeatureDomain);
                convertSchoolMobilefeatureObj.featureId= featureObj['feature_id'],
                convertSchoolMobilefeatureObj.featureName = featureObj['feature_name'],
                convertSchoolMobilefeatureObj.mobilePriority = featureObj['mobile_priority'],
                convertSchoolMobilefeatureObj.tenantId = featureObj['tenant_id'],
                convertSchoolMobilefeatureObj.schoolId = featureObj['school_id'],
                convertSchoolMobilefeatureObj.schoolName = featureObj['school_name'],
                convertSchoolMobilefeatureObj.status = featureObj['status'],
                convertSchoolMobilefeatureObj.priority = featureObj['order_by'],
                convertSchoolMobilefeatureObj.sms = featureObj['sms'],
                convertSchoolMobilefeatureObj.email = featureObj['email'],
                convertSchoolMobilefeatureObj.push = featureObj['push'],
                convertSchoolMobilefeatureObj.id = featureObj['id'],
                convertSchoolMobilefeatureObj.assetUrl = featureObj['asset_url'],
                convertSchoolMobilefeatureObj.userTypes = featureObj['user_types'],
                convertSchoolMobilefeatureObj.images = featureObj['images'],
                convertSchoolMobilefeatureObj.title = featureObj['title'],
                convertSchoolMobilefeatureObj.screen = featureObj['screen'],
                convertSchoolfeatureMobileObjs.push(convertSchoolMobilefeatureObj);
        });
    }
    catch (err) {
        return err;
    }

    return convertSchoolfeatureMobileObjs;
};

function buildNavObj(data) {
    var parentData = _.sortBy(_.filter(data, {parentFeatureId: models.uuidFromString(constants.NAV_PARENT_ID)}), constants.PRIORITY);
    var setChildren = function (obj) {
        obj['hasChildren'] = false;
        var children = _.filter(data, {parentFeatureId: obj.id})
        obj['children'] = _.sortBy(children, constants.PRIORITY);
        if (children.length) {
            obj['hasChildren'] = true;
                children.forEach(function (obj) {
                setChildren(obj);
            });
        }
    }
    parentData.forEach(function (obj) {
        setChildren(obj);
    });

    return parentData;
};
exports.buildNavObj = buildNavObj;

function convertObj(featureObj) {
    var convertschoolChannelFeatureObj = Object.assign({}, featureDomain);
    convertschoolChannelFeatureObj.featureId= featureObj['feature_id'],
        convertschoolChannelFeatureObj.featureName = featureObj['feature_name'],
        convertschoolChannelFeatureObj.tenantId = featureObj['tenant_id'],
        convertschoolChannelFeatureObj.schoolId = featureObj['school_id'],
        convertschoolChannelFeatureObj.schoolName = featureObj['school_name'],
        convertschoolChannelFeatureObj.icon = featureObj['icon'],
        convertschoolChannelFeatureObj.activatedDate = featureObj['activated_date'],
        convertschoolChannelFeatureObj.expireDate = featureObj['expire_date'],
        convertschoolChannelFeatureObj.description = featureObj['description'],
        convertschoolChannelFeatureObj.status = featureObj['status'],
        convertschoolChannelFeatureObj.priority = featureObj['order_by'],
        convertschoolChannelFeatureObj.title = featureObj['title'],
        convertschoolChannelFeatureObj.sms = featureObj['sms'],
        convertschoolChannelFeatureObj.email = featureObj['email'],
        convertschoolChannelFeatureObj.push = featureObj['push'],
        convertschoolChannelFeatureObj.id = featureObj['id'],
        convertschoolChannelFeatureObj.isChannels = featureObj['is_channels'],
        convertschoolChannelFeatureObj.isOverride = featureObj['is_override'],
        convertschoolChannelFeatureObj.helpText =featureObj['help_text'],
        convertschoolChannelFeatureObj.link = featureObj['link'],
        convertschoolChannelFeatureObj.assetUrl = featureObj['asset_url'],
        convertschoolChannelFeatureObj.parentFeatureId = featureObj['parent_feature_id'],
        convertschoolChannelFeatureObj.notifyHostelers = featureObj['notify_hostelers']

    return convertschoolChannelFeatureObj;
}
exports.convertObj = convertObj;

exports.schoolChannelFeatureObjs = function(req, data) {
    var convertschoolChannelFeatureObjs = [];
    try {
        data.forEach(function (featureObj) {
            convertschoolChannelFeatureObjs.push(convertObj(featureObj));
        });
    }
    catch (err) {
        logger.debug(err);

        return err;
    }

    return buildChannelNavObj(convertschoolChannelFeatureObjs);
};

function buildChannelNavObj(data) {
    var ss;
    try {
        var setChildren = function (obj) {
            obj['hasChildren'] = false;
            var children = _.filter(data, {parentFeatureId: obj.id})
            obj['children'] = _.sortBy(children, constants.PRIORITY);
            if (children.length) {
                obj['hasChildren'] = true;
                children.forEach(function (obj) {
                    setChildren(obj);
                });
            }
        }
        data.forEach(function (obj) {
            setChildren(obj);
        });
         ss = _.filter(data , {hasChildren: true});

    }catch(err){
        logger.debug(err);

        return err;
    }

    return ss;
};
exports.buildChannelNavObj = buildChannelNavObj;

