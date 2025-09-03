/**
 * Created by senthil on 3/28/2017.
 */


var express = require('express')
    , router = express.Router()
    , feeTransaction = require('../../services/transaction/feeTransaction.service');

router.get('/:id', feeTransaction.getFeeTransactionDetails);

module.exports = router;
