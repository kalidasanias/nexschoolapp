/**
 * Created by senthil on 3/24/2017.
 */
var express = require('express')
    , router = express.Router()
    , ccavenue = require('../../../services/payment/ccavenue/ccavenue.service')

router.post('/', ccavenue.feeRequestHandler);
router.post('/return', ccavenue.responseHandler);
router.post('/cancel', ccavenue.cancelHandler);

module.exports = router;