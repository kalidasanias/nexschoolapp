/**
 * Created by Kiranmai A on 1/19/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
     _ = require('lodash'),
    logger = require('../../../config/logger');

exports.getClassSecById = function (req, res) {
    nsaCassandra.Section.getClassSecById(req, function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2401));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.getAllClassSections = function (req, res) {
    nsaCassandra.Section.getAllClassSections(req, function (err, result) {
        if (err) {
            logger.debug(err)
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2401));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.saveClassSections = function (req, res) {
    async.waterfall([
        saveClassSection.bind(null, req),
        fetchClassTaxonomy.bind(),
        fetchChildTaxanomy.bind(),
        addChildToTaxonomy.bind(),
        executeBatch.bind()
    ], function (err, result) {
        if (err) {
            logger.debug(err)
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2402));
        } else {
            result['message'] = message.nsa2405;
            events.emit('JsonResponse', req, res, result);
        }
    })

};

exports.updateSecByClassAndSec = function (req, res) {
    nsaCassandra.Section.updateSecByClassAndSec(req, function (err, result) {
        if (err) {
            logger.debug(err)
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2403));
        } else {
            result['message'] = message.nsa2406;
            events.emit('JsonResponse', req, res, result);
        }
    });
}

exports.deleteSecByClass = function (req, res) {
    nsaCassandra.Section.findStudentInSection(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2404));
        }else if(!_.isEmpty(result)){
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        }else {
            async.waterfall([
                deleteClassSection.bind(null, req),
                fetchClassTaxonomy.bind(),
                fetchSingleTaxonomy.bind(),
                deleteSectionTaxonomy.bind(),
                executeBatch.bind()
            ], function (err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2404));
                } else {
                    var resp = { message: message.nsa2407};
                    events.emit('JsonResponse', req, res, resp);
                }
            });
        }
    })
}

/*Section Service*/
exports.getAllSections = function (req, res) {
    nsaCassandra.Section.getAllSections(req, function (err, result) {
        if (err) {
            logger.debug(err)
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2401));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
}

exports.getSection = function (req, res) {
    nsaCassandra.Section.getSection(req, function (err, result) {
        if (err) {
            logger.debug(err)
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2401));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
}

exports.getActiveSections =function(req, res){
    nsaCassandra.Section.getActiveSections(req, function(err, result){
        if(err){
            logger.debug(err)
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2401));
        }else{
            events.emit('JsonResponse',req, res, result);
        }
    })
}

exports.saveSection = function (req, res) {
    async.parallel({
        sectionName : findSectionNameInCassandra.bind(null, req),
        sectionCode: findSectionCodeInCassandra.bind(null, req)
    }, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2402));
        }else if (!_.isEmpty(result.sectionName) || !_.isEmpty(result.sectionCode)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa2409});
        } else {
            nsaCassandra.Section.saveSection(req, function (err, result) {
                if (err) {
                    logger.debug(err)
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2402));
                } else {
                    result['message'] = message.nsa2405;
                    events.emit('JsonResponse', req, res, result);
                }
            })
        }
    })
};

function findSectionNameInCassandra(req, callback){
    nsaCassandra.Section.findSectionName(req, function(err, result) {
        callback(err, result)
    })
}
exports.findSectionNameInCassandra = findSectionNameInCassandra;


function findSectionCodeInCassandra(req, callback){
    nsaCassandra.Section.findSectionCode(req, function(err, result) {
        callback(err, result)
    })
}
exports.findSectionCodeInCassandra = findSectionCodeInCassandra;

exports.updateSection = function (req, res) {
    var body = req.body;
    nsaCassandra.Section.findSectionInClass(req, function(err, result){
        if(err){ 
            logger.debug(err)
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2403));
        }else if(result.id && body.status =='false'){
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        }else {
            nsaCassandra.Section.updateSection(req, function (err, result) {
                if (err) {
                    logger.debug(err)
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2403));
                } else {
                    result['message'] = message.nsa2406;
                    events.emit('JsonResponse', req, res, result);
                }
            });
        }
    });
}

exports.deleteSection = function (req, res) {
    nsaCassandra.Section.findSectionInClassSections(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            nsaCassandra.Section.deleteSection(req, function (err, result) {
                if (err) {
                    logger.debug(err)
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2404));
                } else {
                    result['message'] = message.nsa2407;
                    events.emit('JsonResponse', req, res, result);
                }
            });
        }
    });
};

exports.getSecByClass = function (req, res) {
    nsaCassandra.Section.getSecByClass(req, function (err, result) {
        if (err) {
            logger.debug(err)
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2401));
        } else {
            events.emit('JsonResponse', req, res, _.orderBy(result, 'sectionName'));
        }
    });
};

function fetchClassTaxonomy(req, data, callback) {
    nsaCassandra.Base.baseService.getClassTaxonomy(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.fetchClassTaxonomy = fetchClassTaxonomy;

function fetchChildTaxanomy(req, data, callback) {
    var parentCategoryId = data.parent_category_id;
    nsaCassandra.Taxanomy.fetchChildTaxanomy(req, parentCategoryId, function(err, result) {
        data['childObjs'] = result;
        callback(err, req, data);
    })
}
exports.fetchChildTaxanomy = fetchChildTaxanomy;

function fetchSingleTaxonomy(req, data, callback) {
    data['id'] = req.body.sectionId, data['parentCategoryId'] = data.parent_category_id;
    nsaCassandra.Taxanomy.getSingleTaxonomy(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.fetchSingleTaxonomy = fetchSingleTaxonomy;


function saveClassSection(req, callback) {
    nsaCassandra.Section.saveClassSections(req, function (err, result) {
        callback(err, req, result);
    });
}
exports.saveClassSection = saveClassSection;

function addChildToTaxonomy(req, data, callback) {
    nsaCassandra.Taxanomy.addSectionsToTaxonomy(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.addChildToTaxonomy = addChildToTaxonomy;

function deleteSectionTaxonomy(req, data, callback) {
    nsaCassandra.Taxanomy.deleteTaxonomy(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.deleteSectionTaxonomy = deleteSectionTaxonomy;

function deleteClassSection(req, callback) {
    nsaCassandra.Section.deleteSecByClass(req, function (err, result) {
        callback(err, req, result);
    });
}
exports.deleteClassSection = deleteClassSection;


function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, data) {
        callback(err, data);
    })
}
exports.executeBatch = executeBatch;

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.SECTION_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;

function throwSectionDetailsErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.SECTION_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwSectionDetailsErr = throwSectionDetailsErr;