/**
 * Created by senthilPeriyasamy on 12/23/2016.
 */
var express = require('express')
    , router = express.Router()
    , authenticate = require('../../services/authentication/authentication.service')

router.post('/', authenticate.authenticate);
router.post('/app', authenticate.authenticateApp);
router.post('/app/student', authenticate.authenticateIOSStudent);
router.post('/app/parent', authenticate.authenticateAppParent);
router.post('/app/authorize', authenticate.authorizedUser);
router.get('/validatesession', authenticate.validateSession);
router.post('/invalidate', authenticate.invalidateSession);
router.put('/changepwd', authenticate.changePwd);
router.put('/parent/changepwd', authenticate.changeParentPwd);
router.post('/reset', authenticate.resetPassword);
router.post('/parent/reset', authenticate.resetParentPassword);
router.post('/sendotp', authenticate.sendOTP);
router.post('/parent/sendotp', authenticate.sendParentOTP);
router.get('/credentials', authenticate.getSchoolCredentials);
router.get('/credentials/:id', authenticate.getUserCredentials);
router.delete('/', authenticate.logout);
router.delete('/parent', authenticate.parentLogout);

module.exports = router