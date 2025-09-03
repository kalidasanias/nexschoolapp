/**
 * Created by Kiranmai A on 2/9/2017.
 */

var requestParam = require('../common/domains/RequestParam');
var schoolTermsDomain = require('../common/domains/Terms');


exports.schoolTermsObjs = function(req, res, data) {
    convertSchoolTermsObjs = [];
    try {
        data.forEach(function (termObj) {
            var convertSchoolTermsObj = Object.assign({}, schoolTermsDomain);
                convertSchoolTermsObj.id= termObj['id'],
                convertSchoolTermsObj.tenantId = termObj['tenant_id'],
                convertSchoolTermsObj.schoolId = termObj['school_id'],
                convertSchoolTermsObj.academicYear = termObj['ac_year'],
                convertSchoolTermsObj.termName = termObj['term'],
                convertSchoolTermsObj.startDate = termObj['start_date'],
                convertSchoolTermsObj.endDate = termObj['end_date']
            convertSchoolTermsObjs.push(convertSchoolTermsObj);
        });
    }
    catch (err) {
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertSchoolTermsObjs;
};