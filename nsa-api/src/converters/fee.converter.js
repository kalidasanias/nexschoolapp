/**
 * Created by magesh on 17/01/17.
 */

var requestParam = require('../common/domains/RequestParam');
var feeTypeDomain = require('../common/domains/FeeType');
var feeScholarshipDomain = require('../common/domains/FeeScholarship');
var feeStructureDomain = require('../common/domains/FeeStructure');
var feeAssignmentDomain = require('../common/domains/FeeAssignment');
var feeAssignmentDetailsDomain = require('../common/domains/FeeAssignmentDetails')


exports.feeTypeObjs = function(req, res, data) {
    convertFeeTypeObjs = [];
    try {
        data.forEach(function (feetype) {
            var convertFeeTypeObj = Object.assign({}, feeTypeDomain);
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
            convertFeeTypeObj.status = feetype['status'];
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
            convertFeeScholarshipObj.feeTypeId= feeScholarship['scholarship_id'],
            convertFeeScholarshipObj.createdDate = feeScholarship['created_date'],
            convertFeeScholarshipObj.tenantId = feeScholarship['tenant_id'],
            convertFeeScholarshipObj.schoolId = feeScholarship['school_id'],
            convertFeeScholarshipObj.amount = feeScholarship['amount'],
            convertFeeScholarshipObj.attachment = feeScholarship['attachment'],
            convertFeeScholarshipObj.createdBy = feeScholarship['created_by'],
            convertFeeScholarshipObj.scholarshipDesc = feeScholarship['scholarship_desc'],
            convertFeeScholarshipObj.scholarshipName = feeScholarship['scholarship_name'],
            convertFeeScholarshipObj.status = feeScholarship['status'],
            convertFeeScholarshipObj.validUpto = feeScholarship['validUpto'],
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
        convertFeeScholarshipObj.feeTypeId= scholarship['scholarship_id'],
        convertFeeScholarshipObj.createdDate = scholarship['created_date'],
        convertFeeScholarshipObj.tenantId = scholarship['tenant_id'],
        convertFeeScholarshipObj.schoolId = scholarship['school_id'],
        convertFeeScholarshipObj.amount = scholarship['amount'],
        convertFeeScholarshipObj.attachment = scholarship['attachment'],
        convertFeeScholarshipObj.createdBy = scholarship['created_by'],
        convertFeeScholarshipObj.scholarshipDesc = scholarship['scholarship_desc'],
        convertFeeScholarshipObj.scholarshipName = scholarship['scholarship_name'],
        convertFeeScholarshipObj.status = scholarship['status'],
        convertFeeScholarshipObj.validUpto = scholarship['validUpto'];
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
            convertFeeStructureObj.feeStructureId = feeStructure['fee_structure_id'],
            convertFeeStructureObj.createdDate = feeStructure['created_date'],
            convertFeeStructureObj.tenantId = feeStructure['tenant_id'],
            convertFeeStructureObj.schoolId = feeStructure['school_id'],
            convertFeeStructureObj.academicYear = feeStructure['academic_year'],
            convertFeeStructureObj.applicableFeeTypes = feeStructure['applicable_fee_types'],
            convertFeeStructureObj.applicableTerms = feeStructure['applicable_terms'],
            convertFeeStructureObj.createdBy = feeStructure['created_by'],
            convertFeeStructureObj.feeStructureDesc = feeStructure['fee_structure_desc'],
            convertFeeStructureObj.feeStructureName = feeStructure['fee_structure_name'],
            convertFeeStructureObj.status = feeStructure['status'],
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
        convertFeeStructureObj.feeStructureId = feeStructure['fee_structure_id'],
        convertFeeStructureObj.createdDate = feeStructure['created_date'],
        convertFeeStructureObj.tenantId = feeStructure['tenant_id'],
        convertFeeStructureObj.schoolId = feeStructure['school_id'],
        convertFeeStructureObj.academicYear = feeStructure['academic_year'],
        convertFeeStructureObj.applicableFeeTypes = feeStructure['applicable_fee_types'],
        convertFeeStructureObj.applicableTerms = feeStructure['applicable_terms'],
        convertFeeStructureObj.createdBy = feeStructure['created_by'],
        convertFeeStructureObj.feeStructureDesc = feeStructure['fee_structure_desc'],
        convertFeeStructureObj.feeStructureName = feeStructure['fee_structure_name'],
        convertFeeStructureObj.status = feeStructure['status'];
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
            convertFeeAssignmentObj.feeAssignmentId = feeAssignment['fee_assignment_id'],
                convertFeeAssignmentObj.createdDate = feeAssignment['created_date'],
                convertFeeAssignmentObj.tenantId = feeAssignment['tenant_id'],
                convertFeeAssignmentObj.schoolId = feeAssignment['school_id'],
                convertFeeAssignmentObj.academicYear = feeAssignment['academic_year'],
                convertFeeAssignmentObj.applicableFeeTypes = feeAssignment['applicable_fee_types'],
                convertFeeAssignmentObj.applicableClasses = feeAssignment['applicable_classes'],
                convertFeeAssignmentObj.feeTypesAmount = feeAssignment['fee_types_amount'],
                convertFeeAssignmentObj.totalFeeAmount = feeAssignment['total_fee_amount'],
                convertFeeAssignmentObj.feeAssignmentDesc = feeAssignment['fee_assignment_desc'],
                convertFeeAssignmentObj.feeAssignmentName = feeAssignment['fee_assignment_name'],
                convertFeeAssignmentObj.refundablePercentage = feeAssignment['refundable_percentage'],
                convertFeeAssignmentObj.netAmount = feeAssignment['net_amount'],
                convertFeeAssignmentObj.dueDate = feeAssignment['due_date'],
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
            convertFeeAssignmentObj.feeAssignmentId = feeAssignment['fee_assignment_id'],
            convertFeeAssignmentObj.createdDate = feeAssignment['created_date'],
            convertFeeAssignmentObj.tenantId = feeAssignment['tenant_id'],
            convertFeeAssignmentObj.schoolId = feeAssignment['school_id'],
            convertFeeAssignmentObj.academicYear = feeAssignment['academic_year'],
            convertFeeAssignmentObj.applicableFeeTypes = feeAssignment['applicable_fee_types'],
            convertFeeAssignmentObj.applicableClasses = feeAssignment['applicable_classes'],
            convertFeeAssignmentObj.feeTypesAmount = feeAssignment['fee_types_amount'],
            convertFeeAssignmentObj.totalFeeAmount = feeAssignment['total_fee_amount'],
            convertFeeAssignmentObj.feeAssignmentDesc = feeAssignment['fee_assignment_desc'],
            convertFeeAssignmentObj.feeAssignmentName = feeAssignment['fee_assignment_name'],
            convertFeeAssignmentObj.refundablePercentage = feeAssignment['refundable_percentage'],
            convertFeeAssignmentObj.netAmount = feeAssignment['net_amount'],
            convertFeeAssignmentObj.dueDate = feeAssignment['due_date']
    }
    catch (err) {
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertFeeAssignmentObj;
}

exports.feeAssignmentDetailsObjs = function(req, res, data) {
    convertFeeAssignmentDetailsObjs = [];
    try {
        data.forEach(function (feeAssignmentDetail) {
            var convertFeeAssignmentDetailsObj = Object.assign({}, feeAssignmentDetailsDomain);
                convertFeeAssignmentDetailsObj.feeAssignmentDetailId = feeAssignmentDetail['fee_assignment_detail_id'],
                convertFeeAssignmentDetailsObj.createdDate = feeAssignmentDetail['created_date'],
                convertFeeAssignmentDetailsObj.tenantId = feeAssignmentDetail['tenant_id'],
                convertFeeAssignmentDetailsObj.schoolId = feeAssignmentDetail['school_id'],
                convertFeeAssignmentDetailsObj.academicYear = feeAssignmentDetail['academic_year'],
                convertFeeAssignmentDetailsObj.feeAssignmentId = feeAssignmentDetail['fee_assignment_id'],
                convertFeeAssignmentDetailsObj.feeAssignmentName = feeAssignmentDetail['fee_assignment_name'],
                convertFeeAssignmentDetailsObj.username = feeAssignmentDetail['username'],
                convertFeeAssignmentDetailsObj.termId = feeAssignmentDetail['term_id'],
                convertFeeAssignmentDetailsObj.termName = feeAssignmentDetail['term_name'],
                convertFeeAssignmentDetailsObj.classId = feeAssignmentDetail['class_id'],
                convertFeeAssignmentDetailsObj.className = feeAssignmentDetail['class_name'],
                convertFeeAssignmentDetailsObj.sectionId = feeAssignmentDetail['section_id'],
                convertFeeAssignmentDetailsObj.sectionName = feeAssignmentDetail['section_name'],
                convertFeeAssignmentDetailsObj.applicableFeeTypes = feeAssignmentDetail['applicable_fee_types'],
                convertFeeAssignmentDetailsObj.feeTypesAmount = feeAssignmentDetail['fee_types_amount'],
                convertFeeAssignmentDetailsObj.refundablePercentage = feeAssignmentDetail['refundable_percentage'],
                convertFeeAssignmentDetailsObj.netAmount = feeAssignmentDetail['net_amount'],
                convertFeeAssignmentDetailsObj.dueDate = feeAssignmentDetail['due_date'],
                convertFeeAssignmentDetailsObj.scholarshipId = feeAssignmentDetail['scholarship_id'],
                convertFeeAssignmentDetailsObj.scholarshipName = feeAssignmentDetail['scholarship_name'],
                convertFeeAssignmentDetailsObj.scholarshipAmount = feeAssignmentDetail['scholarship_amount'],
                convertFeeAssignmentDetailsObj.feeDiscountName = feeAssignmentDetail['fee_discount_name'],
                convertFeeAssignmentDetailsObj.feeDiscountAmount = feeAssignmentDetail['fee_discount_amount'],
                convertFeeAssignmentDetailsObj.status = feeAssignmentDetail['status'],
                convertFeeAssignmentDetailsObj.paidDate = feeAssignmentDetail['paid_date']
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
            convertFeeAssignmentDetailsObj.feeAssignmentDetailId = feeAssignmentDetail['fee_assignment_detail_id'],
            convertFeeAssignmentDetailsObj.createdDate = feeAssignmentDetail['created_date'],
            convertFeeAssignmentDetailsObj.tenantId = feeAssignmentDetail['tenant_id'],
            convertFeeAssignmentDetailsObj.schoolId = feeAssignmentDetail['school_id'],
            convertFeeAssignmentDetailsObj.academicYear = feeAssignmentDetail['academic_year'],
            convertFeeAssignmentDetailsObj.feeAssignmentId = feeAssignmentDetail['fee_assignment_id'],
            convertFeeAssignmentDetailsObj.feeAssignmentName = feeAssignmentDetail['fee_assignment_name'],
            convertFeeAssignmentDetailsObj.username = feeAssignmentDetail['username'],
            convertFeeAssignmentDetailsObj.termId = feeAssignmentDetail['term_id'],
            convertFeeAssignmentDetailsObj.termName = feeAssignmentDetail['term_name'],
            convertFeeAssignmentDetailsObj.classId = feeAssignmentDetail['class_id'],
            convertFeeAssignmentDetailsObj.className = feeAssignmentDetail['class_name'],
            convertFeeAssignmentDetailsObj.sectionId = feeAssignmentDetail['section_id'],
            convertFeeAssignmentDetailsObj.sectionName = feeAssignmentDetail['section_name'],
            convertFeeAssignmentDetailsObj.applicableFeeTypes = feeAssignmentDetail['applicable_fee_types'],
            convertFeeAssignmentDetailsObj.feeTypesAmount = feeAssignmentDetail['fee_types_amount'],
            convertFeeAssignmentDetailsObj.refundablePercentage = feeAssignmentDetail['refundable_percentage'],
            convertFeeAssignmentDetailsObj.netAmount = feeAssignmentDetail['net_amount'],
            convertFeeAssignmentDetailsObj.dueDate = feeAssignmentDetail['due_date'],
            convertFeeAssignmentDetailsObj.scholarshipId = feeAssignmentDetail['scholarship_id'],
            convertFeeAssignmentDetailsObj.scholarshipName = feeAssignmentDetail['scholarship_name'],
            convertFeeAssignmentDetailsObj.scholarshipAmount = feeAssignmentDetail['scholarship_amount'],
            convertFeeAssignmentDetailsObj.feeDiscountName = feeAssignmentDetail['fee_discount_name'],
            convertFeeAssignmentDetailsObj.feeDiscountAmount = feeAssignmentDetail['fee_discount_amount'],
            convertFeeAssignmentDetailsObj.status = feeAssignmentDetail['status'],
            convertFeeAssignmentDetailsObj.paidDate = feeAssignmentDetail['paid_date']
    }
    catch (err) {
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return convertFeeAssignmentDetailsObj;
}