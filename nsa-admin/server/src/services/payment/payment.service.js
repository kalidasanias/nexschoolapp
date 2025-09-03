/**
 * Created by senthil-p on 29/05/17.
 */
var nsaCassandra = require('@nsa/nsa-cassandra')
    , _ = require('lodash')
    , randomstring = require("randomstring")
    , async = require('async')
    , events = require('@nsa/nsa-commons').events
    , logger = require('../../../config/logger');

function payFeeByCash(req, res) {
    async.waterfall(
        [
            nsaCassandra.FeeTransactionObjConverter.feePayByCashTransactionObj.bind(null, req),
            nsaCassandra.FeeTransaction.saveCashFeeTransactionDetails.bind(),
            updateFeeDetailsStatus.bind()
        ],
        function (err, result) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, err);
            } else {
                events.emit('JsonResponse', req, res, {message: 'Successfully Updated'});
            }
        }
    );
};
exports.payFeeByCash = payFeeByCash;

function updateFeeDetailsStatus(req, data, callback) {
    nsaCassandra.Base.feebase.updateFeeDetailStatus(req, data, function(err, result) {
        callback(err, data);
    })
};
exports.updateFeeDetailsStatus = updateFeeDetailsStatus;