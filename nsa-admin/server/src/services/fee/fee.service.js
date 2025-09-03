var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    es = require('../../services/search/elasticsearch/elasticsearch.service'),
    async = require('async'),
    taxanomyUtils = require('@nsa/nsa-commons').taxanomyUtils,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    notificationService = require('../sms/notifications/notification.service'),
    logger = require('../../../config/logger'),
    lodash = require('lodash');

exports.getFeeTypes = function(req, res) {
    nsaCassandra.Fee.getFeeTypes(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa401));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getFeeType = function(req, res) {
    nsaCassandra.Fee.getFeeType(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa401));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveFeeType = function(req, res) {
    var data = [];
    async.waterfall([
        saveFeeTypes.bind(null, req, data),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa403));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa402});
        }
    });
};

exports.updateFeeType = function(req, res) {
    var data = [];
    nsaCassandra.Fee.updateFeeType(req, function(err, resu) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa405));
        } else {
            data.features = {featureId : constant.FEE, actions : constant.UPDATE, featureTypeId : req.params.typeId};
            saveAuditLog(req, data, function(err1, result){
                if(err1) {
                    logger.debug(err1);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa4018));
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa404});
                }
            })
        }
    })
};

exports.deleteFeeType = function(req, res) {
    nsaCassandra.Fee.findFeeTypeInFeeStructure(req, function(err, result){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if(!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            var data = [];
            nsaCassandra.Fee.deleteFeeType(req, function(err, resu) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa407));
                } else {
                    data.features = {featureId : constant.FEE, actions : constant.DELETE, featureTypeId : req.params.typeId};
                    saveAuditLog(req, data, function(err1, result){
                        if(err1) {
                            logger.debug(err1);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa4018));
                        } else {
                            events.emit('JsonResponse', req, res, resu);
                        }
                    })
                }
            })
        }
    });
};

exports.getFeeScholarships = function(req, res) {
    nsaCassandra.Fee.getFeeScholarships(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa408));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getValidFeeScholarships =function(req,res){
    nsaCassandra.Fee.getValidFeeScholarships(req, function(err,result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa408));
        }else{
            events.emit('JsonResponse',req, res, result);
        }
    })
}

exports.getFeeScholarship = function(req, res) {
    nsaCassandra.Fee.getFeeScholarship(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa408));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveFeeScholarship = function(req, res) {
    var data = [];
    async.waterfall([
        saveFeeScholarships.bind(null, req, data),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa410));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa409});
        }
    });
};

exports.updateFeeScholarship = function(req, res) {
    var data = [];
    nsaCassandra.Fee.updateFeeScholarship(req, function(err, resu) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa412));
        } else {
            data.features = {featureId : constant.FEE, actions : constant.UPDATE, featureTypeId : req.params.typeId};
            saveAuditLog(req, data, function(err1, result){
                if(err1) {
                    logger.debug(err1);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa4018));
                } else {
                    events.emit('JsonResponse', req, res, resu);
                }
            })
        }
    })
};

exports.deleteFeeScholarship = function(req, res) {
    nsaCassandra.Fee.findFeeScholarshipInFeeDetails(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            var data = [];
            nsaCassandra.Fee.deleteFeeScholarship(req, function(err, resu) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa414));
                } else {
                    data.features = {featureId : constant.FEE, actions : constant.DELETE, featureTypeId : req.params.typeId};
                    saveAuditLog(req, data, function(err1, result){
                        if(err1) {
                            logger.debug(err1);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa4018));
                        } else {
                            events.emit('JsonResponse', req, res, resu);
                        }
                    })
                }
            })
        }
    })
};

exports.getFeeStructures = function(req, res) {
    nsaCassandra.Fee.getFeeStructures(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa415));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getActiveFeeStructures = function (req, res) {
    nsaCassandra.Fee.getActiveFeeStructures(req, function(err ,result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa439));
        }else {
            events.emit('JsonResponse', req, res, result);
        }
    })

}

exports.getFeeStructure = function(req, res) {
    nsaCassandra.Fee.getFeeStructure(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa415));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveFeeStructure = function(req, res) {

    var data = [];
    async.waterfall([
        saveFeeStructures.bind(null, req, data),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa417));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa416});
        }
    });
};

exports.updateFeeStructure = function(req, res) {
    var data = [];
    nsaCassandra.Fee.updateFeeStructure(req, function(err, resu) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa419));
        } else {
            /*events.emit('JsonResponse', req, res, result);*/
            data.features = {featureId : constant.FEE, actions : constant.UPDATE, featureTypeId : req.params.typeId};
            saveAuditLog(req, data, function(err1, result){
                if(err1) {
                    logger.debug(err1);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa4018));
                } else {
                    events.emit('JsonResponse', req, res, resu);
                }
            })
        }
    })
};

exports.deleteFeeStructure = function(req, res) {
    nsaCassandra.Fee.findFeeStructureInAssignFee(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            var data = [];
            nsaCassandra.Fee.deleteFeeStructure(req, function(err, resu) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa421));
                } else {
                    /*events.emit('JsonResponse', req, res, result);*/
                    data.features = {featureId : constant.FEE, actions : constant.DELETE, featureTypeId : req.params.typeId};
                    saveAuditLog(req, data, function(err1, result){
                        if(err1) {
                            logger.debug(err1);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa4018));
                        } else {
                            events.emit('JsonResponse', req, res, resu);
                        }
                    })
                }
            })
        }
    })
};

exports.getFeeAssignments = function(req, res) {
    nsaCassandra.Fee.getFeeAssignments(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa422));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getFeeAssignment = function(req, res) {
    nsaCassandra.Fee.getFeeAssignment(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa422));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveFeeAssignment = function(req, res) {
    nsaCassandra.Fee.saveFeeAssignment(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa424));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.updateFeeAssignment = function(req, res) {
    nsaCassandra.Fee.updateFeeAssignment(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa426));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.deleteFeeAssignment = function(req, res) {
    var data = [];
    nsaCassandra.Fee.deleteFeeAssignment(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa428));
        } else {
            /*events.emit('JsonResponse', req, res, result);*/

            data.features = {featureId : constant.FEE, actions : constant.DELETE, featureTypeId : req.params.typeId};
            saveAuditLog(req, data, function(err, result){
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa405));
                } else {
                    events.emit('JsonResponse', req, res, message.nsa427);
                }
            })
        }
    })
};

exports.getFeeAssignmentsDetails = function(req, res) {
    nsaCassandra.Fee.getFeeAssignmentsDetails(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa429));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getFeeAssignmentDetail = function(req, res) {
    nsaCassandra.Fee.getFeeAssignmentDetail(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa429));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveFeeAssignmentDetail = function(req, res) {
    nsaCassandra.Fee.saveFeeAssignmentDetail(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa431));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.updateFeeAssignmentDetail = function(req, res) {
    nsaCassandra.Fee.updateFeeAssignmentDetail(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa433));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.deleteFeeAssignmentDetail = function(req, res) {
    nsaCassandra.Fee.deleteFeeAssignmentDetail(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa435));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveAssignedFee = function(req, res) {
    var data = [];
    async.waterfall([
        buildTaxanomyObj.bind(null, req, data),
        getContacts.bind(),
        constructFeeAssignmentObj.bind(),
        constructFeeAssignmentDetailObj.bind(),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa431));
        } else {
            var result = {};
            result['feeAssignmentId'] = data.fee_assignment_id;
            result['message'] = message.nsa430;
            events.emit('JsonResponse', req, res, result);
        }
    });
};

function sendNotification(req, callback) {
    async.waterfall([
            buildUsers.bind(null, req),
            getFeeCreateTemplate.bind(),
            getTemplateObj.bind(),
            buildFeatureNotificationObj.bind(),
            notificationService.sendAllNotification.bind(),
            notificationService.saveNotificationInfo.bind()
        ],
        function (err, data) {
            callback(err, data)
        }
    )
};
exports.sendNotification = sendNotification;


function getTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.feebase.getTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};

function buildUsers(req, callback) {
    var data = [];
    getContacts(req, data, function(err, users){
        if (err) {
            callback(err, req, null);
        } else {
            var result = data.users.usersByLanguages;
            data['users'] = result
            callback(err, req, data);
        }
    });
};
exports.buildUsers = buildUsers;

function getFeeCreateTemplate(req, users, callback) {
    var data = { featureId: constant.FEE, subFeatureId: constant.CREATE_FEE, action: constant.CREATE_ACTION, userType: constant.STUDENT };
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getFeeCreateTemplate = getFeeCreateTemplate;

function buildFeatureNotificationObj(req, users, templateObj, callback) {
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        callback(err, req, notificationObj);
    })
};
exports.buildFeatureNotificationObj = buildFeatureNotificationObj;

function getContacts(req, data, callback) {
    async.parallel({
        usersByLanguages: es.getUsersByLanguages.bind(null, req)
    }, function(err, usersByLanguages) {
        if (err) {
            callback(err, null);
        } else {
            data.users = usersByLanguages;
            callback(null, req, data);
        }
    });
};
exports.getContacts = getContacts;

function constructFeeAssignmentObj(req, data, callback) {
    nsaCassandra.Base.feebase.constructFeeAssignmentObj(req, data, function(err, data) {
        data.features = {featureId : constant.FEE, actions : constant.CREATE, featureTypeId : data.fee_assignment_id};
        callback(err, req, data);
    })
};
exports.constructFeeAssignmentObj = constructFeeAssignmentObj;

function saveFeeTypes(req, data, callback) {
    nsaCassandra.Fee.saveFeeType(req, data, function(err, result) {
        data.features = {featureId : constant.FEE, actions : constant.CREATE, featureTypeId : data.fee_type_id};
        callback(err, req, data);
    })
};
exports.saveFeeTypes = saveFeeTypes;

function saveFeeScholarships(req, data, callback) {
    nsaCassandra.Fee.saveFeeScholarship(req, data, function(err, result) {
        data.features = {featureId : constant.FEE, actions : constant.CREATE, featureTypeId : data.scholarship_id};
        callback(err, req, data);
    })
};
exports.saveFeeScholarships = saveFeeScholarships;

function saveFeeStructures(req, data, callback) {
    nsaCassandra.Fee.saveFeeStructure(req, data, function(err, result) {
        data.features = {featureId : constant.FEE, actions : constant.CREATE, featureTypeId : data.fee_structure_id};
        callback(err, req, data);
    })
};
exports.saveFeeStructures = saveFeeStructures;


function constructFeeAssignmentDetailObj(req, data, callback) {
    nsaCassandra.Base.feebase.constructFeeAssignmentDetailObj(req, data, function(err, data) {
        callback(err, req, data);
    })
};
exports.constructFeeAssignmentDetailObj = constructFeeAssignmentDetailObj;

function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, result) {
        callback(err, req, data);
    })
};
exports.insertAuditLog = insertAuditLog;

function saveAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveAuditLog(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.saveAuditLog = saveAuditLog;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, data);
    })
};
exports.executeBatch = executeBatch;

exports.updateScholarshipDetails = function(req, res) {
    var data= [];
    async.waterfall([
        updateScholarshipDetailsObj.bind(null, req, data),
        executeBatch.bind()
    ], function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa412));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa432});
        }
    });
};

function updateScholarshipDetailsObj(req, data, callback) {
    nsaCassandra.Base.feebase.updateScholarshipDetailsObj(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.updateScholarshipDetailsObj = updateScholarshipDetailsObj;

exports.updateAssignFeeAndDetails = function(req, res) {
    var data = [];
    async.waterfall([
        buildTaxanomyObj.bind(null, req, data),
        getContacts.bind(),
        updateAssignmentFee.bind(),
        deleteAllFeeDetails.bind(),
        checkUsersAndSaveFeeDetails.bind(),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa433));
        } else {
            var result = {};
            result['feeAssignmentId'] = data.fee_assignment_id;
            result['message'] = message.nsa432;
            events.emit('JsonResponse', req, res, result);
        }
    });
};

function updateAssignmentFee(req, data, callback) {
    nsaCassandra.Base.feebase.updateAssignFee(req, data, function(err, data) {
        callback(err, req, data);
    })
};
exports.updateAssignmentFee = updateAssignmentFee;

function deleteAllFeeDetails(req, data, callback) {
    nsaCassandra.Base.feebase.deleteAllFeeDetails(req, data, function(err, data) {
        callback(err, req, data);
    })
};
exports.deleteAllFeeDetails = deleteAllFeeDetails;

function checkUsersAndSaveFeeDetails(req, data, callback) {
    nsaCassandra.Base.feebase.checkUsersAndSaveFeeDetails(req, data, function(err, data) {
        data.features = {featureId : constant.FEE, actions : constant.UPDATE, featureTypeId : data.fee_assignment_id};
        callback(err, req, data);
    })
};
exports.checkUsersAndSaveFeeDetails = checkUsersAndSaveFeeDetails;

exports.publishAssignedFee = function(req, res) {
    var data = [];
    async.waterfall([
        updateAssignedFeeStatus.bind(null, req, data),
        findAssignedFeeDetails.bind(),
        updateAssignedFeeDetailsStatus.bind(),
        insertAuditLog.bind(),
        executeBatch.bind(),
    ], function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa440));
        } else {
            sendNotification(req, function(err1, data){
                if(err1) {
                    logger.debug(err1);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa440));
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa439});
                }
            })
        }
    });
};

function updateAssignedFeeStatus(req, data, callback) {
    nsaCassandra.Base.feebase.updateAssignedFeeStatus(req, data, function(err, data) {
        callback(err, req, data);
    })
};

function findAssignedFeeDetails(req, data, callback) {
    nsaCassandra.Fee.getDetailsByFeeAssignment(req, function(err, result) {
        data['details'] = result;
        callback(err, req, data);
    })
};
exports.findAssignedFeeDetails = findAssignedFeeDetails;

function updateAssignedFeeDetailsStatus(req, data, callback) {
    nsaCassandra.Base.feebase.updateAssignedFeeDetailsStatus(req, data, function(err, data) {
        data.features = {featureId : constant.FEE, actions : constant.UPDATE, featureTypeId : data.fee_assignment_id};
        callback(err, req, data);
    })
};
exports.updateAssignedFeeDetailsStatus = updateAssignedFeeDetailsStatus;

exports.getFeeAssignedUsers = function(req, res) {
    nsaCassandra.Fee.getFeeAssignedUsers(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa429));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getDetailsByFeeAssignment = function(req, res) {
    nsaCassandra.Fee.getDetailsByFeeAssignment(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa429));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getScholarshipUsers = function(req, res) {
    nsaCassandra.Fee.getScholarshipUsers(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa429));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getFeeDetailsByClassAndSection = function(req, res) {
    nsaCassandra.Fee.getFeeDetailsByClassAndSection(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa429));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};


function buildTaxanomyObj(req, data, callback) {
    taxanomyUtils.buildTaxanomyObj(req, function(err, result){
        data['taxanomy'] = result;
        callback(err, req, data)
    })
}
exports.buildTaxanomyObj = buildTaxanomyObj;

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.FEE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildErrResponse = buildErrResponse;

function throwFeeErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.FEE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwFeeErr = throwFeeErr;
