/**
 * Created by Kiranmai A on 2/9/2017.
 */

var requestParam = require('../common/domains/RequestParam');
var featureDomain = require('../common/domains/Feature');


exports.schoolFeatureObjs = function(req, res, data) {
    convertSchoolfeatureObjs = [];
    try {
        data.forEach(function (featureObj) {
            var convertSchoolfeatureObj = Object.assign({}, featureDomain);
                convertSchoolfeatureObj.featureId= featureObj['feature_id'],
                convertSchoolfeatureObj.featureName = featureObj['feature_name'],
                convertSchoolfeatureObj.tenantId = featureObj['tenant_id'],
                convertSchoolfeatureObj.schoolId = featureObj['school_id'],
                convertSchoolfeatureObj.schoolName = featureObj['school_name'],
                convertSchoolfeatureObj.icon = featureObj['icon'],
                convertSchoolfeatureObj.activatedDate = featureObj['activated_date'],
                convertSchoolfeatureObj.expireDate = featureObj['expire_date'],
                convertSchoolfeatureObj.description = featureObj['description'],
                convertSchoolfeatureObj.status = featureObj['status']
            convertSchoolfeatureObjs.push(convertSchoolfeatureObj);
        });
    }
    catch (err) {
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertSchoolfeatureObjs;
};