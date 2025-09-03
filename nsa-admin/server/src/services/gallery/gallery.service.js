/**
 * Created by Deepa on 6/21/2017.
 */
var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    logger = require('../../common/logging'),
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    _ = require('lodash'),
    s3 = require('@nsa/nsa-asset').s3,
    vimeo = require('@nsa/nsa-asset').nsaVimeo,
    baseService = require('../common/base.service')
    BaseError = require('@nsa/nsa-commons').BaseError;

exports.getCategories = function(req, res) {
    events.emit('JsonResponse', req, res, [{name: 'Sports Meet', value: 'Sports_Meet'}, {name: 'Annual Day', value: 'Annual_Day'}, {name: 'Hollidays', value: 'hollidays'}]);
};

exports.getAlbums = function(req, res) {
    nsaCassandra.Gallery.getAlbums(req, function(err, result) {
        if (err) {
            logger.debugLog(req, 'Get Albums list ', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa16003));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getAlbumDetails = function(req, res) {
    async.parallel({
            albums : nsaCassandra.Gallery.getAlbums.bind(null, req),
            albumDetails : getAllAlbumContentDetails.bind(null, req)
        }, function (err, data) {
            if(err) {
                logger.debugLog(req, 'Get Album Details ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
            } else {
                buildAlbumDetailResponse(data, function (err, result) {
                    if(err) {
                        logger.debugLog(req, 'Get Album Details Response ', err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
                    } else {
                        events.emit('JsonResponse', req, res, result);
                    }
                });
            }
        }
    );
};

function buildAlbumDetailResponse(data, callback) {
    try {
        var albums = data.albums;
        var albumDetails = data.albumDetails;
        var details = [];
        details = _.groupBy(albumDetails, 'album_id');
        if(!_.isEmpty(albums)) {
            _.forEach(albums, function (value, key) {
                 _.forEach(details, function (detailsValue, detailsKey) {
                     if(value.album_id.toString() == detailsKey.toString()) {
                         value['albumDetails'] = detailsValue;
                     }
                 })
            })
        }
        callback(null, albums);
    } catch (err) {
        callback(err, null);
    }
};
exports.buildAlbumDetailResponse = buildAlbumDetailResponse;

function getAllAlbumContentDetails(req, callback) {
    nsaCassandra.Gallery.getAllAlbumContentDetails(req, function(err, result) {
        callback(err, result)
    })
}
exports.getAllAlbumContentDetails = getAllAlbumContentDetails;

function getAlbumContentDetails(req, callback) {
    nsaCassandra.Gallery.getAlbumContentDetails(req, function(err, result) {
        callback(err, req, result)
    })
}
exports.getAlbumContentDetails = getAlbumContentDetails;

function getAlbumUserViewDetails(req, data, callback) {
    nsaCassandra.Gallery.getAlbumUserViewDetails(req, function(err, result) {
        data['albumUserViewDetails'] = result;
        callback(err, req, data)
    });
};
exports.getAlbumUserViewDetails = getAlbumUserViewDetails;

function updateAlbumUserViewDetails(req, data, callback) {
    if(_.isEmpty(data.albumUserViewDetails)) {
        nsaCassandra.Base.gallerybase.updateAlbumUserViewDetails(req, data, function(err, result) {
            callback(err, req)
        });
    } else {
        callback(null, req)
    }
};
exports.updateAlbumUserViewDetails = updateAlbumUserViewDetails;

function getAlbumDetail(req, callback) {
    var data = {};
    nsaCassandra.Gallery.getAlbumDetails(req, function(err, result) {
        data['albumDetails'] = result;
        callback(err, req, data)
    })
};
exports.getAlbumDetail = getAlbumDetail;

exports.getAlbumContent= function(req, res) {
    nsaCassandra.Gallery.getAlbumContentDetails(req, function(err, result) {
        if (err) {
            logger.debugLog(req, 'Get Albums Content ', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa16003));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.deleteAlbumDetails = function(req, res) {
    async.waterfall(
        [
            getAlbumContentDetails.bind(null, req),
            deleteAlbum.bind(),
            deleteAlbumContentDetails.bind(),
            executeBatch.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debugLog(req, 'Delete Gallery', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18202));
            } else {
                events.emit('JsonResponse', req, res, {message: message.nsa18201});
            }
        }
    );
};

exports.deleteAlbumDetailsByIds = function(req, res) {
    async.waterfall(
        [
            deleteAlbumContentDetailsByIds.bind(null, req),
            executeBatch.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debugLog(req, 'Delete Album Details', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18202));
            } else {
                deleteObjSrc(req, function (err, data) {
                    events.emit('JsonResponse', req, res, {message: message.nsa18203});
                })

            }
        }
    );
};

function deleteObjSrc(req, callback) {
    async.parallel({
        s3: deleteS3Src.bind(null, req),
        vimeo: deleteVimeoSrc.bind(null, req),
    }, function(err, result) {
        callback(err, result);
    });
}
exports.deleteObjSrc = deleteObjSrc;

function deleteS3Src(req, callback) {
    var ids = req.body.seletedImageIds;
    var objs = baseService.constructS3DeleteObjs(ids)
    s3.deleteObject(req, objs, function (err, data) {
        callback(err, data)
    })
}
exports.deleteS3Src = deleteS3Src;

function deleteVimeoSrc(req, callback) {
    var ids = req.body.seletedVideoIds
    async.times(ids.length, function(i, next) {
        var id = ids[i];
        vimeo.deleteVideo(req, id, function (err, data) {
            next(err, data);
        })
    }, function(err, objs) {
        callback(err, objs)
    });
}
exports.deleteVimeoSrc = deleteVimeoSrc;

function deleteAlbum(req, result, callback) {
    var data = {contentDetails: result}
    nsaCassandra.Base.gallerybase.deleteAlbumObj(req, function (err, result) {
        data.batchObj = result.batchObj
        callback(err, req, data);
    })
}
exports.deleteAlbum = deleteAlbum;

function deleteAlbumContentDetails(req, data, callback) {
    nsaCassandra.Base.gallerybase.deleteAlbumContentDetailsObjs(req, data, function (err, result) {
        callback(err, req, result);
    })
}
exports.deleteAlbumContentDetails = deleteAlbumContentDetails;

function deleteAlbumContentDetailsByIds(req, callback) {
    nsaCassandra.Base.gallerybase.deleteAlbumContentDetailsByIds(req, function (err, result) {
        callback(err, req, result);
    })
}
exports.deleteAlbumContentDetailsByIds = deleteAlbumContentDetailsByIds;


exports.saveAlbums = function(req, res) {
    async.waterfall(
        [
            createAlbum.bind(null, req),
            executeBatch.bind(),
        ],
        function (err,  data) {
            if(err) {
                logger.debugLog(req, 'Save Albums', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa16002));
            } else {
                data['message'] = message.nsa16001;
                events.emit('JsonResponse', req, res, data);
            }
        }
    );
};

exports.updateAlbums = function(req, res) {
    async.waterfall(
        [
            updateAlbum.bind(null, req),
            executeBatch.bind(),
        ],
        function (err,  data) {
            if(err) {
                logger.debugLog(req, 'Update Albums', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa16005));
            } else {
                data['message'] = message.nsa16004;
                events.emit('JsonResponse', req, res, data);
            }
        }
    );
};

function createAlbum(req, callback) {
    nsaCassandra.Base.gallerybase.createAlbumObj(req, function(err, data) {
        callback(err, req, data);
    })
}
exports.createAlbum = createAlbum;

function updateAlbum(req, callback) {
    nsaCassandra.Base.gallerybase.updateAlbumObj(req, function(err, data) {
        callback(err, req, data);
    })
}
exports.updateAlbum = updateAlbum;

exports.saveAlbumsContentDetails = function(req, res) {
    async.waterfall(
        [
            createAlbumContentDetails.bind(null, req),
            updateAlbumDate.bind(),
            executeBatch.bind(),
        ],
        function (err,  data) {
            if(err) {
                logger.debugLog(req, 'Save Album Content Details', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa16002));
            } else {
                data['message'] = message.nsa16001;
                events.emit('JsonResponse', req, res, data);
            }
        }
    );
};

function createAlbumContentDetails(req, callback) {
    nsaCassandra.Base.gallerybase.createAlbumContentDetailsObj(req, function(err, data) {
        callback(err, req, data);
    })
}
exports.createAlbumContentDetails = createAlbumContentDetails;

function updateAlbumDate(req, data, callback) {
    nsaCassandra.Base.gallerybase.updateAlbumDate(req, data, function(err, result) {
        callback(err, req, result);
    })
}
exports.updateAlbumDate = updateAlbumDate;

function createAlbumLatestContent(req, callback) {

}
exports.createAlbumLatestContent = createAlbumLatestContent;

function createAlbumContentByTag(req, callback) {

}
exports.createAlbumContentByTag = createAlbumContentByTag;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, data);
    })
};
exports.executeBatch = executeBatch;

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.GALLERY_DETAILS, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;


function throwGalleryErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.GALLERY_DETAILS, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwGalleryErr = throwGalleryErr;