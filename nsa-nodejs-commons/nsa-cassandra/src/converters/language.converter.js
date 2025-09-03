/**
 * Created by Kiranmai A on 2/8/2017.
 */

var requestParam = require('../common/domains/RequestParam');
var schoolLanguageDomain = require('../common/domains/Language'),
    logger = require('../../../../../config/logger');


exports.schoolLanguageObjs = function(req, data) {
    var convertSchoolLanguageObjs = [];
    try {
        data.forEach(function (languageObj) {
            var convertSchoolLanguageObj = Object.assign({}, schoolLanguageDomain);
            convertSchoolLanguageObj.languageId= languageObj['language_id'],
                convertSchoolLanguageObj.languageName = languageObj['language_name'],
                convertSchoolLanguageObj.tenantId = languageObj['tenant_id'],
                convertSchoolLanguageObj.schoolId = languageObj['school_id']
                convertSchoolLanguageObjs.push(convertSchoolLanguageObj);
        });
    }
    catch (err) {
        logger.debug(err);
        return err;
    }
    return convertSchoolLanguageObjs;
};
