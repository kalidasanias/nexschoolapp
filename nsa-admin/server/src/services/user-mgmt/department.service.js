/**
 * Created by bharatkumarr on 20/03/17.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    constant = require('@nsa/nsa-commons').constants,
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    logger = require('../../../config/logger');

exports.getAllDepartments = function(req, res) {
    nsaCassandra.Department.getAllDepartments(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4007));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};


exports.getDepartment = function (req, res) {
    nsaCassandra.UserClassify.findDeptIdInEmpClassification(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if (!_.isEmpty(result)) {
               events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            nsaCassandra.Department.getDepartment(req, function (err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4007));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            })
        }
    })
};


/*exports.getDepartment = function (req, res) {
    nsaCassandra.Department.getDepartment(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4007));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};*/

exports.saveDepartment = function(req, res) {
    async.waterfall([
        saveDept.bind(null, req),
        getRootDeptTaxanomy.bind(),
        addDeptTaxonomy.bind(),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function (err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4002));
        } else {
            result['message'] = message.nsa4001;
            events.emit('JsonResponse', req, res, result);
        }
    });
};

function saveDept(req, callback) {
    nsaCassandra.Department.saveDepartment(req, function (err, result) {
        result.features = {actions : constant.CREATE, featureTypeId : result.dept_id};
        callback(err, req, result);
    })
};
exports.saveDept = saveDept;

function getRootDeptTaxanomy(req, data, callback) {
    nsaCassandra.Department.getRootDeptTaxanomy(req, data, function (err, data) {
        callback(err, req, data);
    })
};
exports.getRootDeptTaxanomy = getRootDeptTaxanomy;

function addDeptTaxonomy(req, data, callback) {
    nsaCassandra.Department.addDeptTaxonomy(req, data, function (err, data) {
        callback(err, req, data);
    })
};
exports.addDeptTaxonomy = addDeptTaxonomy;

exports.updateDepartment = function(req, res) {
    async.waterfall([
        updateDept.bind(null, req),
        getDeptTaxonomy.bind(),
        updateDeptTaxonomy.bind(),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function (err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4004));
        } else {
            result['message'] = message.nsa4003;
            events.emit('JsonResponse', req, res, result);
        }
    });
};

function updateDept(req, callback) {
    nsaCassandra.Department.updateDepartment(req, function (err, result) {
        result.features = {actions : constant.UPDATE, featureTypeId : result.dept_id};
        callback(err, req, result);
    })
};
exports.updateDept = updateDept;

function getDeptTaxonomy(req, data, callback) {
    nsaCassandra.Department.getDeptTaxonomy(req, data, function (err, data) {
        callback(err, req, data);
    })
};
exports.getDeptTaxonomy = getDeptTaxonomy;

function updateDeptTaxonomy(req, data, callback) {
    nsaCassandra.Department.updateDeptTaxonomy(req, data, function (err, data) {
        callback(err, req, data);
    })
};
exports.updateDeptTaxonomy = updateDeptTaxonomy;

exports.deleteDepartment = function(req, res) {
    async.parallel({
        employee: nsaCassandra.UserClassify.findDeptIdInEmpClassification.bind(null, req),
        subjects: nsaCassandra.Subject.findDeptIdInSchoolSubjects.bind(null, req),
    }, function(err, data){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4006));
        } else if(!_.isEmpty(data.employee) || !_.isEmpty(data.subjects)){
            var result = {};
             result['message'] = message.nsa10002;
            events.emit('ErrorJsonResponse', req, res, result);
        } else {
            async.waterfall([
                deleteDept.bind(null, req),
                getDeptTaxonomy.bind(),
                deleteDeptTaxonomy.bind(),
                insertAuditLog.bind(),
                executeBatch.bind()
            ], function (err, result) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4006));
                } else {
                    result['message'] = message.nsa4005;
                    events.emit('JsonResponse', req, res, result);
                }
            });
        }
    })
};

function deleteDept(req, callback) {
    nsaCassandra.Department.deleteDepartment(req, function (err, result) {
        result.features = {actions : constant.DELETE, featureTypeId : result.dept_id};
        callback(err, req, result);
    })
};
exports.deleteDept = deleteDept;

function deleteDeptTaxonomy(req, data, callback) {
    nsaCassandra.BaseService.deleteTaxonomyObj(req, data, function (err, data) {
        callback(err, req, data);
    })
};
exports.deleteDeptTaxonomy = deleteDeptTaxonomy;

function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, data) {
        callback(err, req, data);
    })
};
exports.insertAuditLog = insertAuditLog;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, result);
    })
};
exports.executeBatch = executeBatch;

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.DEPARTMENT, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildErrResponse = buildErrResponse;

function throwUserErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.DEPARTMENT, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwUserErr = throwUserErr;