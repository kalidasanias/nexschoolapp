/**
 * Created by magesh on 17/01/17.
 */

var requestParam = require('../common/domains/RequestParam');
var feeTypeDomain = require('../common/domains/FeeType');
var feeScholarshipDomain = require('../common/domains/FeeScholarship');
var feeStructureDomain = require('../common/domains/FeeStructure');
var feeAssignmentDomain = require('../common/domains/FeeAssignment');
var feeAssignmentDetailsDomain = require('../common/domains/FeeAssignmentDetails')
    , baseService = require('../services/common/base.service')
    , constants = require('../common/constants/constants')
    , dateService = require('../utils/date.service');


exports.feeTypeObjs = function(req, res, data) {
    convertFeeTypeObjs = [];
    try {
        data.forEach(function (feetype) {
            var convertFeeTypeObj = Object.assign({}, feeTypeDomain);
            convertFeeTypeObj.id= feetype['fee_type_id'],
                convertFeeTypeObj.createdDate = feetype['created_date'],
                convertFeeTypeObj.tenantId = feetype['tenant_id'],
                convertFeeTypeObj.schoolId = feetype['school_id'],
                convertFeeTypeObj.createdBy = feetype['created_by'],
                convertFeeTypeObj.isDefault = feetype['default'],
                convertFeeTypeObj.feeDeposit = feetype['deposit'],
                convertFeeTypeObj.feeTypeDesc = feetype['fee_desc'],
                convertFeeTypeObj.name = feetype['fee_type_name'],
                convertFeeTypeObj.status = feetype['status'],
                convertFeeTypeObj.updatedDate = feetype['updated_date'],
                convertFeeTypeObjs.push(convertFeeTypeObj);
        });
    }
    catch (err) {
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertFeeTypeObjs;
}


exports.feeTypeObj = function(req, res, feetype) {
    var convertFeeTypeObj = Object.assign({}, feeTypeDomain);
    try {
            convertFeeTypeObj.feeTypeId= feetype['fee_type_id'],
            convertFeeTypeObj.createdDate = feetype['created_date'],
            convertFeeTypeObj.tenantId = feetype['tenant_id'],
            convertFeeTypeObj.schoolId = feetype['school_id'],
            convertFeeTypeObj.createdBy = feetype['created_by'],
            convertFeeTypeObj.isDefault = feetype['default'],
            convertFeeTypeObj.feeDeposit = feetype['deposit'],
            convertFeeTypeObj.feeTypeDesc = feetype['fee_desc'],
            convertFeeTypeObj.feeTypeName = feetype['fee_type_name'],
            convertFeeTypeObj.status = feetype['status'],
            convertFeeTypeObj.updatedDate = feetype['updated_date'];
    }
    catch (err) {
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertFeeTypeObj;
}

exports.feeScholarshipObjs = function(req, res, data) {
    convertFeeScholarshipObjs = [];
    try {
        data.forEach(function (feeScholarship) {
            var convertFeeScholarshipObj = Object.assign({}, feeScholarshipDomain);
            convertFeeScholarshipObj.id= feeScholarship['scholarship_id'],
            convertFeeScholarshipObj.createdDate = feeScholarship['created_date'],
            convertFeeScholarshipObj.tenantId = feeScholarship['tenant_id'],
            convertFeeScholarshipObj.schoolId = feeScholarship['school_id'],
            convertFeeScholarshipObj.amount = feeScholarship['amount'],
            convertFeeScholarshipObj.attachment = feeScholarship['attachment'],
            convertFeeScholarshipObj.createdBy = feeScholarship['created_by'],
            convertFeeScholarshipObj.scholarshipDesc = feeScholarship['scholarship_desc'],
            convertFeeScholarshipObj.name = feeScholarship['scholarship_name'],
            convertFeeScholarshipObj.status = feeScholarship['status'],
            convertFeeScholarshipObj.validUpto = feeScholarship['valid_upto'],
            convertFeeScholarshipObj.updateddate = feeScholarship['updated_date'];
            convertFeeScholarshipObjs.push(convertFeeScholarshipObj);
        });
    }
    catch (err) {
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertFeeScholarshipObjs;
}

exports.feeScholarshipObj = function(req, res, scholarship) {
    var convertFeeScholarshipObj = Object.assign({}, feeScholarshipDomain);
    try {
        convertFeeScholarshipObj.id= scholarship['scholarship_id'],
        convertFeeScholarshipObj.createdDate = scholarship['created_date'],
        convertFeeScholarshipObj.tenantId = scholarship['tenant_id'],
        convertFeeScholarshipObj.schoolId = scholarship['school_id'],
        convertFeeScholarshipObj.amount = scholarship['amount'],
        convertFeeScholarshipObj.attachment = scholarship['attachment'],
        convertFeeScholarshipObj.createdBy = scholarship['created_by'],
        convertFeeScholarshipObj.scholarshipDesc = scholarship['scholarship_desc'],
        convertFeeScholarshipObj.name = scholarship['scholarship_name'],
        convertFeeScholarshipObj.status = scholarship['status'],
        convertFeeScholarshipObj.validUpto = scholarship['valid_upto'];
        convertFeeScholarshipObj.updateddate = scholarship['updated_date'];
    }
    catch (err) {
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertFeeScholarshipObj;
}

exports.feeStructureObjs = function(req, res, data) {
    convertFeeStructureObjs = [];
    try {
        data.forEach(function (feeStructure) {
            var convertFeeStructureObj = Object.assign({}, feeStructureDomain);

            var applicableFeeTypes = baseService.getFormattedMap(feeStructure['applicable_fee_types']);
            var terms = baseService.getFormattedMap(feeStructure['applicable_terms']);
            var applicableTerms = baseService.getArrayFromMap(feeStructure['applicable_terms']);
            var feeStatus = feeStructure['status'] ? constants.STATUS_ACTIVE : constants.STATUS_DEACTIVE;

            convertFeeStructureObj.feeStructureId = feeStructure['fee_structure_id'],
            convertFeeStructureObj.createdDate = feeStructure['created_date'],
            convertFeeStructureObj.tenantId = feeStructure['tenant_id'],
            convertFeeStructureObj.schoolId = feeStructure['school_id'],
            convertFeeStructureObj.academicYear = feeStructure['academic_year'],
            convertFeeStructureObj.applicableFeeTypes = applicableFeeTypes,
            convertFeeStructureObj.applicableTerms = applicableTerms,
            convertFeeStructureObj.terms = terms,
            convertFeeStructureObj.createdBy = feeStructure['created_by'],
            convertFeeStructureObj.feeStructureDesc = feeStructure['fee_structure_desc'],
            convertFeeStructureObj.feeStructureName = feeStructure['fee_structure_name'],
            convertFeeStructureObj.status = feeStatus,
            convertFeeStructureObj.updatedDate = feeStructure['updated_date'];
            convertFeeStructureObjs.push(convertFeeStructureObj);
        });
    }
    catch (err) {
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertFeeStructureObjs;
}

exports.feeStructureObj = function(req, res, feeStructure) {
    var convertFeeStructureObj = Object.assign({}, feeStructureDomain);
    try {
            var applicableFeeTypes = baseService.getFormattedMap(feeStructure['applicable_fee_types']);
            var terms = baseService.getFormattedMap(feeStructure['applicable_terms']);
            var applicableTerms = baseService.getArrayFromMap(feeStructure['applicable_terms']);
            var feeStatus = feeStructure['status'] ? constants.STATUS_ACTIVE : constants.STATUS_DEACTIVE;

            convertFeeStructureObj.feeStructureId = feeStructure['fee_structure_id'],
            convertFeeStructureObj.createdDate = feeStructure['created_date'],
            convertFeeStructureObj.tenantId = feeStructure['tenant_id'],
            convertFeeStructureObj.schoolId = feeStructure['school_id'],
            convertFeeStructureObj.academicYear = feeStructure['academic_year'],
            convertFeeStructureObj.applicableFeeTypes = applicableFeeTypes,
            convertFeeStructureObj.applicableTerms = applicableTerms,
            convertFeeStructureObj.terms = terms,
            convertFeeStructureObj.createdBy = feeStructure['created_by'],
            convertFeeStructureObj.feeStructureDesc = feeStructure['fee_structure_desc'],
            convertFeeStructureObj.feeStructureName = feeStructure['fee_structure_name'],
            convertFeeStructureObj.status = feeStatus,
            convertFeeStructureObj.updatedDate = feeStructure['updated_date'];
    }
    catch (err) {
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertFeeStructureObj;
}

exports.feeAssignmentObjs = function(req, res, data) {
    convertFeeAssignmentObjs = [];
    try {
        data.forEach(function (feeAssignment) {
                var convertFeeAssignmentObj = Object.assign({}, feeAssignmentDomain);

                var feeTypes = baseService.getFormattedMaps(feeAssignment['applicable_fee_types'], feeAssignment['fee_types_amount'],
                    feeAssignment['refundable_percentage']);
                var applicableClasses = baseService.getFormattedMap(feeAssignment['applicable_classes']);
                var applicableLanguages = baseService.getFormattedMap(feeAssignment['applicable_languages']);
                var mediaTypes = baseService.getFormattedMap(feeAssignment['media_type']);
                var feeStatus = feeAssignment['status'] ? constants.STATUS_PUBLISH : constants.STATUS_PENDING;
                var dueDate = dateService.getFormattedDate(feeAssignment['due_date']);
                var createdDate = dateService.getFormattedDate(feeAssignment['created_date']);

                convertFeeAssignmentObj.feeAssignmentId = feeAssignment['fee_assignment_id'],
                convertFeeAssignmentObj.tenantId = feeAssignment['tenant_id'],
                convertFeeAssignmentObj.schoolId = feeAssignment['school_id'],
                convertFeeAssignmentObj.academicYear = feeAssignment['academic_year'],
                convertFeeAssignmentObj.feeAssignmentName = feeAssignment['fee_assignment_name'],
                convertFeeAssignmentObj.classes = applicableClasses,
                convertFeeAssignmentObj.languages = applicableLanguages,
                convertFeeAssignmentObj.mediaType = mediaTypes,
                convertFeeAssignmentObj.feeTypes = feeTypes,
                convertFeeAssignmentObj.totalFeeAmount = feeAssignment['total_fee_amount'],
                convertFeeAssignmentObj.dueDate = dueDate,
                convertFeeAssignmentObj.createdDate = createdDate,
                convertFeeAssignmentObj.updatedDate = feeAssignment['updated_date'],
                convertFeeAssignmentObj.createdBy = feeAssignment['created_by'],
                convertFeeAssignmentObj.status = feeStatus,
                convertFeeAssignmentObj.assignedCategories = feeAssignment['assigned_categories']
                convertFeeAssignmentObjs.push(convertFeeAssignmentObj);
        });
    }
    catch (err) {
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertFeeAssignmentObjs;
}

exports.feeAssignmentObj = function(req, res, feeAssignment) {
    var convertFeeAssignmentObj = Object.assign({}, feeAssignmentDomain);
    try {
            var feeTypes = baseService.getFormattedMaps(feeAssignment['applicable_fee_types'], feeAssignment['fee_types_amount'],
                feeAssignment['refundable_percentage']);
            var applicableClasses = baseService.getFormattedMap(feeAssignment['applicable_classes']);
            var applicableLanguages = baseService.getFormattedMap(feeAssignment['applicable_languages']);
            var mediaTypes = baseService.getFormattedMap(feeAssignment['media_type']);
            var feeStatus = feeAssignment['status'] ? constants.STATUS_PUBLISH : constants.STATUS_PENDING;
            var dueDate = dateService.getFormattedDate(feeAssignment['due_date']);
            var createdDate = dateService.getFormattedDate(feeAssignment['created_date']);

            convertFeeAssignmentObj.feeAssignmentId = feeAssignment['fee_assignment_id'],
            convertFeeAssignmentObj.tenantId = feeAssignment['tenant_id'],
            convertFeeAssignmentObj.schoolId = feeAssignment['school_id'],
            convertFeeAssignmentObj.academicYear = feeAssignment['academic_year'],
            convertFeeAssignmentObj.feeAssignmentName = feeAssignment['fee_assignment_name'],
            convertFeeAssignmentObj.classes = applicableClasses,
            convertFeeAssignmentObj.languages = applicableLanguages,
            convertFeeAssignmentObj.mediaType = mediaTypes,
            convertFeeAssignmentObj.feeTypes = feeTypes,
            convertFeeAssignmentObj.totalFeeAmount = feeAssignment['total_fee_amount'],
            convertFeeAssignmentObj.dueDate = dueDate,
            convertFeeAssignmentObj.createdDate = createdDate,
            convertFeeAssignmentObj.updatedDate = feeAssignment['updated_date'],
            convertFeeAssignmentObj.createdBy = feeAssignment['created_by'],
            convertFeeAssignmentObj.status = feeStatus,
            convertFeeAssignmentObj.assignedCategories = feeAssignment['assigned_categories']
    }
    catch (err) {
        console.log('****************** ', err.stack);
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertFeeAssignmentObj;
};

exports.feeAssignmentDetailsObjs = function(req, res, data) {
    convertFeeAssignmentDetailsObjs = [];
    try {
        data.forEach(function (feeAssignmentDetail) {
            var convertFeeAssignmentDetailsObj = Object.assign({}, feeAssignmentDetailsDomain);

                var feeTypes = baseService.getFormattedMaps(feeAssignmentDetail['applicable_fee_types'], feeAssignmentDetail['fee_types_amount'],
                    feeAssignmentDetail['refundable_percentage']);
                var scholarship = baseService.formattedMaps(feeAssignmentDetail['scholarship_name'], feeAssignmentDetail['scholarship_amount']);
                var feeStatus = feeAssignmentDetail['status'] ? constants.STATUS_PUBLISH : constants.STATUS_PENDING;
                var paidStatus = feeAssignmentDetail['is_paid'] ? constants.STATUS_PAID : constants.STATUS_UNPAID;
                var paidDate = dateService.getFormattedDate(feeAssignmentDetail['paid_date']);
                var createdDate = dateService.getFormattedDate(feeAssignmentDetail['created_date']);
                var dueDate = dateService.getFormattedDate( feeAssignmentDetail['due_date']);

                convertFeeAssignmentDetailsObj.feeAssignmentDetailId = feeAssignmentDetail['fee_assignment_detail_id'],
                convertFeeAssignmentDetailsObj.createdDate = createdDate,
                convertFeeAssignmentDetailsObj.tenantId = feeAssignmentDetail['tenant_id'],
                convertFeeAssignmentDetailsObj.schoolId = feeAssignmentDetail['school_id'],
                convertFeeAssignmentDetailsObj.academicYear = feeAssignmentDetail['academic_year'],
                convertFeeAssignmentDetailsObj.feeAssignmentId = feeAssignmentDetail['fee_assignment_id'],
                convertFeeAssignmentDetailsObj.feeAssignmentName = feeAssignmentDetail['fee_assignment_name'],
                convertFeeAssignmentDetailsObj.username = feeAssignmentDetail['username'],
                /*convertFeeAssignmentDetailsObj.termId = feeAssignmentDetail['term_id'],
                convertFeeAssignmentDetailsObj.termName = feeAssignmentDetail['term_name'],*/
                convertFeeAssignmentDetailsObj.classId = feeAssignmentDetail['class_id'],
                convertFeeAssignmentDetailsObj.className = feeAssignmentDetail['class_name'],
                convertFeeAssignmentDetailsObj.sectionId = feeAssignmentDetail['section_id'],
                convertFeeAssignmentDetailsObj.sectionName = feeAssignmentDetail['section_name'],
                convertFeeAssignmentDetailsObj.feeTypes = feeTypes,
                convertFeeAssignmentDetailsObj.netAmount = feeAssignmentDetail['net_amount'],
                convertFeeAssignmentDetailsObj.dueDate = dueDate,
                convertFeeAssignmentDetailsObj.scholarShip = scholarship,
                convertFeeAssignmentDetailsObj.feeDiscountName = feeAssignmentDetail['fee_discount_name'],
                convertFeeAssignmentDetailsObj.feeDiscountAmount = feeAssignmentDetail['fee_discount_amount'],
                convertFeeAssignmentDetailsObj.status = feeStatus,
                convertFeeAssignmentDetailsObj.isPaid = paidStatus,
                convertFeeAssignmentDetailsObj.paidDate = paidDate
                convertFeeAssignmentDetailsObjs.push(convertFeeAssignmentDetailsObj);
        });
    }
    catch (err) {
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertFeeAssignmentDetailsObjs;
}

exports.feeAssignmentDetailsObj = function(req, res, feeAssignmentDetail) {
    var convertFeeAssignmentDetailsObj = Object.assign({}, feeAssignmentDetailsDomain);
    try {
            var feeTypes = baseService.getFormattedMaps(feeAssignmentDetail['applicable_fee_types'], feeAssignmentDetail['fee_types_amount'],
                feeAssignmentDetail['refundable_percentage']);
            var scholarship = baseService.formattedMaps(feeAssignmentDetail['scholarship_name'], feeAssignmentDetail['scholarship_amount']);
            var feeStatus = feeAssignmentDetail['status'] ? constants.STATUS_PUBLISH : constants.STATUS_PENDING;
            var paidStatus = feeAssignmentDetail['is_paid'] ? constants.STATUS_PAID : constants.STATUS_UNPAID;
            var paidDate = dateService.getFormattedDate(feeAssignmentDetail['paid_date']);
            var createdDate = dateService.getFormattedDate(feeAssignmentDetail['created_date']);
            var dueDate = dateService.getFormattedDate( feeAssignmentDetail['due_date']);

            convertFeeAssignmentDetailsObj.feeAssignmentDetailId = feeAssignmentDetail['fee_assignment_detail_id'],
            convertFeeAssignmentDetailsObj.createdDate = createdDate,
            convertFeeAssignmentDetailsObj.tenantId = feeAssignmentDetail['tenant_id'],
            convertFeeAssignmentDetailsObj.schoolId = feeAssignmentDetail['school_id'],
            convertFeeAssignmentDetailsObj.academicYear = feeAssignmentDetail['academic_year'],
            convertFeeAssignmentDetailsObj.feeAssignmentId = feeAssignmentDetail['fee_assignment_id'],
            convertFeeAssignmentDetailsObj.feeAssignmentName = feeAssignmentDetail['fee_assignment_name'],
            convertFeeAssignmentDetailsObj.username = feeAssignmentDetail['username'],
            /*convertFeeAssignmentDetailsObj.termId = feeAssignmentDetail['term_id'],
             convertFeeAssignmentDetailsObj.termName = feeAssignmentDetail['term_name'],*/
            convertFeeAssignmentDetailsObj.classId = feeAssignmentDetail['class_id'],
            convertFeeAssignmentDetailsObj.className = feeAssignmentDetail['class_name'],
            convertFeeAssignmentDetailsObj.sectionId = feeAssignmentDetail['section_id'],
            convertFeeAssignmentDetailsObj.sectionName = feeAssignmentDetail['section_name'],
            convertFeeAssignmentDetailsObj.feeTypes = feeTypes,
            convertFeeAssignmentDetailsObj.netAmount = feeAssignmentDetail['net_amount'],
            convertFeeAssignmentDetailsObj.dueDate = dueDate,
            convertFeeAssignmentDetailsObj.scholarShip = scholarship,
            convertFeeAssignmentDetailsObj.feeDiscountName = feeAssignmentDetail['fee_discount_name'],
            convertFeeAssignmentDetailsObj.feeDiscountAmount = feeAssignmentDetail['fee_discount_amount'],
            convertFeeAssignmentDetailsObj.status = feeStatus,
            convertFeeAssignmentDetailsObj.isPaid = paidStatus,
            convertFeeAssignmentDetailsObj.paidDate = paidDate
    }
    catch (err) {
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertFeeAssignmentDetailsObj;
};

exports.feeAssignmentDetailObjs = function(req, res, data) {
    convertFeeAssignmentDetailsObjs = [];
    try {
        data.forEach(function (feeAssignmentDetail) {
            var convertFeeAssignmentDetailsObj = Object.assign({}, feeAssignmentDetailsDomain);
            convertFeeAssignmentDetailsObj.feeAssignmentDetailId = feeAssignmentDetail['fee_assignment_detail_id'],
                convertFeeAssignmentDetailsObj.createdDate = feeAssignmentDetail['created_date'],
                convertFeeAssignmentDetailsObj.tenantId = feeAssignmentDetail['tenant_id'],
                convertFeeAssignmentDetailsObj.schoolId = feeAssignmentDetail['school_id'],
                convertFeeAssignmentDetailsObj.academicYear = feeAssignmentDetail['academic_year']
            convertFeeAssignmentDetailsObjs.push(convertFeeAssignmentDetailsObj);
        });
    }
    catch (err) {
        console.log('****************** ', err.stack);
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertFeeAssignmentDetailsObjs;
};