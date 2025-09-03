/**
 * Created by karthik on 05-01-2017.
 */

var express = require('express')
    , constants = require('../../common/constants/constants')
    , models = require('../../models')
    , baseService = require('../common/base.service')
    , userConverter = require('../../converters/user.converter');

const cassandra = require('cassandra-driver');

exports.getAllUsers = function(req, res) {
    var headers = baseService.getHeaders(req);
    var userId = req.params.id;
    //baseService.validateHeaders(req, res);

    /*models.instance.UserDetails.find({tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)},{allow_filtering: true}, function(err, result){
        if(result) {
            res.status(constants.HTTP_OK).send({
                status: baseService.getSuccessStatus(req, res, "Successfully Fetched"),
                requestParam : baseService.getRequestParam(),
                users: userConverter.convertUsers(req, res, result)});
        } else {
            res.status(constants.HTTP_NO_CONTENT).send({success: false, data: err});
        }
    });*/

    /*models.instance.UserDetails.eachRow({tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)},{allow_filtering: true, fetchSize : 2}, function(n, row){
        // invoked per each row in all the pages
        console.info('row = ', row);
    }, function(err, result){
        // ...
        console.info('result = ', result);
        res.send(result);
    });*/

    var users = [];
    var requestParam = baseService.getRequestParam();

    if (req.query.pageSize) {
        requestParam.pageSize = parseInt(req.query.pageSize);
    }

    var pageState;

    if (req.query.pageNo) {
        requestParam.pageNo = parseInt(req.query.pageNo);
    }

    models.instance.UserDetails.eachRow({tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)}, {allow_filtering: true, autoPage : true,
        fetchSize : requestParam.pageSize, pageState: pageState}, function(n, row){
        // invoked per each row in all the pages
        //console.info('********* row = ', row);
        users[n]= row
    }, function(err, result){
        // ...
        if(result) {
            /*var query = "Select count(*) from user_details where tenant_id=? and school_id=?";
            var params = [models.timeuuidFromString(headers.tenant_id), models.uuidFromString(headers.school_id)];
            models.instance.UserDetails.execute_query(query, params, function(err, people){
                //people is an array of plain objects
                console.info('err = ', err);
                console.info('people = ', people);
            });*/
            if (result.nextPage) {
                // retrieve the following pages
                // the same row handler from above will be used
                result.nextPage();
            }
            pageState = requestParam.pageNo;
            var totalRecords = parseInt(result.rowLength);
            requestParam.totalRecords = parseInt(totalRecords);

            res.status(constants.HTTP_OK).send({
                status: baseService.getSuccessStatus(req, res, "Successfully Fetched"),
                requestParam : requestParam,
                users: userConverter.convertUsers(req, res, users)});
            /*console.info('pageState = ', result.rowLength);
            const query = 'SELECT count(*) FROM user_details WHERE tenant_id = ? and school_id = ? ALLOW FILTERING';
            client.execute(query, [ models.timeuuidFromString(headers.tenant_id), models.uuidFromString(headers.school_id) ], function(err, resultCount) {
                console.log('err = ', err);
                console.log('resultCount = ', resultCount.rows[0].count);

                requestParam.totalRecords = parseInt(resultCount.rows[0].count);
                console.info('req.query.pageSize = ', req.query.pageSize);
                res.status(constants.HTTP_OK).send({
                    status: baseService.getSuccessStatus(req, res, "Successfully Fetched"),
                    requestParam : requestParam,
                    users: userConverter.convertUsers(req, res, users)});
            });*/

            /*models.instance.UserDetails.find({tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id: models.uuidFromString(headers.school_id)}, {allow_filtering: true}, function(err, people){
                //people is an array of plain objects with only name and age
                console.info('Length = ', people.length);
                //console.info('people = ', people);
                res.status(constants.HTTP_OK).send({
                    status: baseService.getSuccessStatus(req, res, "Successfully Fetched"),
                    requestParam : baseService.getRequestParam(),
                    users: people});
            });*/
            /*console.info('Tenant id = ', models.timeuuidFromString(headers.tenant_id));
            console.info('School id = ', models.uuidFromString(headers.school_id));
            var query = "Select count(*) from user_details where tenant_id=? and school_id=?";
            var params = [models.timeuuidFromString(headers.tenant_id), models.uuidFromString(headers.school_id)];
            models.instance.Person.execute_query(query, params, function(err, people){
                //people is an array of plain objects
                console.info('count = ', people);
            });*/

            /*var query = "Select count(*) from user_details where tenant_id=? and school_id=?";
            var params = [models.timeuuidFromString(headers.tenant_id), models.uuidFromString(headers.school_id)];
            models.instance.UserDetails.find(query, function(err, people){
                console.info('count = ', people);
            });*/

            //var query = 'Select count(*) from user_details where tenant_id=\'a094e470-d175-11e6-a2c8-c95cdbee5e46\' and school_id=\'2f49ed4e-93ab-414c-946b-0478db98470f\'';
            /*models.instance.UserDetails.stream({tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id: models.uuidFromString(headers.school_id)}, {allow_filtering: true, raw: true, autoPage: true, fetchSize : 2}, function(reader){
                var row;
                while (row = reader.readRow()) {
                    //process row
                    console.info('row = ', row);
                }
            }, function(err){
                //emitted when all rows have been retrieved and read
                console.info('err = ', err);
            });*/


        } else {
            console.info('err = ', err);
            res.status(constants.HTTP_NO_CONTENT).send({success: false, data: err});
        }
    });
};
