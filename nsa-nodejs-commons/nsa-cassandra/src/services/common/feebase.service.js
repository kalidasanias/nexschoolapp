
var express = require('express')

var constants = require('../../common/constants/constants');
var models = require('../../models/index')
    , baseService = require('./base.service')
    , dateService = require('../../utils/date.service.js')
    , message = require('@nsa/nsa-commons').messages
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , constant = require('@nsa/nsa-commons').constants
    , templateConverter = require('../../converters/template.converter')
    , async = require('async')
    , logger = require('../../../config/logger');

exports.constructFeeTypeDetails = function(req) {
    var feeTypeDetails;
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();

        feeTypeDetails = new models.instance.SchoolFeeType  ({
            fee_type_id: models.uuid(),
            tenant_id:tenantId,
            school_id:schoolId,
            fee_type_name: body.feeTypeName,
            fee_desc: body.feeTypeDesc,
            deposit: body.feeTypeDeposit,
            updated_date: currentDate,
            updated_by : headers.user_id,
            created_date: currentDate,
            created_by : headers.user_id,
            created_firstname : headers.user_name,
            updated_username : headers.user_name,
            default_value : false,
            status : true
        });
    } catch (err) {
        throw new BaseError(responseBuilder.buildResponse(constant.FEE_NAME, constant.APP_TYPE, message.nsa403, err.message, constant.HTTP_BAD_REQUEST));
    }
    return feeTypeDetails;
};

exports.feeTypeQueryObject = function(req) {
    var queryObject;
    try {
        var headers = baseService.getHeaders(req);
        var schoolId = models.uuidFromString(headers.school_id);
        var feeTypeId = req.params.typeId;
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var body = req.body;

        queryObject = {
            fee_type_id: models.uuidFromString(feeTypeId),
            tenant_id: tenantId,
            school_id:  schoolId
        };
    } catch (err){
        logger.debug(err);
        return buildErrResponse(err, message.nsa403);
    }
    return queryObject;
};

exports.feeTypeUpdateValues = function(req) {

    var updateValues;
    try{
        var headers = baseService.getHeaders(req);
        var body = req.body;
        var currentDate = new Date();

        var feeTypeName = body.feeTypeName;
        var feeTypeDesc = body.feeTypeDesc;
        var feeTypeDeposit = body.feeTypeDeposit;
        var updatedBy = headers.user_id;
        var updatedUsername = headers.user_name;
        var updatedDate = currentDate;
        var status = true;

        updateValues = {
            fee_type_name: feeTypeName,
            fee_desc: feeTypeDesc,
            deposit: feeTypeDeposit,
            default_value: false,
            status: status,
            updated_date: updatedDate,
            updated_by: updatedBy,
            updated_username: updatedUsername
        };
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa407);
    }
    return updateValues;
};

exports.constructFeeScholarshipDetails = function(req) {
    var feeScholarshipDetails;
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var validUpto = baseService.getFormattedDate(body.validUpto);
        var amount = parseFloat(body.amount);

        feeScholarshipDetails = new models.instance.SchoolScholarshipType( {

            scholarship_id : models.uuid(),
            tenant_id :tenantId,
            school_id :schoolId,
            amount : amount,
            //attachment : body.attachment,
            updated_by : headers.user_id,
            updated_username: headers.user_name,
            scholarship_desc : body.scholarshipDesc,
            scholarship_name : body.name,
            status : body.status,
            valid_upto : validUpto,
            created_date: currentDate,
            created_by : headers.user_id,
            created_firstname : headers.user_name,
            updated_date : currentDate

        });
    } catch (err) {
        throw new BaseError(responseBuilder.buildResponse(constant.FEE_NAME, constant.APP_TYPE, message.nsa410, err.message, constant.HTTP_BAD_REQUEST));
    }

    return feeScholarshipDetails;
};

exports.FeeScholarshipQueryObject = function(req) {
    var queryObject;
    try{
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var scholarshipId = req.params.typeId;
        var body = req.body;

        queryObject = {
            scholarship_id: models.uuidFromString(scholarshipId),
            tenant_id: tenantId,
            school_id:  schoolId,
        };
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa436);
    }
    return queryObject;
};

exports.FeeScholarshipUpdateValues = function(req) {
    var updateValues;
    try {
        var headers = baseService.getHeaders(req);
        var body = req.body;
        var currentDate = new Date();
        var scholarshipName = body.name;
        var scholarshipDesc = body.scholarshipDesc;
        var amount = parseFloat(body.amount);
        //var attachment = body.attachment,
        var updatedDate = currentDate;
        var updatedUsername = headers.user_name;
        var updatedBy = headers.user_id;
        var validUpto = body.validUpto;
        var status = body.status;

        updateValues = {
            scholarship_name: scholarshipName,
            scholarship_desc: scholarshipDesc,
            amount: amount,
            updated_by: updatedBy,
            updated_date: updatedDate,
            updated_username: updatedUsername,
            valid_upto: validUpto,
            status: status
        };
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa412);
    }
    return updateValues;
};

exports.constructFeeStructureDetails = function(req) {

    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var currentDate = new Date();
    var applicableFeeTypes = baseService.getMapFromFormattedMap(body.feeTypes);
    var applicableTerms = baseService.getMapFromFormattedMap(body.terms);

    var feeStructureDetails = new models.instance.SchoolFeeStructure( {

        fee_structure_id : models.uuid(),
        tenant_id :tenantId,
        school_id :schoolId,
        academic_year : academicYear,
        applicable_fee_types : applicableFeeTypes,
        applicable_terms : applicableTerms,
        updated_by : headers.user_id,
        updated_username: headers.user_name,
        fee_structure_desc : body.feeStructureDesc,
        fee_structure_name : body.feeStructureName,
        status : JSON.parse(body.status),
        created_date: currentDate,
        created_by : headers.user_id,
        created_firstname : headers.user_name,
        updated_date : currentDate
    });

    return feeStructureDetails;
};

exports.feeStructureQueryObject = function(req) {
    try {
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var feeStructureId = req.params.typeId;
        var academicYear = headers.academic_year;

        var queryObject = {
            fee_structure_id: models.uuidFromString(feeStructureId),
            tenant_id: tenantId,
            school_id:  schoolId,
            academic_year: academicYear};
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa436)
    }
    return queryObject;
};

exports.feeStructureUpdateValues = function(req) {
    try {
        var headers = baseService.getHeaders(req);
        var currentDate = new Date();
        var body = req.body;
        var feeStructureDesc = body.feeStructureDesc;
        var feeStructureName = body.feeStructureName;

        var updatedDate = currentDate;
        var status = JSON.parse(body.status);

        var applicableFeeTypes = baseService.getMapFromFormattedMap(body.feeTypes);
        var applicableTerms = baseService.getMapFromFormattedMap(body.terms);

        var updateValues = {
            applicable_fee_types: applicableFeeTypes,
            applicable_terms: applicableTerms,
            fee_structure_desc: feeStructureDesc,
            fee_structure_name: feeStructureName,
            updated_date: updatedDate,
            updated_by:headers.user_id,
            updated_username:headers.user_name,
            status: status
        };
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa418)
    }
    return updateValues;
};

exports.constructFeeAssignment = function(req) {
    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var userName = headers.user_id;
    var currentDate = new Date();
    var dueDate = baseService.getFormattedDate(body.dueDate);

    var applicableFeeTypes;
    var feeTypesAmount;
    var refundablePercentage;
    baseService.getMultiFormattedMap(body.feeTypes, function(feeTypesName, feeTypesAmmt, refundablePercent) {
        applicableFeeTypes = feeTypesName;
        feeTypesAmount = feeTypesAmmt;
        refundablePercentage = refundablePercent;
    });
    var applicableClasses = baseService.getMapFromFormattedMap(body.classes);
    var applicableLangauges = baseService.getMapFromFormattedMap(body.languages);
    var mediaType = baseService.getMapFromFormattedMap(body.mediaType);

    var feeAssignment = new models.instance.SchoolFeeAssignment( {
        fee_assignment_id : models.uuid(),
        fee_structure_id : (body.feeStructureId != '' && body.feeStructureId != null) ? models.uuidFromString(body.feeStructureId) : null,
        tenant_id :tenantId,
        school_id :schoolId,
        academic_year : academicYear,
        applicable_classes: applicableClasses,
        applicable_fee_types: applicableFeeTypes,
        applicable_languages: applicableLangauges,
        media_type: mediaType,
        fee_types_amount: feeTypesAmount,
        refundable_percentage: refundablePercentage,
        total_fee_amount: models.datatypes.BigDecimal.fromString(body.totalFeeAmount),
        net_amount: models.datatypes.BigDecimal.fromString(body.netAmount),
        due_date: dueDate,
        fee_assignment_name : body.feeAssignmentName,
        updated_date : currentDate,
        updated_by : headers.user_id,
        updated_username: headers.user_name,
        created_date: currentDate,
        created_by : headers.user_id,
        created_firstname : headers.user_name,
        assigned_categories: JSON.stringify(body.assignedCategories)
    });

    return feeAssignment;
};

exports.constructFeeAssignmentObj = function(req, data, callback) {
    try{
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var academicYear = headers.academic_year;
        var userName = headers.user_id;
        var currentDate = new Date();
        var dueDate = baseService.getFormattedDate(body.dueDate);
        var applicableFeeTypes;
        var feeTypesAmount;
        var refundablePercentage;
        baseService.getMultiFormattedMap(body.feeTypes, function(feeTypesName, feeTypesAmt, refundablePercent) {
            applicableFeeTypes = feeTypesName;
            feeTypesAmount = feeTypesAmt;
            refundablePercentage = refundablePercent;
        });
        var applicableClasses = baseService.getMapFromFormattedMap(body.classes);
        var applicableLangauges = baseService.getMapFromFormattedMap(body.languages);
        /*var mediaType = baseService.getMapFromFormattedMap(body.mediaType);*/
        var feeAssignmentId = models.uuid();

        var feeAssignment = new models.instance.SchoolFeeAssignment( {
            fee_assignment_id : feeAssignmentId,
            fee_structure_id : (body.feeStructureId != '' && body.feeStructureId != null) ? models.uuidFromString(body.feeStructureId) : null,
            updated_date : currentDate,
            tenant_id :tenantId,
            school_id :schoolId,
            academic_year : academicYear,
            applicable_classes: applicableClasses,
            applicable_fee_types: applicableFeeTypes,
            applicable_languages: applicableLangauges,
            /*media_type: mediaType,*/
            fee_types_amount: feeTypesAmount,
            total_fee_amount: models.datatypes.BigDecimal.fromString(body.totalFeeAmount),
            refundable_percentage: refundablePercentage,
            due_date: dueDate,
            fee_assignment_name : body.feeAssignmentName,
            updated_by : headers.user_id,
            updated_username: headers.user_name,
            created_date: currentDate,
            created_by : headers.user_id,
            created_firstname : headers.user_name,
            assigned_categories: JSON.stringify(data.taxanomy)
        });

        var feeAssignmentObj = feeAssignment.save({return_query: true});
        var array = [feeAssignmentObj];
        data.fee_assignment_id = feeAssignmentId;
        data.batchObj = array;

        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, data);
    }
};

function feeAssignmentQueryObject(req) {

    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var feeAssignmentId = req.params.typeId;

    var queryObject =  {
        fee_assignment_id : models.uuidFromString(feeAssignmentId),
        tenant_id :tenantId,
        school_id :schoolId,
        academic_year : academicYear
    };

    return queryObject;
};

exports.feeAssignmentQueryObject = feeAssignmentQueryObject;

function feeAssignmentUpdateValues(req, data) {

    var body = req.body;
    var headers = baseService.getHeaders(req);
    var userName = headers.user_id;
    var currentDate = new Date();
    var dueDate = baseService.getFormattedDate(body.dueDate);

    var applicableFeeTypes;
    var feeTypesAmount;
    var refundablePercentage;
    baseService.getMultiFormattedMap(body.feeTypes, function(feeTypesName, feeTypesAmmt, refundablePercent) {
        applicableFeeTypes = feeTypesName;
        feeTypesAmount = feeTypesAmmt;
        refundablePercentage = refundablePercent;
    });
    var applicableClasses = baseService.getMapFromFormattedMap(body.classes);
    var applicableLangauges = baseService.getMapFromFormattedMap(body.languages);
    /*var mediaType = baseService.getMapFromFormattedMap(body.mediaType);*/

    var updateValues = {
        fee_structure_id : (body.feeStructureId != '' && body.feeStructureId != null) ? models.uuidFromString(body.feeStructureId) : null,
        applicable_classes: applicableClasses ,
        applicable_fee_types: applicableFeeTypes,
        applicable_languages: applicableLangauges,
        /*media_type: mediaType,*/
        fee_types_amount: feeTypesAmount,
        total_fee_amount: models.datatypes.BigDecimal.fromString(body.totalFeeAmount),
        refundable_percentage: refundablePercentage,
        due_date: dueDate,
        fee_assignment_name : body.feeAssignmentName,
        updated_date : currentDate,
        updated_by : headers.user_id,
        updated_username: headers.user_name,
        assigned_categories: JSON.stringify(data.taxanomy)
    };
    return updateValues;
};

exports.feeAssignmentUpdateValues = feeAssignmentUpdateValues;

exports.constructFeeAssignmentDetails = function(req) {

    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var currentDate = new Date();
    var dueDate = baseService.getFormattedDate(body.dueDate);
    var paidDate = baseService.getFormattedDate(body.paidDate);
    var feeDiscountAmt = body.feeDiscountAmount == '' ? null : models.datatypes.BigDecimal.fromString(body.feeDiscountAmount);

    var applicableFeeTypes;
    var feeTypesAmount;
    var refundablePercentage;
    var scholarshipName;
    var scholarshipAmount;
    baseService.getMultiFormattedMap(body.feeTypes, function(feeTypesName, feeTypesAmmt, refundablePercent) {
        applicableFeeTypes = feeTypesName;
        feeTypesAmount = feeTypesAmmt;
        refundablePercentage = refundablePercent;
    });
    baseService.foramttedMap(body.scholarShip, function(scholarShipName, scholarShipAmt) {
        scholarshipName = scholarShipName;
        scholarshipAmount = scholarShipAmt;
    });

    var feeAssignmentDetails = new models.instance.SchoolFeeAssignmentDetails( {

        fee_assignment_detail_id:  models.uuid(),
        fee_structure_id : (body.feeStructureId != '' && body.feeStructureId != null) ? models.uuidFromString(body.feeStructureId) : null,
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year : academicYear,
        fee_assignment_id: models.uuidFromString(body.feeAssignmentId),
        fee_assignment_name:  body.feeAssignmentName,
        user_name: body.userName,
        first_name: body.firstName,
        term_id: models.uuidFromString(body.termId),
        term_name: body.termName,
        class_id: models.uuidFromString(body.classId),
        class_name: body.className,
        section_id: models.uuidFromString(body.sectionId),
        section_name: body.sectionName,
        applicable_fee_types: applicableFeeTypes,
        fee_types_amount: feeTypesAmount,
        refundable_percentage: refundablePercentage,
        net_amount: models.datatypes.BigDecimal.fromString(body.netAmount),
        due_date: dueDate,
        scholarship_name: scholarshipName,
        scholarship_amount: scholarshipAmount,
        fee_discount_name: body.feeDiscountName,
        fee_discount_amount: feeDiscountAmt,
        status: body.status,
        paid_date: paidDate,
        updated_date: currentDate,
        updated_by : headers.user_id,
        updated_username: headers.user_name,
        created_date: currentDate,
        created_by : headers.user_id,
        created_firstname : headers.user_name,
        admission_no: body.admissionNo

    });

    return feeAssignmentDetails;
};

exports.feeAssignmentDetailQueryObject = function(req) {

    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var feeAssignmentDetailId = req.params.typeId;

    var queryObject =  {
        fee_assignment_detail_id: models.uuidFromString(feeAssignmentDetailId),
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year : academicYear
    };
    return queryObject;
};

exports.feeAssignmentDetailUpdateValues = function(req) {

     try {
         var body = req.body;
         var headers = baseService.getHeaders(req);
         var currentDate = new Date();
         var dueDate = baseService.getFormattedDate(body.dueDate);
         var paidDate = baseService.getFormattedDate(body.paidDate);
         var feeDiscountAmt = body.feeDiscountAmount == '' ? null : models.datatypes.BigDecimal.fromString(body.feeDiscountAmount);

         var applicableFeeTypes;
         var feeTypesAmount;
         var refundablePercentage;
         var scholarshipName;
         var scholarshipAmount;
         baseService.getMultiFormattedMap(body.feeTypes, function(feeTypesName, feeTypesAmmt, refundablePercent) {
             applicableFeeTypes = feeTypesName;
             feeTypesAmount = feeTypesAmmt;
             refundablePercentage = refundablePercent;
         });
         baseService.foramttedMap(body.scholarShip, function(scholarShipName, scholarShipAmt) {
             scholarshipName = scholarShipName;
             scholarshipAmount = scholarShipAmt;
         });

         var updateValues = {
			 fee_structure_id : (body.feeStructureId != '' && body.feeStructureId != null) ? models.uuidFromString(body.feeStructureId) : null,
             fee_assignment_name:  body.feeAssignmentName,
             user_name: body.userName,
             first_name: body.firstName,
             /*term_id: models.uuidFromString(body.termId),*/
             term_name: body.termName,
             class_id: models.uuidFromString(body.classId),
             class_name: body.className,
             section_id: models.uuidFromString(body.sectionId),
             section_name: body.sectionName,
             applicable_fee_types: applicableFeeTypes,
             fee_types_amount: feeTypesAmount,
             refundable_percentage: refundablePercentage,
             net_amount: models.datatypes.BigDecimal.fromString(body.netAmount),
             due_date: dueDate,
             scholarship_name: scholarshipName,
             scholarship_amount: scholarshipAmount,
             fee_discount_name: body.feeDiscountName,
             fee_discount_amount: feeDiscountAmt,
             status: body.status,
             paid_date: paidDate,
             updated_date: currentDate,
             updated_by : headers.user_id,
             updated_username: headers.user_name,
             admission_no: body.admissionNo
         };
     } catch (err) {
         logger.debug(err);
         return err;
     }

    return updateValues;
};

exports.constructFeeAssignmentDetailObj = function(req, data, callback) {
    try {
        var array = data.batchObj;
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var academicYear = headers.academic_year;
        var currentDate = new Date();
        var feeAssignmentId = data.fee_assignment_id;
        var dueDate = baseService.getFormattedDate(body.dueDate);
        var paidDate = baseService.getFormattedDate(body.paidDate);

        var applicableFeeTypes;
        var feeTypesAmount;
        var refundablePercentage;
        baseService.getMultiFormattedMap(body.feeTypes, function(feeTypesName, feeTypesAmt, refundablePercent) {
            applicableFeeTypes = feeTypesName;
            feeTypesAmount = feeTypesAmt;
            refundablePercentage = refundablePercent;
        });

        _.forEach(data.users.usersByLanguages, function(value, key){
            var feeAssignmentDetails = new models.instance.SchoolFeeAssignmentDetails({
                fee_assignment_detail_id:  models.uuid(),
                fee_structure_id : (body.feeStructureId != '' && body.feeStructureId != null) ? models.uuidFromString(body.feeStructureId) : null,
                tenant_id: tenantId,
                school_id: schoolId,
                academic_year : academicYear,
                fee_assignment_id: feeAssignmentId, //TO DO Generically
                fee_assignment_name:  body.feeAssignmentName,
                user_name: value.userName,
                first_name: value.firstName,
                term_id: models.uuidFromString(body.termId),
                term_name: body.termName,
                class_id: models.uuidFromString(value.classes[0].class_id),
                class_name: value.classes[0].class_name,
                section_id: models.uuidFromString(value.classes[0].section_id),
                section_name: value.classes[0].section_name,
                applicable_fee_types: applicableFeeTypes,
                fee_types_amount: feeTypesAmount,
                refundable_percentage: refundablePercentage,
                net_amount: models.datatypes.BigDecimal.fromString(body.totalFeeAmount),
                due_date: dueDate,
                fee_discount_name: body.feeDiscountName,
                status: Boolean(body.status),
                updated_date: currentDate,
                updated_by : headers.user_id,
                updated_username: headers.user_name,
                created_date: currentDate,
                created_by : headers.user_id,
                created_firstname : headers.user_name,
                admission_no: value.admissionNo
            });
            var feeAssignmentDetailsObj = feeAssignmentDetails.save({return_query: true});
            array.push(feeAssignmentDetailsObj);
        });
        data.batchObj = array;
        callback(null, data)
    } catch (err) {
        callback(err, data)
    }
};

exports.updateScholarshipDetailsObj = function(req, data, callback) {
    try {
        var array = [];
        var feeAssignmentDetailObjs = req.body.feeAssignmentDetail;
        var headers = baseService.getHeaders(req);
        var body = req.body;
        var dueDate = baseService.getFormattedDate(body.dueDate);
        var sDueDate = baseService.getFormattedDate(body.dueDate1);
        var paidDate = baseService.getFormattedDate(body.paidDate);
        var feeDiscountAmt = body.feeDiscountAmount == '' ? null : models.datatypes.BigDecimal.fromString(parseFloat(body.feeDiscountAmount).toFixed(2));
        var currentDate = new Date();
        baseService.foramttedMap(body.scholarShip, function(scholarShipName, scholarShipAmt) {
            scholarshipName = scholarShipName;
            scholarshipAmount = scholarShipAmt;
        });

        _.forEach(feeAssignmentDetailObjs, function(value, key){
            var queryObject =  {
                fee_assignment_detail_id: models.uuidFromString(value.feeAssignmentDetailId),
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id: models.uuidFromString(headers.school_id),
                academic_year : value.academicYear,
            };
            var updateValues = {
                scholarship_name: scholarshipName,
                scholarship_amount: scholarshipAmount,
                fee_discount_name: body.feeDiscountName,
                fee_discount_amount: feeDiscountAmt,
                net_amount: models.datatypes.BigDecimal.fromString(body.netAmount),
                due_date: sDueDate,
                paid_date: paidDate,
                status: body.status,
                updated_date : currentDate
            };
            var updateQuery = models.instance.SchoolFeeAssignmentDetails.update(queryObject, updateValues, {return_query: true});
            array.push(updateQuery);
        });

        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        callback(err, data);
    }
};


exports.updateAssignedFeeStatus = function(req, data, callback) {
    try {
        var body = req.body;
        var feeAssignmentId = req.params.id;
        var queryObject = getHeaders(req);
        queryObject.fee_assignment_id = models.uuidFromString(feeAssignmentId);

        var updateValues = { status: JSON.parse(body.status) };

        var update_query = models.instance.SchoolFeeAssignment.update(queryObject, updateValues, {return_query: true});
        data.fee_assignment_id = models.uuidFromString(feeAssignmentId);
        data.batchObj = [update_query];
        callback(null, data);
    } catch (err) {
        callback(err, data);
    }
};

exports.updateAssignedFeeDetailsStatus = function(req, data, callback) {
    try {
        var array = data.batchObj;
        var body = req.body;
        _.forEach(data.details, function(value, key){
            var queryObject =  {
                fee_assignment_detail_id: value.feeAssignmentDetailId,
                tenant_id: value.tenantId,
                school_id: value.schoolId,
                academic_year : value.academicYear,
            };
            var updateValues = { status: JSON.parse(body.status) };
            var update_query = models.instance.SchoolFeeAssignmentDetails.update(queryObject, updateValues, {return_query: true});
            array.push(update_query);
        });
        data.batchObj = array;
        callback(null, data)
    } catch (err) {
        callback(err, data)
    }
};

exports.updateAssignFee = function(req, data, callback) {
    try {
        var array = [];
        var feeAssignmentId = req.params.typeId;
        var queryObject = feeAssignmentQueryObject(req);
        var updateValues = feeAssignmentUpdateValues(req, data);
        var updateQuery = models.instance.SchoolFeeAssignment.update(queryObject, updateValues, {return_query: true});
        array.push(updateQuery);
        data.batchObj = array;
        data.fee_assignment_id = feeAssignmentId;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, data);
    }

};

exports.deleteAllFeeDetails = function(req, data, callback) {
    try {
        var arr = data.batchObj;
        var feeDetailsObj = req.body.feeDetailObj;
        _.forEach(feeDetailsObj, function(value, key){
            var headers = baseService.getHeaders(req);
            var tenantId = models.timeuuidFromString(headers.tenant_id);
            var schoolId = models.uuidFromString(headers.school_id);
            var academicYear = headers.academic_year;

            var queryObject =  {
                fee_assignment_detail_id: models.uuidFromString(value.feeAssignmentDetailId),
                tenant_id: tenantId,
                school_id: schoolId,
                academic_year : academicYear
            };
            var feeAssignmentDetailsObj = models.instance.SchoolFeeAssignmentDetails.delete(queryObject, {return_query: true});
            arr.push(feeAssignmentDetailsObj);
        });

        data.batchObj = arr;
        callback(null, data);
    } catch (err) {
        callback(err, data);
    }
};

exports.checkUsersAndSaveFeeDetails = function(req, data, callback) {
    try {
            var batchQueries = data.batchObj;
            var feeDetailsObj = req.body.feeDetailObj;
            var totalAmount = req.body.oldTotalFeeAmount;
            _.forEach(data.users.usersByLanguages, function(value, key) {
                checkResult(feeDetailsObj, value.userName, function (checked, obj) {
                    if (checked) {
                        var feeAssignmentDetail = constructUpdateFeeAssignmentDetails(req, obj, totalAmount);
                        var save_query = feeAssignmentDetail.save({return_query: true});
                        batchQueries.push(save_query);
                    } else {
                        var feeAssignmentDetail = feeAssignmentDetails(data.fee_assignment_id, req, value);
                        var save_query = feeAssignmentDetail.save({return_query: true});
                        batchQueries.push(save_query);
                    }
                })
            });
        data.fee_assignment_id = models.uuidFromString(data.fee_assignment_id);
        data.batchObj = batchQueries;
        callback(null, data);
    } catch (err) {
        callback(err, data);
    }
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

function checkResult(startArray, username, callback) {
    var saved = false;
    var obj = [];
    if(JSON.stringify(startArray) != '[]') {
        async.map(startArray, function (member, callback) {
            if(member.userName == username) {
                saved = true;
                obj = member;
            } else {
                saved = false;
            }
            callback(saved, obj);
        }, function allDone() {
            callback(saved, obj);
        }, callback);

    } else {
        callback(null,false);
    }
};

exports.checkResult = checkResult;

function constructUpdateFeeAssignmentDetails(req, feeObj, amount) {

    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var currentDate = new Date();
    var netAmount = req.body.totalFeeAmount;
    var dueDate = baseService.getFormattedDate(feeObj.dueDate);
    var paidDate = baseService.getFormattedDate(feeObj.paidDate);
    var totalAmount = amount - feeObj.netAmount;
    netAmount = (netAmount - totalAmount).toString();
    var status = feeObj.status == constants.STATUS_PENDING ? false : true;
    var feeDiscountAmt = feeObj.feeDiscountAmount == 0 ? models.datatypes.BigDecimal.fromString("0") : models.datatypes.BigDecimal.fromString(feeObj.feeDiscountAmount);

    var applicableFeeTypes;
    var feeTypesAmount;
    var refundablePercentage;
    var scholarshipName;
    var scholarshipAmount;
    baseService.getMultiFormattedMap(feeObj.feeTypes, function(feeTypesName, feeTypesAmmt, refundablePercent) {
        applicableFeeTypes = feeTypesName;
        feeTypesAmount = feeTypesAmmt;
        refundablePercentage = refundablePercent;
    });
    baseService.foramttedMap(feeObj.scholarShip, function(scholarShipName, scholarShipAmt) {
        scholarshipName = scholarShipName;
        scholarshipAmount = scholarShipAmt;
    });

    var feeAssignmentDetails = new models.instance.SchoolFeeAssignmentDetails( {

        fee_assignment_detail_id:  models.uuid(),
        fee_structure_id : (feeObj.feeStructureId != '' && feeObj.feeStructureId != null) ? models.uuidFromString(feeObj.feeStructureId) : null,
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year : academicYear,
        fee_assignment_id: models.uuidFromString(feeObj.feeAssignmentId),
        fee_assignment_name:  feeObj.feeAssignmentName,
        user_name: feeObj.userName,
        /*term_id: models.uuidFromString(feeObj.termId),
        term_name: feeObj.termName,*/
        class_id: models.uuidFromString(feeObj.classId),
        class_name: feeObj.className,
        section_id: models.uuidFromString(feeObj.sectionId),
        section_name: feeObj.sectionName,
        applicable_fee_types: applicableFeeTypes,
        fee_types_amount: feeTypesAmount,
        refundable_percentage: refundablePercentage,
        net_amount: models.datatypes.BigDecimal.fromString(netAmount),
        due_date: dueDate,
        scholarship_name: scholarshipName,
        scholarship_amount: scholarshipAmount,
        fee_discount_name: feeObj.feeDiscountName,
        fee_discount_amount: feeDiscountAmt,
        status: status,
        paid_date: paidDate,
        
        first_name: feeObj.firstName,
        updated_date: currentDate,
        updated_by : headers.user_id,
        updated_username: headers.user_name,
        admission_no: feeObj.admissionNo
    });

    return feeAssignmentDetails;
};

exports.constructUpdateFeeAssignmentDetails = constructUpdateFeeAssignmentDetails;

function feeAssignmentDetails(feeAssignmentId, req, response) {
    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var currentDate = new Date();
    var dueDate = baseService.getFormattedDate(body.dueDate);
    var paidDate = baseService.getFormattedDate(body.paidDate);

    var applicableFeeTypes;
    var feeTypesAmount;
    var refundablePercentage;
    var scholarshipName;
    var scholarshipAmount;
    baseService.getMultiFormattedMap(body.feeTypes, function(feeTypesName, feeTypesAmmt, refundablePercent) {
        applicableFeeTypes = feeTypesName;
        feeTypesAmount = feeTypesAmmt;
        refundablePercentage = refundablePercent;
    });
    /*baseService.foramttedMap(body.scholarShip, function(scholarShipName, scholarShipAmt) {
     scholarshipName = scholarShipName;
     scholarshipAmount = scholarShipAmt;
     });*/

    var feeAssignmentDetails = new models.instance.SchoolFeeAssignmentDetails( {

        fee_assignment_detail_id:  models.uuid(),
        fee_structure_id : (body.feeStructureId != '' && body.feeStructureId != null) ? models.uuidFromString(body.feeStructureId) : null,
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year : academicYear,
        fee_assignment_id: models.uuidFromString(feeAssignmentId), //TO DO Generically
        fee_assignment_name:  body.feeAssignmentName,
        user_name: response.userName,
        first_name: response.firstName,
        term_id: models.uuidFromString(body.termId),
        term_name: body.termName,
        class_id: models.uuidFromString(response.classes[0].class_id),
        class_name: response.classes[0].class_name,
        section_id: models.uuidFromString(response.classes[0].section_id),
        section_name: response.classes[0].section_name,
        applicable_fee_types: applicableFeeTypes,
        fee_types_amount: feeTypesAmount,
        refundable_percentage: refundablePercentage,
        net_amount: models.datatypes.BigDecimal.fromString(body.totalFeeAmount),
        due_date: dueDate,
        fee_discount_name: body.feeDiscountName,
        status: Boolean(body.status),
        
        updated_date: currentDate,
        updated_by : headers.user_id,
        updated_username: headers.user_name,
        admission_no: response.admissionNo
    });
    return feeAssignmentDetails;
};

exports.feeAssignmentDetails = feeAssignmentDetails;

exports.getTemplateObj = function(req, templates, callback) {
    var body =  req.body;
    var params = {fee_name: body.feeAssignmentName, due_date: body.dueDate};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        callback(err, result);
    });
};

exports.updateFeeDetailStatus = function (req, data, callback) {
    if (_.isEqual(data.txnStatus, 'Success')) {
        try {
            var queryObject = {
                fee_assignment_detail_id: models.uuidFromString(data.feeId),
                tenant_id: models.timeuuidFromString(data.tenant_id),
                school_id: models.uuidFromString(data.school_id),
                academic_year: data.academic_year
            }
            var body = req.body;
            var paidAmount = Number(body.paidAmount)
            var netAmount = Number(body.netAmount)
            var isPaid = netAmount == paidAmount ? true : false
            var updateValues = {
                is_paid: isPaid,
                is_partial: body.isPartial || false,
                paid_amount: models.datatypes.BigDecimal.fromNumber(paidAmount),
                updated_date: new Date(),
            };
            if(req.headers.session_id != undefined) {
                var headers = baseService.getHeaders(req);
                updateValues.updated_by = headers.user_id
            }
            models.instance.SchoolFeeAssignmentDetails.update(queryObject, updateValues);
        } catch (err) {
            throwConverterErr(err, message.nsa436);
        }
        ;
    }
    callback(null, data);
};

exports.updatePaymentGatewayFeeDetailStatus = function (req, data, callback) {
    if (_.isEqual(data.txnStatus, 'Success')) {
        try {
            var queryObject = {
                fee_assignment_detail_id: models.uuidFromString(data.feeId),
                tenant_id: models.timeuuidFromString(data.tenant_id),
                school_id: models.uuidFromString(data.school_id),
                academic_year: data.academic_year
            }

            var updateValues = {
                is_paid: true,
                updated_date: new Date(),
            };
            models.instance.SchoolFeeAssignmentDetails.findOne(queryObject, function (err, result) {
                if(!err) {
                    var paidAmount = Number(data['amount']) + Number(result['paid_amount'])
                    updateValues.paid_amount = models.datatypes.BigDecimal.fromNumber(paidAmount);
                    models.instance.SchoolFeeAssignmentDetails.update(queryObject, updateValues);
                }
            });

        } catch (err) {
            throwConverterErr(err, message.nsa436);
        }
        ;
    }
    callback(null, data);
};


function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.FEE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildErrResponse = buildErrResponse;

function throwConverterErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.FEE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwConverterErr = throwConverterErr;
