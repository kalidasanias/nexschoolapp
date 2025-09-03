/**
 * Created by bharatkumarr on 20/03/17.
 */

var express = require('express')
    , router = express.Router()
    , user = require('../../services/user-mgmt/user.service')
    , validate = require('express-validation')
    , validation = require('@nsa/nsa-commons').validation;

router.get('/', user.getAllEmployees);
router.get('/active', user.getActiveEmployees);
router.get('/all', user.getEmployeesWithPermissions);
router.get('/dept/:id', user.getEmployeesByDept);
router.get('/subject/:id', user.getEmployeesBySubject);
router.get('/add/taxonomy', user.addEmployeeInTaxonomy);
router.get('/:id', user.getEmployee);
router.post('/', user.saveEmployee);
router.put('/:id', user.updateEmployee);
router.delete('/:id', user.deleteEmployee);
router.post('/pwdreset', user.passwordReset);

module.exports = router;