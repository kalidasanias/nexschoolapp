
/**
 * Created by Kiran on 6/13/2017.
 */


var express = require('express'),
    router = express.Router(),
    roles = require('../../services/roles/roles.service');

router.get('/', roles.getSchoolRoleTypes);
router.get('/:id', roles.getSchoolRoleTypesById);
router.get('/types/permissions/:name', roles.getRolePermissionByName);
router.get('/permissions/all/', roles.getAllPermissions);
router.get('/permissions', roles.getAllRolePermissions);
router.get('/permissions/:id', roles.getRolePermission);
router.put('/permissions/:id', roles.updatePermissionsByRole);
router.delete('/permissions/:id', roles.deletePermissionsByRole);
router.post('/permissions', roles.savePermissionsByRole);
router.put('/user', roles.updateRoleToUsers);
router.put('/user/:id', roles.updateRoleToUser);
router.get('/user/:id', roles.getUsersByRoleId);


module.exports = router;