/**
 * Created by senthil on 29/06/17.
 */

var express = require('express')
    , constants = require('../../common/constants/constants')
    , models = require('../../models/index')
    , baseService = require('./base.service')
    , dateService = require('../../utils/date.service.js')
    , message = require('@nsa/nsa-commons').messages
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , constant = require('@nsa/nsa-commons').constants
    , templateConverter = require('../../converters/template.converter')
    , async = require('async')
    , s3 = require('@nsa/nsa-asset').s3
    , logger = require('../../../config/logger');


exports.createAlbumObj = function(req, callback) {
    var data = {};
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var currentDate = new Date();
    var id = models.uuid();
    try {
        var albumObj = new models.instance.Album  ({
            album_id: id,
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year: headers.academic_year,
            preview_thumbnails: null,
            created_by: headers.user_name,
            updated_by: headers.user_name,
            updated_date: currentDate,
            created_date: currentDate,
            name: req.body.albumName,
            description: req.body.description,
            no_of_files_contains: req.body.numberOfFiles,
            category: baseService.getNamesFromArray(req.body.category, "name"),
            category_objs: JSON.stringify(req.body.category)
        });
        var obj = albumObj.save({return_query: true});
        var array = [obj];
        data['id'] = id;
        data.batchObj = array;

    } catch (err) {
        logger.debug(err)
        callback(err, data)
    }
    callback(null, data)
};

exports.updateAlbumUserViewDetails = function(req, data, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var album_id = models.uuidFromString(req.params.id);
    var albumDetails = data.albumDetails;
    var viewedCount = albumDetails.viewed_count;
    var newViewedCount = viewedCount != null ? viewedCount+1 : 1;

    var queryObject = {
        album_id: album_id,
        tenant_id: tenantId,
        school_id:  schoolId,
        academic_year: headers.academic_year
    };

    var updateValues = { viewed_by: {'$add': [headers.user_id]},
        viewed_count: newViewedCount
    };

    models.instance.Album.update(queryObject, updateValues, function (err, result) {
        callback(err, result)
    });
};

exports.updateAlbumObj = function(req, callback) {
    var data = {};
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var album_id = models.uuidFromString(req.params.id);
    var updatedDate = new Date();
    try {

        var queryObject = {
            album_id: album_id,
            tenant_id: tenantId,
            school_id:  schoolId,
            academic_year: headers.academic_year
        };

        var updateValues = {
            created_by: headers.user_name,
            updated_by: headers.user_name,
            updated_date: updatedDate,
            name: req.body.albumName,
            description: req.body.description,
            category: baseService.getNamesFromArray(req.body.category, "name"),
            category_objs: JSON.stringify(req.body.category)
        }

        var updateQueries = models.instance.Album.update(queryObject, updateValues, {return_query: true});
        data.batchObj = [updateQueries];
    } catch (err) {
        logger.debug(err)
        callback(err, data)
    }
    callback(null, data)
};

exports.createAlbumContentDetailsObj = function(req, callback) {

    var data = {};
    var headers = baseService.getHeaders(req);
    var currentDate = new Date();
    var body = req.body;

    try {
        var attachments = body.attachments
        var createAlbumObj = function(object, callback) {
            var bucket = object.bucket
            var key = object.key
            s3.getImageDimensions(bucket, key, function (err, result) {
                var metadata = {}
                if(err) {
                    metadata = null
                } else {
                    metadata = {height: result.height, width: result.width, size: object.size}
                }
                var mimetype = object.mimetype
                var type = null
                if(mimetype) {
                    type = mimetype.split('/')[0]
                }
                var albumObj = new models.instance.AlbumContentDetails  ({
                    content_id: models.uuid(),
                    tenant_id: models.timeuuidFromString(headers.tenant_id),
                    school_id: models.uuidFromString(headers.school_id),
                    academic_year: headers.academic_year,
                    album_id: models.uuidFromString(body.id),
                    created_by: headers.user_name,
                    created_date: currentDate,
                    mimetype: mimetype,
                    file_type: type,
                    file_url: object.id,
                    file_name: object.originalname,
                    shared_to: null,
                    metadata: metadata,
                });

                var obj = albumObj.save({return_query: true});
                callback(null, obj);
            })
        };

        async.times(attachments.length, function(i, next) {
            var obj = attachments[i];
            createAlbumObj(obj, function(err, data) {
                next(err, data);
            });
        }, function(err, albumObjs) {
            data.batchObj = albumObjs
            callback(err, data)
        });

    } catch (err) {
        logger.debug(err)
        callback(err, data)
    }

};

exports.updateAlbumDate = function(req, data, callback) {
    var body = req.body;
    var batchObj = data.batchObj || []
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var album_id = models.uuidFromString(body.id);
    var updatedDate = new Date();
    try {

        var queryObject = {
            album_id: album_id,
            tenant_id: tenantId,
            school_id:  schoolId,
            academic_year: headers.academic_year
        };

        var updateValues = {
            updated_by: headers.user_name,
            updated_date: updatedDate,
        }

        var updateQueries = models.instance.Album.update(queryObject, updateValues, {return_query: true});
        batchObj.push(updateQueries);
        data.batchObj = batchObj;
    } catch (err) {
        logger.debug(err)
        callback(err, data)
    }
    callback(null, data)

};

exports.deleteAlbumObj = function (req, callback) {
    var data = [];
    try {
        var headers = baseService.getHeaders(req);
        var albumId = models.uuidFromString(req.params.id);
        var albumDeleteQuery = {
            album_id: albumId,
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id:  models.uuidFromString(headers.school_id),
            academic_year: headers.academic_year
        };
        var deleteQueries = models.instance.Album.delete(albumDeleteQuery , {return_query: true});
        data.batchObj = [deleteQueries];
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

exports.deleteAlbumContentDetailsObjs = function (req, data, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var albumId = models.uuidFromString(req.params.id);
        var array = data.batchObj || [];
        _.forEach(data.contentDetails, function (value, key) {
            var albumContentDeleteQuery = {
                content_id: value.content_id,
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id:  models.uuidFromString(headers.school_id),
                academic_year: headers.academic_year
            };
            var deleteQueries = models.instance.AlbumContentDetails.delete(albumContentDeleteQuery , {return_query: true});
            array.push(deleteQueries);
        })

        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

exports.deleteAlbumContentDetailsByIds = function (req, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var array = [];
        var data = {}
        var ids = req.body.selectedIds
        _.forEach(ids, function (value, key) {
            var albumContentDeleteQuery = {
                content_id: models.uuidFromString(value),
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id:  models.uuidFromString(headers.school_id),
                academic_year: headers.academic_year
            };
            var deleteQueries = models.instance.AlbumContentDetails.delete(albumContentDeleteQuery , {return_query: true});
            array.push(deleteQueries);
        })
        data.batchObj = array
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};