
var express = require('express')
    , request = require('request');

var constants = require('../../common/constants/constants');
var status = require('../../common/domains/Status');
var requestParam = require('../../common/domains/RequestParam');
var models = require('../../models/index')
    , baseService = require('./base.service')
    , dateService = require('../../utils/date.service.js');

exports.constructFeeTypeDetails = function(req, res) {

    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var currentDate = new Date();

    console.info('body.feeTypeName = ', body.feeTypeName);
    var feeTypeDetails = new models.instance.SchoolFeeType( {
        fee_type_id: models.uuid(),
        tenant_id:tenantId,
        school_id:schoolId,
        fee_type_name: body.feeTypeName,
        fee_desc: body.feeTypeDesc,
        deposit: body.feeTypeDeposit,
        created_date : currentDate,
        created_by : "demo",//body.createdBy,
        default : false,
        status : true
    });

    return feeTypeDetails;
}


exports.constructFeeScholarshipDetails = function(req, res) {

    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var currentDate = new Date();

    console.info('feeScholarshipDetails = ', req.body);


    var vlimit = body.validUpto;
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    var validUpto = new Date(vlimit.replace(pattern,'$1-$2-$3'));

    console.info("validUpto =" + validUpto);

   // var amount = new String(body.amount);
   // console.info("Amount =" + amount);
   // console.info("Bigdecimal Amount =" + models.datatypes.BigDecimal.fromString(amount));
    var feeScholarshipDetails = new models.instance.SchoolScholarshipType( {

        scholarship_id : models.uuid(),
        created_date : currentDate,
        tenant_id :tenantId,
        school_id :schoolId,
        amount :body.amount,
        //attachment : body.attachment,
        created_by : "demo", //body.createdBy,
        scholarship_desc : body.scholarshipDesc,
        scholarship_name : body.scholarshipName,
        status : body.status,
        valid_upto : validUpto

    });

    return feeScholarshipDetails;
}

exports.constructFeeStructureDetails = function(req, res) {

    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = req.headers.academic_year;

    var currentDate = new Date();

    console.info('body.scholarShipName = ', body.scholarShipName);
    var feeStructureDetails = new models.instance.SchoolFeeStructure( {

        fee_structure_id : models.uuid(),
        created_date : currentDate,
        tenant_id :tenantId,
        school_id :schoolId,
        academic_year : academicYear,
        applicable_fee_types : body.applicableFeeTypes,
        applicable_terms : body.applicableTerms,
        created_by : body.createdBy,
        fee_structure_desc : body.feeStructureDesc,
        fee_structure_name : body.feeStructureName,
        status : body.status
    });

    return feeStructureDetails;
}

exports.constructFeeAssignment = function(req, res) {

    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = req.headers.academic_year;
    var currentDate = new Date();
    var vlimit = body.dueDate;
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    var dueDate = new Date(vlimit.replace(pattern,'$1-$2-$3'));

    var feeAssignmentDetails = new models.instance.SchoolFeeAssignment( {

        fee_assignment_id : models.uuid(),
        created_date : currentDate,
        tenant_id :tenantId,
        school_id :schoolId,
        academic_year : academicYear,
        applicable_classes: body.applicableClasses,
        applicable_fee_types: body.applicableFeeTypes,
        fee_types_amount: body.feeTypesAmount,
        total_fee_amount: models.datatypes.BigDecimal.fromString(body.totalFeeAmount),
        refundable_percentage: models.datatypes.BigDecimal.fromString(body.refundablePercentage),
        net_amount: models.datatypes.BigDecimal.fromString(body.netAmount),
        due_date: dueDate,
        fee_assignment_name : body.feeAssignmentDesc,
        fee_assignment_desc : body.feeAssignmentName,
    });

    return feeAssignmentDetails;
}

exports.constructFeeAssignmentDetails = function(req, res) {

    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = req.headers.academic_year;
    var currentDate = new Date();
    var vlimit = body.dueDate;
    var vlimit1 = body.paidDate;
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    var dueDate = new Date(vlimit.replace(pattern,'$1-$2-$3'));
    var paidDate = new Date(vlimit1.replace(pattern,'$1-$2-$3'));

    var feeAssignmentDetails = new models.instance.SchoolFeeAssignmentDetails( {

        fee_assignment_detail_id:  models.uuid(),
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year : academicYear,
        fee_assignment_id: models.uuidFromString(body.feeAssignmentId),
        fee_assignment_name:  body.feeAssignmentName,
        username: body.username,
        term_id: models.uuidFromString(body.termId),
        term_name: body.termName,
        class_id: models.uuidFromString(body.classId),
        class_name: body.className,
        section_id: models.uuidFromString(body.sectionId),
        section_name: body.sectionName,
        applicable_fee_types: body.applicableFeeTypes,
        fee_types_amount: body.feeTypesAmount,
        refundable_percentage: models.datatypes.BigDecimal.fromString(body.refundablePercentage),
        net_amount: models.datatypes.BigDecimal.fromString(body.netAmount),
        due_date: dueDate,
        scholarship_id: models.uuidFromString(body.scholarshipId),
        scholarship_name: body.scholarshipName,
        scholarship_amount: models.datatypes.BigDecimal.fromString(body.scholarshipAmount),
        fee_discount_name: body.feeDiscountName,
        fee_discount_amount: models.datatypes.BigDecimal.fromString(body.feeDiscountAmount),
        status: body.status,
        paid_date: paidDate,
        created_date: currentDate
    });

    return feeAssignmentDetails;
}