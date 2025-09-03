var express = require('express')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , message = require('../../common/constants/message')
    , status = require('../../common/domains/Status')
    , feeTypeDomain = require('../common/feebase.service')
    , request = require('request')
    , models = require('../../models')
    , feeConverter = require('../../converters/fee.converter');


exports.getFeeTypes = function(req, res) {
    var headers = baseService.getHeaders(req);

    models.instance.SchoolFeeType.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        if (err) {
            status = baseService.getStatus(req,res, constants.HTTP_BAD_REQUEST,  message.FAILURE);
            res.status(constants.HTTP_BAD_REQUEST).send({status: status,  data: err});
        } else {
            status = baseService.getStatus(req,res, constants.HTTP_OK,  message.FETCH_ALL_FEE_TYPES);
            res.status(constants.HTTP_OK).send({status: status, feeType: feeConverter.feeTypeObjs(req, res, result)});
        }
    });
};

exports.getFeeType = function(req, res) {
    var headers = baseService.getHeaders(req);
    var feeTypeId = req.params.typeId;
    models.instance.SchoolFeeType.findOne({ fee_type_id: models.uuidFromString(feeTypeId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        if (err) {
            status = baseService.getStatus(req,res, constants.HTTP_BAD_REQUEST,  message.FAILURE);
            res.status(constants.HTTP_BAD_REQUEST).send({status: status,  data: err});
        } else {
            status = baseService.getStatus(req,res, constants.HTTP_OK,  message.FETCH_FEE_TYPE);
            res.status(constants.HTTP_OK).send({status: status, feeType: feeConverter.feeTypeObj(req, res, result)});
        }
    });
};

exports.saveFeeType = function(req, res) {

    var schoolfeeType  = feeTypeDomain.constructFeeTypeDetails(req, res);

    console.info("uuid =" + schoolfeeType.fee_type_id)

    schoolfeeType.save(function (err, result) {
        if (result) {
            res.status(constants.HTTP_OK).send({
                status: baseService.getSuccessStatus(req, res, message.FEE_TYPE_SUCCESS)});
        } else {
            console.info('err = ', err);
            return res.status(constants.HTTP_BAD_REQUEST).send({status : baseService.getFailureStatus(req, res, constants.HTTP_BAD_REQUEST, message.FEETYPE_ERROR)});
        }
    });
};

/**
 *  Fee Scholarship services
 */

exports.getFeeScholarships = function(req, res) {
    var headers = baseService.getHeaders(req);

    models.instance.SchoolScholarshipType.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        if (err) {
            status = baseService.getStatus(req,res, constants.HTTP_BAD_REQUEST,  message.FAILURE);
            res.status(constants.HTTP_BAD_REQUEST).send({status: status,  data: err});
        } else {
            status = baseService.getStatus(req,res, constants.HTTP_OK,  message.FETCH_ALL_FEE_SCHOLARSHIP);
            res.status(constants.HTTP_OK).send({status: status, feeType: feeConverter.feeScholarshipObjs(req, res, result)});
        }
    });
};

exports.getFeeScholarship = function(req, res) {
    var headers = baseService.getHeaders(req);
    var scholarshipId = req.params.id;
    console.info("scholarshipId =" + scholarshipId);

    models.instance.SchoolScholarshipType.findOne({scholarship_id: models.uuidFromString(scholarshipId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        if (err) {
            status = baseService.getStatus(req,res, constants.HTTP_BAD_REQUEST,  message.FAILURE);
            res.status(constants.HTTP_BAD_REQUEST).send({status: status,  data: err});
        } else {
            status = baseService.getStatus(req,res, constants.HTTP_OK,  message.FETCH_FEE_SCHOLARSHIP);
            res.status(constants.HTTP_OK).send({status: status, feeType: feeConverter.feeScholarshipObj(req, res, result)});
        }
    });
};


exports.saveFeeScholarship = function(req, res) {

    var feeScholarshipDetails  = feeTypeDomain.constructFeeScholarshipDetails(req, res);

    try {
        feeScholarshipDetails.save(function (err, result) {
            if (result) {
                res.status(constants.HTTP_OK).send({
                    status: baseService.getSuccessStatus(req, res, message.FEE_SCHOLARSHIP_SUCCESS)
                });
            } else {
                console.info('err = ', err);
                return res.status(constants.HTTP_BAD_REQUEST).send({status: baseService.getFailureStatus(req, res, constants.HTTP_BAD_REQUEST, message.FEE_SCHOALRSHIP_ERROR)});
            }
        });
    } catch (err) {
     console.info("Exception = ", err);
    }
};

/**
 *  Fee Structure services
 */

exports.getFeeStructures = function(req, res) {
    var headers = baseService.getHeaders(req);

    models.instance.SchoolFeeStructure.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        if (err) {
            status = baseService.getStatus(req,res, constants.HTTP_BAD_REQUEST,  message.FAILURE);
            res.status(constants.HTTP_BAD_REQUEST).send({status: status,  data: err});
        } else {
            status = baseService.getStatus(req,res, constants.HTTP_OK,  message.FETCH_ALL_FEE_STRUCTURE);
            res.status(constants.HTTP_OK).send({status: status, feeStructure: feeConverter.feeStructureObjs(req, res, result)});
        }
    });
};

exports.getFeeStructure = function(req, res) {
    var headers = baseService.getHeaders(req);
    var feeStructureId = req.params.id;

    console.info ('Structure ID =' + feeStructureId);
    models.instance.SchoolFeeStructure.findOne({ fee_structure_id: models.uuidFromString(feeStructureId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        if (err) {
            status = baseService.getStatus(req,res, constants.HTTP_BAD_REQUEST,  message.FAILURE);
            res.status(constants.HTTP_BAD_REQUEST).send({status: status,  data: err});
        } else {
            status = baseService.getStatus(req,res, constants.HTTP_OK,  message.FETCH_FEE_STRUCTURE);
            res.status(constants.HTTP_OK).send({status: status, feeStructure: feeConverter.feeStructureObj(req, res, result)});
        }
    });
};

exports.saveFeeStructure = function(req, res) {

    var feeStructureDetails  = feeTypeDomain.constructFeeStructureDetails(req, res);
    feeStructureDetails.save(function (err, result) {
        if (result) {
            res.status(constants.HTTP_OK).send({
                status: baseService.getSuccessStatus(req, res, message.FEE_STRUCTURE_SUCCESS)});
        } else {
            console.info('err = ', err);
            return res.status(constants.HTTP_BAD_REQUEST).send({status : baseService.getFailureStatus(req, res, constants.HTTP_BAD_REQUEST, message.FEE_STRUCTURE_ERROR)});
        }
    });
};

/**
 *  Fee Assignment services
 */

exports.getFeeAssignments = function(req, res) {
    var headers = baseService.getHeaders(req);

    models.instance.SchoolFeeAssignment.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        if (err) {
            status = baseService.getStatus(req,res, constants.HTTP_BAD_REQUEST,  message.FAILURE);
            res.status(constants.HTTP_BAD_REQUEST).send({status: status,  data: err});
        } else {
            status = baseService.getStatus(req,res, constants.HTTP_OK,  message.FETCH_ALL_FEE_ASSIGNMENT);
            res.status(constants.HTTP_OK).send({status: status, feeAssignment: feeConverter.feeAssignmentObjs(req, res, result)});
        }
    });
};

exports.getFeeAssignment = function(req, res) {
    var headers = baseService.getHeaders(req);
    var feeAssignmentId = req.params.id;

    models.instance.SchoolFeeAssignment.findOne({ fee_assignment_id: models.uuidFromString(feeAssignmentId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        if (err) {
            status = baseService.getStatus(req,res, constants.HTTP_BAD_REQUEST,  message.FAILURE);
            res.status(constants.HTTP_BAD_REQUEST).send({status: status,  data: err});
        } else {
            status = baseService.getStatus(req,res, constants.HTTP_OK,  message.FETCH_FEE_ASSIGNMENT);
            res.status(constants.HTTP_OK).send({status: status, feeAssignment: feeConverter.feeAssignmentObj(req, res, result)});
        }
    });
};

exports.saveFeeAssignment = function(req, res) {

    var feeAssignmentDetails  = feeTypeDomain.constructFeeAssignmentDetails(req, res);
    feeAssignmentDetails.save(function (err, result) {
        if (result) {
            res.status(constants.HTTP_OK).send({
                status: baseService.getSuccessStatus(req, res, message.FEE_ASSIGNMENT_SUCCESS)});
        } else {
            console.info('err = ', err);
            return res.status(constants.HTTP_BAD_REQUEST).send({status : baseService.getFailureStatus(req, res, constants.HTTP_BAD_REQUEST, message.FEE_ASSIGNMENT_ERROR)});
        }
    });
};

/**
 *  Fee Assignment services
 */

exports.getFeeAssignments = function(req, res) {
    var headers = baseService.getHeaders(req);

    models.instance.SchoolFeeAssignment.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        if (err) {
            status = baseService.getStatus(req,res, constants.HTTP_BAD_REQUEST,  message.FAILURE);
            res.status(constants.HTTP_BAD_REQUEST).send({status: status,  data: err});
        } else {
            status = baseService.getStatus(req,res, constants.HTTP_OK,  message.FETCH_ALL_FEE_ASSIGNMENT);
            res.status(constants.HTTP_OK).send({status: status, feeAssignment: feeConverter.feeAssignmentObjs(req, res, result)});
        }
    });
};

exports.getFeeAssignment = function(req, res) {
    var headers = baseService.getHeaders(req);
    var feeAssignmentId = req.params.id;

    models.instance.SchoolFeeAssignment.findOne({ fee_assignment_id: models.uuidFromString(feeAssignmentId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        if (err) {
            status = baseService.getStatus(req,res, constants.HTTP_BAD_REQUEST,  message.FAILURE);
            res.status(constants.HTTP_BAD_REQUEST).send({status: status,  data: err});
        } else {
            status = baseService.getStatus(req,res, constants.HTTP_OK,  message.FETCH_FEE_ASSIGNMENT);
            res.status(constants.HTTP_OK).send({status: status, feeAssignment: feeConverter.feeAssignmentObj(req, res, result)});
        }
    });
};

exports.saveFeeAssignment = function(req, res) {

    var feeAssignmentDetails  = feeTypeDomain.constructFeeAssignment(req, res);
    feeAssignmentDetails.save(function (err, result) {
        if (result) {
            res.status(constants.HTTP_OK).send({
                status: baseService.getSuccessStatus(req, res, message.FEE_ASSIGNMENT_SUCCESS)});
        } else {
            console.info('err = ', err);
            return res.status(constants.HTTP_BAD_REQUEST).send({status : baseService.getFailureStatus(req, res, constants.HTTP_BAD_REQUEST, message.FEE_ASSIGNMENT_ERROR)});
        }
    });
};

/**
 *  Fee Assignment Details services
 */

exports.getFeeAssignmentsDetails = function(req, res) {
    var headers = baseService.getHeaders(req);

    models.instance.SchoolFeeAssignmentDetails.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        if (err) {
            status = baseService.getStatus(req,res, constants.HTTP_BAD_REQUEST,  message.FAILURE);
            res.status(constants.HTTP_BAD_REQUEST).send({status: status,  data: err});
        } else {
            status = baseService.getStatus(req,res, constants.HTTP_OK,  message.FETCH_ALL_FEE_ASSIGNMENT_DETAILS);
            res.status(constants.HTTP_OK).send({status: status, feeAssignmentDetails: feeConverter.feeAssignmentDetailsObjs(req, res, result)});
        }
    });
};

exports.getFeeAssignmentDetail = function(req, res) {
    var headers = baseService.getHeaders(req);
    var feeAssignmentId = req.params.id;

    models.instance.SchoolFeeAssignmentDetails.findOne({ fee_assignment_detail_id: models.uuidFromString(feeAssignmentId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        if (err) {
            status = baseService.getStatus(req,res, constants.HTTP_BAD_REQUEST,  message.FAILURE);
            res.status(constants.HTTP_BAD_REQUEST).send({status: status,  data: err});
        } else {
            status = baseService.getStatus(req,res, constants.HTTP_OK,  message.FETCH_FEE_ASSIGNMENT_DETAIL);
            res.status(constants.HTTP_OK).send({status: status, feeAssignmentDetails: feeConverter.feeAssignmentDetailsObj(req, res, result)});
        }
    });
};

exports.saveFeeAssignmentDetail = function(req, res) {

    var feeAssignmentDetails  = feeTypeDomain.constructFeeAssignmentDetails(req, res);
    feeAssignmentDetails.save(function (err, result) {
        if (result) {
            res.status(constants.HTTP_OK).send({
                status: baseService.getSuccessStatus(req, res, message.FEE_ASSIGNMENT_DETAIL_SUCCESS)});
        } else {
            console.info('err = ', err);
            return res.status(constants.HTTP_BAD_REQUEST).send({status : baseService.getFailureStatus(req, res, constants.HTTP_BAD_REQUEST, message.FEE_ASSIGNMENT_DETAIL_ERROR)});
        }
    });
};
