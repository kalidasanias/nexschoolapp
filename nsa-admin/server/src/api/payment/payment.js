/**
 * Created by senthil-p on 29/05/17.
 */
var express = require('express')
    , router = express.Router()
    , payment = require('../../services/payment/payment.service')

router.post('/bycash', payment.payFeeByCash);

module.exports = router;