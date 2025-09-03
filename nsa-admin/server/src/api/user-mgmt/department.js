/**
 * Created by bharatkumarr on 20/03/17.
 */

var express = require('express')
    , router = express.Router()
    , department = require('../../services/user-mgmt/department.service')
    , validate = require('express-validation')
    , validation = require('@nsa/nsa-commons').validation;

router.get('/', department.getAllDepartments);
router.get('/:id', department.getDepartment);
router.post('/', department.saveDepartment);
router.put('/:id', department.updateDepartment);
router.delete('/:id', department.deleteDepartment);

module.exports = router;