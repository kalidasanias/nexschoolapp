/**
 * Created by senthil on 3/24/2017.
 */
var nsaCassandra = require('@nsa/nsa-cassandra')
    , ccutils = require('./ccutils')
    , _ = require('lodash')
    , randomstring = require("randomstring")
    , async = require('async')
    , events = require('@nsa/nsa-commons').events
    , logger = require('../../../../config/logger');

function ccAvenueRequestHandler(req, ccavenueReqObj, callback) {
    async.waterfall(
        [
            getCCAvenueConfigObj.bind(null, req, ccavenueReqObj),
            getMerchantDetails.bind(),
            encryptReq.bind(),
        ],
        function (err, result) {
            callback(err, result)
        }
    );
};
exports.ccAvenueRequestHandler = ccAvenueRequestHandler;

exports.feeRequestHandler = function (req, res) {
    req.params['id'] = req.body.feeId;
    async.parallel(
        {
            feeDetails: nsaCassandra.Fee.getFeeAssignmentDetail.bind(null, req),
            userDetails: nsaCassandra.User.getUserContactDetails.bind(null, req)
        },
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, err);
            } else {
                async.waterfall(
                    [
                        buildCCAvenueObj.bind(null, req, result),
                        ccAvenueRequestHandler.bind(),
                    ],
                    function (err, data) {
                        events.emit('JsonResponse', req, res, data);
                    }
                );
            }

        }
    );
};

exports.responseHandler = function (req, res) {
    async.waterfall(
        [
            getCCAvenueConfigObj.bind(null, req, {}),
            decryptReq.bind(),
            handleResponse.bind(),
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, err);
            } else {
                var host = req.headers.host.split(":")[0];
                host = (_.isEqual(host, 'app.nexschoolapp.com') ? 'nexschoolapp.com' : host)
                if (_.isEqual(result.txnStatus, 'Success')) {
                    var redirectUrl = host + '/#/success?id=' + result.feeId;
                    // var redirectUrl = host[0] + ':3002' + '/#/success?id=' + result.feeId;
                    res.redirect('http://' + redirectUrl);
                } else {
                    var redirectUrl = host + '/#/failure?errMsg=' + result.status_message;
                    // var redirectUrl = host[0] + ':3002' + '/#/failure?errMsg=' + result.statusMsg;
                    res.redirect('http://' + redirectUrl);
                }
            }
        }
    );
};

exports.cancelHandler = function (req, res) {
    var host = req.headers.host.split(":")[0];
    host = (_.isEqual(host, 'app.nexschoolapp.com') ? 'nexschoolapp.com' : host)
    var redirectUrl = host + '/#/home/failure';
    /*var redirectUrl = host[0] + ':3002' + '/#/home/failure';*/
    res.redirect('http://' + redirectUrl);
};

function buildCCAvenueObj(req, result, callback) {
    var feeDetails = result.feeDetails;
    var amount = String(Number(feeDetails.netAmount) - Number(feeDetails.paidAmount))
    var userDetails = result.userDetails;
    var host = req.headers.host;
    var ccAvenueReqObj = {
        "order_id": randomstring.generate(25),
        "currency": "INR",
        "amount": amount,
        "redirect_url": "http://"+ host + "/rest/api/v1/nsa/ccavenue/return",
        "cancel_url": "http://"+ host + "/rest/api/v1/nsa/ccavenue/cancel",
        "language": "EN",
        "billing_name": userDetails.firstName + ' ' + userDetails.lastName,
        "billing_address": userDetails.addressLine1,
        "billing_city": userDetails.city,
        "billing_state": userDetails.state,
        "billing_zip": userDetails.pincode,
        "billing_country": userDetails.country,
        "billing_tel": userDetails.primaryPhone,
        "billing_email": userDetails.emailAddress,
        "integration_type": "iframe_normal",
        "merchant_param1": feeDetails.userName + "/" + feeDetails.feeAssignmentDetailId,
        "merchant_param2": "CCAvenue"
    }
    callback(null, req, ccAvenueReqObj);
};
exports.buildCCAvenueObj = buildCCAvenueObj;

function getCCAvenueConfigObj(req, ccavenueReqObj, callback) {
    var host = req.headers.host.split(':');
    var configObj = global.config.payment.gateway.ccavenue[host[0]];
    configObj['ccavenueReqObj'] = ccavenueReqObj
    callback(null, req, configObj);
};
exports.getCCAvenueConfigObj = getCCAvenueConfigObj;

function getMerchantDetails(req, ccavenueObj, callback) {
    nsaCassandra.School.getSchoolDetails(req, function(err, response) {
        ccavenueObj['sub_account_id'] = response['sub_merchant_id'];
        ccavenueObj['merchant_id'] = response['merchant_id'];
        ccavenueObj['school_id'] = response['school_id'];
        ccavenueObj['tenant_id'] = response['tenant_id'];
        callback(err, req, ccavenueObj);
    })
};
exports.getMerchantDetails = getMerchantDetails;

function encryptReq(req, ccavenueObj, callback) {
    var headers = nsaCassandra.BaseService.getHeaders(req);
    var obj = ccavenueObj.ccavenueReqObj;
    var merchant_id = ccavenueObj.merchant_id
    var sub_account_id = ccavenueObj.sub_account_id
    obj['merchant_param3'] = merchant_id + '/' + ccavenueObj.tenant_id + '/' + ccavenueObj.school_id + '/' + headers.academic_year
    var body = 'merchant_id=' + merchant_id + '&sub_account_id='+ sub_account_id + '&',
        workingKey = ccavenueObj.workingKey;
    _.forEach(obj, function (value, key) {
        body += key + '=' + value + '&'
    })
    encRequest = ccutils.encrypt(body, workingKey);
    var url = ccavenueObj.url + '&merchant_id=' + merchant_id + '&encRequest=' + encRequest + '&access_code=' + ccavenueObj.accessCode
    console.log(ccavenueObj)
    var response = {hash: url, encRequest: encRequest, ccavenueObj: ccavenueObj}
    callback(null, response);
};
exports.encryptReq = encryptReq;

function decryptReq(req, ccavenueObj, callback) {
    var workingKey = ccavenueObj.workingKey;
    var ccavResponse = ccutils.decrypt(req.body.encResp, workingKey);
    ccavResponse = ccavResponse.split('&');
    var response = {};
    _.forEach(ccavResponse, function (value, key) {
        var arr = value.split('=');
        response[arr[0]] = arr[1];
    })
    callback(null, req, response);
};
exports.decryptReq = decryptReq;

function handleResponse(req, ccavenueResponse, callback) {
    async.waterfall([
            nsaCassandra.FeeTransactionObjConverter.feeTransactionObj.bind(null, req, ccavenueResponse),
            nsaCassandra.FeeTransaction.saveFeeTransactionDetails.bind(),
            updateFeeDetailsStatus.bind()
        ],
        function (err, result) {
            callback(err, result);
        }
    );
};

function updateFeeDetailsStatus(req, data, callback) {
    nsaCassandra.Base.feebase.updatePaymentGatewayFeeDetailStatus(req, data, function(err, result) {
        callback(err, data);
    })
};
exports.updateFeeDetailsStatus = updateFeeDetailsStatus;

exports.handleResponse = handleResponse;
