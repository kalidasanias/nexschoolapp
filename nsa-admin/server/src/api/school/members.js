/**
 * Created by senthil on 22/09/17.
 */
var express = require('express')
    , router = express.Router()
    , members = require('../../services/school/members.service.js');

router.get('/', members.createSchoolMembers);
router.get('/onboard', members.createOnboardSchoolMembers);
router.get('/es/parent/onboard', members.createOnboardEsSchoolMembers); // new school onboard time we just hit this call school_members will push into elasticsearch
router.get('/update/tenantId', members.updateTanentIdInMembers);// school_members table adding tenant_id for all schools
router.get('/allParents', members.getAllParents);
router.get('/update/parentName/', members.getAllParentChilds);// school_members_xref table adding father_name for all schools
router.get('/es/parent/', members.updateParentDetailsInEs);
router.post('/changeNumber', members.changeParentNumber);
router.post('/addWard', members.addWardToParent);
router.put('/findNumber/', members.findNumberInParentLogins);
router.get('/insertLogins/', members.insertLogins);
router.post('/es/users', members.getUsersByUsernames);

module.exports = router;