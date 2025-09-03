/**
 * Created by Cyril on 4/25/2017.
 */
var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    constant = require('@nsa/nsa-commons').constants,
    BaseError = require('@nsa/nsa-commons').BaseError;


exports.getAllCourseDepartments = function(req, res) {
    nsaCassandra.Course.getAllCourseDepartments(req, function(err, response) {
        if(err) {
            throwCourseManagementErr(err, message.nsa450)
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

function throwCourseManagementErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.COURSE_MANAGEMENT, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwCourseManagementErr = throwCourseManagementErr;