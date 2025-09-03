/**
 * Created by karthik on 03-02-2017.
 */
var express = require('express')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , router = express.Router()
    , request = require('request')
    , models = require('../../models');
var async = require('async');
const dataBaseUrl = '../../test/json-data/';

exports.saveTaxanomy = function(req, res, notificationId, cb){
    var taxanomy = req.body.taxanomy;
    var headers = baseService.getHeaders(req);
    var tenant_id = models.timeuuidFromString(headers.tenant_id);
    var school_id = models.uuidFromString(headers.school_id);
    var saved;
    var count = 0;

    taxanomy.forEach(function(item){
       var notifiedCategories = new models.instance.NotifiedCategories({id: models.uuid(), category_id: models.uuidFromString(item.id), category_name: item.name,
           parent_category_id: models.timeuuidFromString(item.parent_id), notification_id: notificationId, tenant_id: tenant_id, school_id: school_id});

        notifiedCategories.save(function(err, result){
           if(result){
                saved = true;
                count++;
           } else {
                saved = false;
                count++;
           }

            if(count == taxanomy.length){
                cb(saved);
            }
        });
    });

};