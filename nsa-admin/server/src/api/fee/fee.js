/**
 * Created by magesh on 1/13/17.
 */

var express = require('express'),
    router = express.Router(),
    fee = require('../../services/fee/fee.service.js');

router.get('/types', fee.getFeeTypes);
router.get('/type/:typeId', fee.getFeeType);
router.post('/type', fee.saveFeeType);
router.put('/type/:typeId', fee.updateFeeType);
router.delete('/type/:typeId', fee.deleteFeeType);

router.get('/scholarships', fee.getFeeScholarships);
router.get('/scholarships/valid/', fee.getValidFeeScholarships);
router.get('/scholarship/:id', fee.getFeeScholarship);
router.post('/scholarship', fee.saveFeeScholarship);
router.put('/scholarship/:typeId', fee.updateFeeScholarship);
router.delete('/scholarship/:typeId', fee.deleteFeeScholarship);

router.get('/structures', fee.getFeeStructures);
router.get('/structures/active/', fee.getActiveFeeStructures);
router.get('/structure/:id', fee.getFeeStructure);
router.post('/structure', fee.saveFeeStructure);
router.put('/structure/:typeId', fee.updateFeeStructure);
router.delete('/structure/:typeId', fee.deleteFeeStructure);


router.get('/assignments', fee.getFeeAssignments);
router.get('/assignment/:id', fee.getFeeAssignment);
router.post('/assignment', fee.saveFeeAssignment);
router.put('/assignment/:typeId', fee.updateFeeAssignment);
router.delete('/assignment/:typeId', fee.deleteFeeAssignment);

router.get('/assignments/details/', fee.getFeeAssignmentsDetails);
router.get('/assignments/detail/:id', fee.getFeeAssignmentDetail);
router.post('/assignments/detail', fee.saveFeeAssignmentDetail);
router.put('/assignments/detail/:typeId', fee.updateFeeAssignmentDetail);
router.delete('/assignments/detail/:typeId', fee.deleteFeeAssignmentDetail);

router.post('/assign', fee.saveAssignedFee);
router.put('/assign/details', fee.updateScholarshipDetails);
router.put('/assign/:typeId', fee.updateAssignFeeAndDetails);
router.put('/publish/:id', fee.publishAssignedFee);
router.get('/assign/users', fee.getFeeAssignedUsers);
router.get('/users/:id', fee.getDetailsByFeeAssignment);

router.get('/scholarships/users/:id', fee.getScholarshipUsers);
router.get('/details/:classId/:sectionId', fee.getFeeDetailsByClassAndSection);

module.exports = router;