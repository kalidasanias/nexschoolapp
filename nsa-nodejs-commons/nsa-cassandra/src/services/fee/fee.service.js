var express = require('express')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , feeTypeDomain = require('../common/feebase.service')
    , models = require('../../models')
    , feeConverter = require('../../converters/fee.converter')
    , _ = require('lodash')
    , message = require('@nsa/nsa-commons').messages
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , constant = require('@nsa/nsa-commons').constants
    , logger = require('../../../../../../config/logger');

var Fee = function f(options) {
    var self = this;
};

Fee.getFeeTypes = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.FEE_TYPE_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.FEE_TYPE_PERMISSIONS);
        models.instance.SchoolFeeType.find(findQuery, {allow_filtering: true}, function(err, result){
            var formattedResult = baseService.validateResult(result);
            callback(err, feeConverter.feeTypeObjs(req, formattedResult));
        });
    } else {
        callback(null, []);
    }
};

Fee.getFeeType = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var feeTypeId = req.params.typeId;
    models.instance.SchoolFeeType.findOne({ fee_type_id: models.uuidFromString(feeTypeId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, feeConverter.feeTypeObj(req, formattedResult));
    });
};

Fee.saveFeeType = function(req, data, callback) {

    try {
        var schoolfeeType  = feeTypeDomain.constructFeeTypeDetails(req);
        var schoolfeeTypeObj = schoolfeeType.save({return_query: true});
        var array = [schoolfeeTypeObj];
        data.fee_type_id = schoolfeeType.fee_type_id;
        data.batchObj = array;
        callback(null, data);
    } catch (err){
        logger.debug(err)
        callback(err, data);
    }


};

Fee.updateFeeType = function(req, callback) {
    var queryObject  = feeTypeDomain.feeTypeQueryObject(req);
    var updateValues  = feeTypeDomain.feeTypeUpdateValues(req);
    models.instance.SchoolFeeType.update(queryObject, updateValues, function(err, result){
        callback(err, result);
    });
};

Fee.deleteFeeType = function(req, callback) {
    var queryObject  = feeTypeDomain.feeTypeQueryObject(req);
    models.instance.SchoolFeeType.findOne(queryObject, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, {message: message.nsa407});
        } else {
            models.instance.SchoolFeeType.delete(queryObject, function(err, result){
                callback(err, {message: message.nsa406});
            });
        }
    });
};

Fee.findFeeTypeInFeeStructure = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var feeTypeId = req.params.typeId;
    var findQuery = { tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        applicable_fee_types: {'$contains_key':  models.uuidFromString(feeTypeId)}
    };
    models.instance.SchoolFeeStructure.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

/**
 *  Fee Scholarship services
 */

Fee.getFeeScholarships = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.FEE_SCHOLARSHIP_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.FEE_SCHOLARSHIP_PERMISSIONS);

        models.instance.SchoolScholarshipType.find(findQuery, { allow_filtering: true}, function(err, result){
            callback(err, feeConverter.feeScholarshipObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

Fee.getValidFeeScholarships =function(req,  callback){
    var headers = baseService.getHeaders(req);
    var currentDate = new Date();
    models.instance.SchoolScholarshipType.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        valid_upto:{'$gte':currentDate}
    }, { allow_filtering: true},function(err, result){
        callback(err, feeConverter.feeScholarshipObjs(req, result));
    })

}

Fee.getFeeScholarship = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var scholarshipId = req.params.id;

    models.instance.SchoolScholarshipType.findOne({scholarship_id: models.uuidFromString(scholarshipId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        callback(err, feeConverter.feeScholarshipObj(req, result));
    });
};

Fee.saveFeeScholarship = function(req, data, callback) {
    try {
        var feeScholarshipDetails  = feeTypeDomain.constructFeeScholarshipDetails(req);
        var feeScholarshipDetailsObj = feeScholarshipDetails.save({return_query: true});
        var array = [feeScholarshipDetailsObj];
        data.scholarship_id = feeScholarshipDetails.scholarship_id;
        data.batchObj = array;
        callback(null, data);
    } catch (err){
        callback(err, data);
    }

};

Fee.updateFeeScholarship = function(req, callback) {
    var queryObject  = feeTypeDomain.FeeScholarshipQueryObject(req);
    var updateValues  = feeTypeDomain.FeeScholarshipUpdateValues(req);

    models.instance.SchoolScholarshipType.update(queryObject, updateValues, function(err, result){
        result['message'] = message.nsa411;
        callback(err, result);
    });
};

Fee.deleteFeeScholarship = function(req, callback) {
    var queryObject  = feeTypeDomain.FeeScholarshipQueryObject(req);
    models.instance.SchoolScholarshipType.findOne(queryObject, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, {message: message.nsa414});
        } else {
            models.instance.SchoolScholarshipType.delete(queryObject, function(err, result){
                result['message'] = message.nsa413;
                callback(err, result)
            });
        }
    });
};

Fee.findFeeScholarshipInFeeDetails = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var scholarshipId = req.params.typeId;
    var findQuery = { tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        scholarship_name: {'$contains_key':  models.uuidFromString(scholarshipId)}
    };
    models.instance.SchoolFeeAssignmentDetails.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};
/**
 *  Fee Structure services
 */

Fee.getFeeStructures = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.FEE_STRUCTURE_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.FEE_STRUCTURE_PERMISSIONS);

        models.instance.SchoolFeeStructure.find(findQuery, { allow_filtering: true}, function(err, result){
            callback(err, feeConverter.feeStructureObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

Fee.getActiveFeeStructures = function(req, callback){
    var headers = baseService.getHeaders(req);
    var havePermissions = baseService.haveAnyPermissions(req, constant.FEE_STRUCTURE_PERMISSIONS);
    if(havePermissions){
        var findQuery = baseService.getFindAllQuery(req, false, constant.FEE_STRUCTURE_PERMISSIONS);
        findQuery.status = true;
        models.instance.SchoolFeeStructure.find(findQuery, { allow_filtering: true}, function(err, result){
            callback(err, feeConverter.feeStructureObjs(req, result));
        });
    } else {
        callback(null, []);
    }

};

Fee.getFeeStructure = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var feeStructureId = req.params.id;

    models.instance.SchoolFeeStructure.findOne({ fee_structure_id: models.uuidFromString(feeStructureId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        callback(err, feeConverter.feeStructureObj(req, result))
    });
};

Fee.saveFeeStructure = function(req, data, callback) {
    try {
        var feeStructureDetails  = feeTypeDomain.constructFeeStructureDetails(req);
        var feeStructureDetailsObj = feeStructureDetails.save({return_query: true});
        var array = [feeStructureDetailsObj];
        data.fee_structure_id = feeStructureDetails.fee_structure_id;
        data.batchObj = array;
        callback(null, data);
    } catch (err){
        callback(err, data);
    }

};

Fee.updateFeeStructure = function(req, callback) {
    var queryObject  = feeTypeDomain.feeStructureQueryObject(req);
    var updateValues  = feeTypeDomain.feeStructureUpdateValues(req);

    models.instance.SchoolFeeStructure.update(queryObject, updateValues, function(err, result){
        result['message'] = message.nsa418
        callback(err, result);
    });
};

Fee.deleteFeeStructure = function(req, callback) {
    var queryObject  = feeTypeDomain.feeStructureQueryObject(req);
    models.instance.SchoolFeeStructure.findOne(queryObject, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, {message: message.nsa421});
        } else {
            models.instance.SchoolFeeStructure.delete(queryObject, function(err, result){
                result['message'] = message.nsa420
                callback(err, result);
            });
        }
    });
};

Fee.findFeeStructureInAssignFee = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var feeStructureId = req.params.typeId;
    var findQuery = { tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        fee_structure_id: models.uuidFromString(feeStructureId)
    };
    models.instance.SchoolFeeAssignment.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

/**
 *  Fee Assignment services
 */

Fee.getFeeAssignments = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.FEE_ASSIGN_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.FEE_ASSIGN_PERMISSIONS);

        models.instance.SchoolFeeAssignment.find(findQuery, { allow_filtering: true}, function(err, result){
            callback(err, feeConverter.feeAssignmentObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

Fee.getFeeAssignment = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var feeAssignmentId = req.params.id;

    models.instance.SchoolFeeAssignment.findOne({ fee_assignment_id: models.uuidFromString(feeAssignmentId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        callback(err, feeConverter.feeAssignmentObj(req, result));
    });
};

Fee.saveFeeAssignment = function(req, callback) {
    var feeAssignmentDetails  = feeTypeDomain.constructFeeAssignment(req);
    feeAssignmentDetails.save(function (err, result) {
        callback(err, {messsage: message.nsa423});
    });
};

Fee.updateFeeAssignment = function(req, callback) {
    var queryObject  = feeTypeDomain.feeAssignmentQueryObject(req);
    var updateValues  = feeTypeDomain.feeAssignmentUpdateValues(req);

    models.instance.SchoolFeeAssignment.update(queryObject, updateValues, function(err, result){
        callback(err, message.nsa425);
    });
};


Fee.deleteFeeAssignment = function(req, callback) {
    var queryObject  = feeTypeDomain.feeAssignmentQueryObject(req);
    models.instance.SchoolFeeAssignment.findOne(queryObject, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, message.nsa428);
        } else {
            models.instance.SchoolFeeAssignment.delete(queryObject, function(err, result){
                callback(err, message.nsa427);
            });
        }
    });
};


/**
 *  Fee Assignment Details services
 */
Fee.getFeeAssignmentsDetails = function(req, callback) {
    var headers = baseService.getHeaders(req);
    models.instance.SchoolFeeAssignmentDetails.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        callback(err, feeConverter.feeAssignmentDetailsObjs(req, result));
    });
};

Fee.getFeeAssignmentDetail = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var feeAssignmentId = req.params.id;

    models.instance.SchoolFeeAssignmentDetails.findOne({ fee_assignment_detail_id: models.uuidFromString(feeAssignmentId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        callback(err, feeConverter.feeAssignmentDetailsObj(req, result));
    });
};

Fee.saveFeeAssignmentDetail = function(req, callback) {

    var feeAssignmentDetails  = feeTypeDomain.constructFeeAssignmentDetails(req);
    feeAssignmentDetails.save(function (err, result) {
        callback(err, message.nsa430);
    });
};

Fee.updateFeeAssignmentDetail = function(req, callback) {

    var queryObject  = feeTypeDomain.feeAssignmentDetailQueryObject(req);
    var updateValues  = feeTypeDomain.feeAssignmentDetailUpdateValues(req);

    models.instance.SchoolFeeAssignmentDetails.update(queryObject, updateValues, function(err, result){
        result['message'] = message.nsa432;
        callback(err, result);
    });
};

Fee.deleteFeeAssignmentDetail = function(req, callback) {
    var queryObject  = feeTypeDomain.feeAssignmentDetailQueryObject(req);
    models.instance.SchoolFeeAssignmentDetails.findOne(queryObject, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, message.nsa435);
        } else {
            models.instance.SchoolFeeAssignmentDetails.delete(queryObject, function(err, result){
                result['message'] = message.nsa434;
                callback(err, result);
            });
        };
    });
};

Fee.getFeeAssignedUsers = function(req, callback) {
    var headers = baseService.getHeaders(req);
    models.instance.SchoolFeeAssignmentDetails.find({ user_name: headers.user_id,
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        status: true /*constants.STATUS_PUBLISH*/
    }, { allow_filtering: true}, function(err, result){
        callback(err, feeConverter.feeAssignmentDetailsObjs(req, result));
    });
};

Fee.getDetailsByFeeAssignment = function(req, callback) {
    var feeAssignmentId = req.params.id;
    var findQuery = getHeaders(req);
    findQuery.fee_assignment_id = models.uuidFromString(feeAssignmentId);
    models.instance.SchoolFeeAssignmentDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, feeConverter.feeAssignmentDetailsObjs(req, result));
    });
};

Fee.getScholarshipUsers = function(req, callback) {

    var feeAssignmentId = req.params.id;
    var findQuery = getHeaders(req);
    findQuery.fee_assignment_id = models.uuidFromString(feeAssignmentId)

    models.instance.SchoolFeeAssignmentDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        var scholarshipUsers = getScholarshipDetails(result);
        callback(err, feeConverter.feeAssignmentDetailsObjs(req, scholarshipUsers));
    });
};

function getScholarshipDetails(list) {
    var scholarshipUsers = [];
    _.forEach(list, function(value, key){
        value.scholarship_amount = value.scholarship_amount == 0 ? null : value.scholarship_amount;
        value.fee_discount_amount = value.fee_discount_amount == 0 ? null : value.fee_discount_amount;
        if(value.scholarship_amount != null || value.fee_discount_amount != null) {
            scholarshipUsers.push(value);
        }
    });
    return scholarshipUsers;
};

Fee.getFeeDetailsByClassAndSection = function(req, callback) {

    var params = req.params;
    var class_id = params.classId;
    var section_id = params.sectionId;
    var findQuery = getHeaders(req);
    if(class_id != null && !(_.isEmpty(class_id))) {
        findQuery.class_id = models.uuidFromString(class_id);
    }
    if (section_id != null && !(_.isEmpty(section_id))) {
        findQuery.section_id = models.uuidFromString(section_id);
    }

    models.instance.SchoolFeeAssignmentDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, feeConverter.feeAssignmentDetailsObjs(req, result));
    });
};

function getHeaders(req) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year
    };
    return findQuery;
};
exports.getHeaders = getHeaders;

module.exports = Fee;