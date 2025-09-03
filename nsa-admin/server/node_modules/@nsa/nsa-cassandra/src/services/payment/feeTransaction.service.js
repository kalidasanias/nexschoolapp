/**
 * Created by Kiranmai A on 3/27/2017.
 */

var express = require('express')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , feeTransactionDomain = require('../common/feeTransactionBase.service')
    , models = require('../../models')
    , message = require('@nsa/nsa-commons').messages;

var FeeTransaction = function f(options) {
    var self = this;
};

FeeTransaction.getFeeTransactionDetails = function(req, callback) {
    var id = req.params.id;
    models.instance.FeeTransactionDetails.find({fee_id: models.uuidFromString(id)}, function(err, result){
        var result = feeTransactionDomain.getfeeTransactionDetails(result)
        callback(err, result);
    });
};

FeeTransaction.saveFeeTransactionDetails = function(req, data, callback) {
    var feeTransactionDetails  = feeTransactionDomain.feePaymentGatewayTransactionDetails(data);
    feeTransactionDetails.save(function (err, result) {
        callback(err, req, data);
    });
};

FeeTransaction.saveCashFeeTransactionDetails = function(req, data, callback) {
    var feeTransactionDetails  = feeTransactionDomain.feeTransactionDetails(data);
    feeTransactionDetails.save(function (err, result) {
        callback(err, req, data);
    });
};

module.exports = FeeTransaction;