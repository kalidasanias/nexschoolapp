/**
 * Created by magesh on 1/13/17.
 */

var express = require('express')
    , router = express.Router()
    , fee = require('../../services/fee/fee.service.js')

router.get('/types', fee.getFeeTypes);
router.get('/type/:typeId', fee.getFeeType);
router.post('/type', fee.saveFeeType);


router.get('/scholarships', fee.getFeeScholarships);
router.get('/scholarship/:id', fee.getFeeScholarship);
router.post('/scholarship', fee.saveFeeScholarship);

router.get('/structures', fee.getFeeStructures);
router.get('/structure/:id', fee.getFeeStructure);
router.post('/structure', fee.saveFeeStructure);

router.get('/assignments', fee.getFeeAssignments);
router.get('/assignment/:id', fee.getFeeAssignment);
router.post('/assignment', fee.saveFeeAssignment);

router.get('/assignments/details/', fee.getFeeAssignmentsDetails);
router.get('/assignments/detail/:id', fee.getFeeAssignmentDetail);
router.post('/assignments/detail', fee.saveFeeAssignmentDetail);

module.exports = router