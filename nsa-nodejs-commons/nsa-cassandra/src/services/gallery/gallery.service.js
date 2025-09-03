/**
 * Created by senthil on 28/06/17.
 */
var express = require('express')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , feeTypeDomain = require('../common/feebase.service')
    , models = require('../../models')
    , feeConverter = require('../../converters/fee.converter')
    , _ = require('lodash')
    , message = require('@nsa/nsa-commons').messages
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , constant = require('@nsa/nsa-commons').constants
    , logger = require('../../../../../../config/logger')
    , galleryConverter = require('../../converters/gallery.converter');

var Gallery = function f(options) {
    var self = this;
};

Gallery.getAlbums = function(req, callback) {
    var params = req.query
    var orderBy = params.orderBy
    var havePermissions = baseService.haveAnyPermissions(req, constant.GALLERY_PERMISSIONS);

    if (havePermissions /*|| userType == constant.STUDENT*/) {
        var findQuery = galleryListFindQuery(req, true, constant.GALLERY_PERMISSIONS);
        models.instance.Album.find(findQuery, {allow_filtering: true}, function(err, result){
            if(result)
            result = _.orderBy(result, ['updated_date'], [orderBy])
            callback(err, galleryConverter.galleryObjs(result));
        });
    } else {
        callback(null, []);
    }

};

Gallery.getAllAlbumContentDetails = function(req, callback) {
    var userType = req.headers.userInfo.user_type;
    var headers = baseService.getHeaders(req);
    var havePermissions = baseService.haveAnyPermissions(req, constant.GALLERY_PERMISSIONS);
    if(havePermissions || userType == constant.STUDENT) {
        var findQuery = baseService.getFindQuery(req);
        findQuery.academic_year = headers.academic_year;
        models.instance.AlbumContentDetails.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, result);
        });
    } else {
        callback(null, []);
    }
};

Gallery.getAlbumDetails = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    findQuery.album_id = models.uuidFromString(req.params.id);
    models.instance.Album.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Gallery.getAlbumUserViewDetails = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    findQuery.album_id = models.uuidFromString(req.params.id);
    findQuery.viewed_by = {'$contains': headers.user_id};
    models.instance.Album.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Gallery.getAlbumContentDetails = function(req, callback) {
    var userType = req.headers.userInfo.user_type;
    var havePermissions = baseService.haveAnyPermissions(req, constant.GALLERY_PERMISSIONS);
    if(havePermissions || userType == constant.STUDENT) {
        var findQuery = galleryDetailsFindQuery(req, true, constant.GALLERY_PERMISSIONS);
        models.instance.AlbumContentDetails.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, result);
        });
    } else {
        callback(null, []);
    }
};

Gallery.saveAlbums = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.GALLERY_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.GALLERY_PERMISSIONS);
        models.instance.SchoolFeeType.find(findQuery, {allow_filtering: true}, function(err, result){
            var formattedResult = baseService.validateResult(result);
            callback(err, feeConverter.feeTypeObjs(req, formattedResult));
        });
    } else {
        callback(null, []);
    }
};

function galleryListFindQuery(req, academicYear, permissions) {
    var params = req.query
    var category = params.category;

    var findQuery = baseService.getFindAllQuery(req, academicYear, permissions);
    if (typeof category != 'undefined' && category != null && !(_.isEmpty(category))) {
        findQuery.category = {'$contains': category};
    }
    return findQuery;
}
exports.galleryListFindQuery = galleryListFindQuery;


function galleryDetailsFindQuery(req, academicYear, permissions) {
    var headers = baseService.getHeaders(req);
    var params = req.query
    var type = params.type;
    var id = req.params.id
    var findQuery = {album_id: models.uuidFromString(id)};
    if (typeof type != 'undefined' && type != null && !(_.isEmpty(type))) {
        findQuery.file_type = type;
    }

    if(academicYear) {
        findQuery.academic_year = headers.academic_year;
    }

    return findQuery;
}
exports.galleryDetailsFindQuery = galleryDetailsFindQuery;


module.exports = Gallery;