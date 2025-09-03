/**
 * Created by senthil on 16/01/17.
 */

var status = require('../domains/Status')
    , constants = require('../constants/constants')
    , _ = require('lodash');

exports.initValidation = function(req, res, next) {
    var isHeaderParamAvailable = false;
    console.info('req.headers.tenant_id = ', req.headers.tenant_id);
    console.info('req.headers.school_id = ', req.headers.school_id);
    console.info('req.originalUrl = ',  req.originalUrl);
    console.info(_.endsWith(req.originalUrl, 'auth'));

    if (!_.endsWith(req.originalUrl, 'auth')) {
        if (req.headers.tenant_id == undefined || req.headers.school_id == undefined || req.headers.academic_year == undefined) {
            status.code = constants.HTTP_UNAUTHORIZED;
            status.message = "Header Parameters are not provided";
            res.send({status: status});
        } else {
            console.info('Accessing the Filter section ...');
            next(); // pass control to the next handler
        }
    }
};