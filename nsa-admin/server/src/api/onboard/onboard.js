/**
 * Created by anjan on 8/18/2017.
 */
var express = require('express')
    , router = express.Router()
    , onboard = require('../../services/sms/onboard/onboard.service');

router.get('/:id', onboard.getAllOnboardMessage);
router.post('/', onboard.saveOnboard);
/*router.put('/:id', onboard.updateOnboard);*/

module.exports = router;