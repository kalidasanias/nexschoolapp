/**
 * Created by Kiranmai A on 2/8/2017.
 */

var requestParam = require('../common/domains/RequestParam');
var schoolLanguageDomain = require('../common/domains/Language');


exports.schoolLanguageObjs = function(req, res, data) {
    convertSchoolLanguageObjs = [];
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
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertSchoolLanguageObjs;
};
