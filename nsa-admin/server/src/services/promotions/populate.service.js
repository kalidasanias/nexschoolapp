var async = require('async'),
    events = require('@nsa/nsa-commons').events,
    nsaCassandra = require('@nsa/nsa-cassandra'),
    nsaElasticSearch = require('@nsa/nsa-elasticsearch'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    nsabb = require('@nsa/nsa-bodybuilder').builderutil,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    models = require('@nsa/nsa-cassandra').Models,
    _ = require('lodash'),
    logging = require('../../common/logging'),
    notificationService = require('../sms/notifications/notification.service'),
    logger = require('../../../config/logger');

exports.populateAllClassesSections = function(req, res) {
    async.parallel({
        classes: getAllClasses.bind(null, req),
        sections: getAllSections.bind(null, req),
    }, function(err, result){
        if(err)
        {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa608});
        }else {
            async.waterfall([
               updateClassAcademics.bind(null,req, result),
               updateSectionsAcademics.bind(),
               executeBatch.bind()
           ], function(err, data){
               if(err){
                   logger.debug(err);
                   events.emit('ErrorJsonResponse', req, res, {message: message.nsa608});
               }
               else{
                   var data=[{message: message.nsa607}];
                   events.emit('JsonResponse', req, res, data);
               }
           })
        }
    });
};

exports.populateAllClassAssoc = function(req, res) {
    async.parallel({
        classAssoc: getAllClassesAssoc.bind(null, req),
        taxonomy : getAllTaxonomyObject.bind(null, req)
    }, function(err, result){
        if(err)
        {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa608});
        }else {
            async.waterfall([
                updateClassAssocAcademics.bind(null,req, result),
                updateTaxonomyAcademics.bind(),
                executeBatch.bind()
            ], function(err, data){
                if(err){
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, {message: message.nsa608});
                }
                else{
                    var data=[{message: message.nsa607}];
                    events.emit('JsonResponse', req, res, data);
                }
            })
        }
    });

}

exports.populateAllTermsAssoc = function(req, res) {
    async.parallel({
        terms: getAllTerms.bind(null, req),
    }, function(err, result){
        if(err)
        {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa608});
        }else {
            async.waterfall([
                updateTermsAcademics.bind(null,req, result),
                executeBatch.bind()
            ], function(err, data){
                if(err){
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, {message: message.nsa608});
                }
                else{
                    var data=[{message: message.nsa607}];
                    events.emit('JsonResponse', req, res, data);
                }
            })
        }
    });

}

exports.populateAllSubjectsAssoc = function(req, res) {
    async.parallel({
        subjects: getAllSubjects.bind(null, req),
    }, function(err, result){
        if(err)
        {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa608});
        }else {
            async.waterfall([
                updateSubjectAcademics.bind(null,req, result),
                executeBatch.bind()
            ], function(err, data){
                if(err){
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, {message: message.nsa608});
                }
                else{
                    var data=[{message: message.nsa607}];
                    events.emit('JsonResponse', req, res, data);
                }
            })
        }
    });

}


exports.updateAcademicYearDetails = function(req, res) {
    setTimeout(function () {
        var data=[{message: message.nsa607}];
        events.emit('JsonResponse', req, res, data);
    }, 100)
    getAllSchoolData(req, function (err, schools) {
        _.forEach(schools, function (val, index) {
            async.parallel({
                academics: getAcademicYears.bind(null, req, val),
            }, function(err, result){
                if(err)
                {
                    logger.debug(err);
                }else {
                    async.waterfall([
                        updateAcYear.bind(null,req, result),
                        executeBatch.bind()
                    ], function(err, data){
                        if(err){
                            console.info('err',err)
                            logger.debug(err);
                        }
                        else {
                            console.log("schools Data " + (index + 1) + "." + val.school_name + " Done")
                            if(index == (schools.length - 1)) {
                                console.log("All schools Done")
                            }
                        }
                    })
                }
            });

        })
    })
}

exports.populateAll = function(req, res) {
    setTimeout(function () {
        var data=[{message: message.nsa607}];
        events.emit('JsonResponse', req, res, data);
    }, 100)
    getAllSchoolData(req, function (err, schools) {
        _.forEach(schools, function (val, index) {
            async.parallel({
                academics: getAcademicYears.bind(null, req, val),
                classes: getAllClasses.bind(null, req, val),
                sections: getAllSections.bind(null, req, val),
                subjects: getAllSubjects.bind(null, req, val),
                features: getFeaturesByYear.bind(null, req, val),
                timetableConfig: getTimetableConfig.bind(null, req, val),
                periods: getSchoolPeriods.bind(null, req, val),
                //classAssoc: getAllCsaveUserClassficationObjlassesAssoc.bind(null, req),
                taxonomy : getAllTaxonomyObject.bind(null, req, val),
                terms: getAllTerms.bind(null, req, val),
                EsUserAllocation: getUserAllocations.bind(null, req, val)
            }, function(err, result){
                if(err)
                {
                    logger.debug(err);
                }else {
                    async.waterfall([
                        updateAcademicYear.bind(null,req, result),
                        updateClassAcademics.bind(),
                        updateSectionsAcademics.bind(),
                        //updateClassAssocAcademics.bind(),
                        updateTaxonomyAcademics.bind(),
                        updateTermsAcademics.bind(),
                        updateSubjectAcademics.bind(),
                        updateSchoolFeatures.bind(),
                        updateSchoolPeriods.bind(),
                        updateTimetableConfig.bind(),
                        executeBatch.bind()
                    ], function(err, data){
                        if(err){
                            console.info('err',err)
                            logger.debug(err);
                        }
                        else {
                            esUpdateEsUserAllocation(req, result.EsUserAllocation,val, function(err1, result1){
                                if(err1){
                                    console.info('err1',err1)
                                    logger.debug(err);
                                }else {
                                    console.log("schools Data " + (index + 1) + "." + val.school_name + " Done")
                                    if(index == (schools.length - 1)) {
                                        console.log("All schools Done")
                                    }
                                }
                            })

                        }
                    })
                }
            });

        })
    })
}

function getUserAllocations(req, val, callback){
    var searchParams = nsabb.getVehiclesBySchool(val, req.body.year);
    nsaElasticSearch.search.searchUsers(searchParams, function (err, data, status) {
           data = data.hits.hits;
        callback(err, data)
    })
};

function esUpdateEsUserAllocation(req, allocation, schoolDetails, callback){
    console.info('allocation....',allocation)
    if(!_.isEmpty(allocation)){
        nsaCassandra.Promotion.updateAcademicEsUserAllocation(req , allocation, schoolDetails, function(err, result) {
            callback(err, result)
        });
    }else {
        callback(null, [])
    }
}

function getVehicleUsers(req, data, callback) {
    nsaCassandra.Promotion.getVehicleUsers(req, data, function(err, result){
        data.vehicleUsers = result;
        callback(err, req, data);
    })
}

function getTimetableConfig(req, val, callback) {
    nsaCassandra.Promotion.getTimetableConfig(req, val, function(err, result){
        callback(err, result);
    })
}

function getAllSchoolData(req, callback) {
    nsaCassandra.Promotion.getAllSchools(req, function(err, result){
        callback(err, result);
    })
}

function getSchoolPeriods(req, val, callback) {
    nsaCassandra.Promotion.getSchoolPeriods(req, val, function(err, result){
        callback(err, result);
    })
}

exports.getAllClassDetails = function(req, res) {
    getClasses(req, function (err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa608});
        }
        else{
            events.emit('JsonResponse', req, res, result);
        }
    })
}

exports.getAllClassSecDetails = function(req, res) {
    getClassesByClassId(req, function (err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
        }
        else{
            events.emit('JsonResponse', req, res, result);
        }
    })
}

    /*
    exports.getAllUsersByClass = function(req, res) {
        getClassesByClassId(req, function (err, result) {
            if(err){
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
            }
            else{
                events.emit('JsonResponse', req, res, result);
            }
        })
    }
    */

/*exports.getAllFeatures = function(req, res) {
    var features = [];
    console.log("Sssssss.s.s.s.")
    async.waterfall([
        getFeatures.bind(null, req),
        updateFeatures.bind(),
        executeBatch.bind()
    ], function (err, data) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa608});
        }
        else {
            var data=[{message: message.nsa607}];
            events.emit('JsonResponse', req, res, data);
        }
    })
}*/

function getAllClassSecUsers(req, callback) {
    req.headers.academicyear = req.body.year != undefined ? req.body.year : req.params.year;
    var searchParams = nsabb.getUsersByClassSectionsQueryParam(req);
    nsaElasticSearch.search.getESUsersByQuery(searchParams, function (err, data, status) {
        callback(err, data);
    })
}

function getAllClassUsers(req, res, callback) {
    var params = {};
    params.classId = req.params.classId;
    params.size = 10000;
    req.headers.academicyear = req.body.year != undefined ? req.body.year : req.params.year;
    var searchParams = nsabb.getStudentsByClassQuery(req, res, params);
    nsaElasticSearch.search.getESUsersByQuery(searchParams, function (err, data, status) {
        callback(err, data);
    })
}


function getDepromotedStudentsByClassQuery(req, callback) {
    var params = {};
    params.classId = req.params.classId;
    params.promoted = false;
    params.size = 10000;
    req.headers.academicyear = req.body.year != undefined ? req.body.year : req.params.year;
    var searchParams = nsabb.getDepromotedStudentsByClassQuery(req, params);
    nsaElasticSearch.search.getESUsersByQuery(searchParams, function (err, data, status) {
        callback(err, data);
    })
}

exports.getUsersList = function (req, res) {
    getAllClassSecUsers(req, function (err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
        }
        else{
            events.emit('JsonResponse', req, res, result);
        }
    })

}

exports.getClassUsersList = function (req, res) {
    getAllClassUsers(req, res, function (err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
        }
        else{
            events.emit('JsonResponse', req, res, result);
        }
    })

}

exports.getDepromotedStudentsByClass = function (req, res) {
    getDepromotedStudentsByClassQuery(req, function (err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
        }
        else{
            events.emit('JsonResponse', req, res, result);
        }
    })

}

exports.getPromotedUsersByClsSec = function (req, res) {
    getpromotedEsStudentUsers(req, function (err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
        }
        else{
            events.emit('JsonResponse', req, res, result);
        }
    })

}


exports.getAcademicYearDetails = function(req, res) {
    nsaCassandra.Academics.getAcademicYearInfo(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa3001));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.getUsersByClassAndSections  = function(req, res) {
    async.parallel({
        postClass : getClassByOrder.bind(null, req),
        sections : nsaCassandra.Section.getSections.bind(null, req),
        users: getAllClassSecUsers.bind(null, req),
        promotedSections: getClassesByClassId.bind(null, req)
    }, function (err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
        }
        else{
            if(req.body.shuffle == undefined) {
                result.users = _.filter(result.users, function(o) { return o.promoted == undefined; });
            }

            events.emit('JsonResponse', req, res, result);
        }

    })
};

exports.updateClasses  = function(req, res) {
    getAllSchoolData(req, function (err, schools) {
        _.forEach(schools, function (val, index) {
            async.parallel({
                classes : getAllClasses.bind(null, req, val),
            }, function (err, result) {
                if(err){
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
                }
                else{
                    async.waterfall([
                        updateClassOrderBy.bind(null, req, result),
                        executeBatch.bind()
                    ], function (err, result) {
                        if(index == (schools.length - 1)) {
                            var data = [{message: message.nsa607}];
                            events.emit('JsonResponse', req, res, data);
                        }

                    });
                }

            })

        })
    })

};

exports.promoteStudents  = function(req, res) {
    var data = {};
    data.update = false;
    async.waterfall([
        saveClassAssocAcademics.bind(null, req, data),
        saveClassSectionTaxonomy.bind(),
        saveFailedClassSectionTaxonomy.bind(),
        upadteClassAssoc.bind(),
        saveClassAssociationForFailed.bind(),
        getVehicleUsers.bind(),
        updateVehicleUsers.bind(),
        saveUserClassfications.bind(),
        executeBatch.bind()
    ], function (err, result) {
       /* console.log('result..................................................',result)*/
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
        }
        else{
            saveUserInEs(req, result, function (err, response) {
                if(err) {
                    events.emit('ErrorJsonResponse', req, res, {message: message.nsa2402});
                } else {
                  var body = req.body;
                    req.headers.academicyear = req.body.year;
                    if(body.notifyTo.status == "Sent"){
                        sendNotification(req, function(err1, data){
                            if(err1) {
                                events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
                            } else {
                                var data= {message: message.nsa609};
                                events.emit('JsonResponse', req, res, data);
                            }
                        })
                    }else {
                        var data= {message: message.nsa609};
                        events.emit('JsonResponse', req, res, data);
                    }
                }
            })
        }

    })
};

function sendNotification(req, callback) {
    async.parallel({
        Promotion:  sendPromoteNotification.bind(null, req),
        Depromotion : sendDepromotionNotification.bind(null, req)
    }, function(err, result){
        if(err) {
            callback(err, null)
        } else {
            callback(null, result)
        }
    })
};
exports.sendNotification = sendNotification;


function sendPromoteNotification(req, callback) {
    var data = [];
    async.waterfall([
            buildPromotedUsers.bind(null, req, data),
            getPromotionTemplate.bind(),
            getTemplateObj.bind(),
            buildFeatureNotificationObj.bind(),
            notificationService.sendAllNotification.bind(),
            notificationService.saveNotificationInfo.bind()
        ],
        function (err, data) {
            callback(err, data)
        }
    )
};

function sendDepromotionNotification(req, callback) {
    var data = [];
    async.waterfall([
            buildDepromotedUsers.bind(null, req, data),
            getDePromotionTemplate.bind(),
            getDePromoteTemplateObj.bind(),
            buildFeatureNotificationObj.bind(),
            notificationService.sendAllNotification.bind(),
            notificationService.saveNotificationInfo.bind()
        ],
        function (err, data) {
            callback(err, data)
        }
    )
};

function buildPromotedUsers(req, data, callback) {
    nsaCassandra.Base.promotionbase.notificationUserObj(req.body.users, function(err, result){
        data['users'] = result;
        callback(null, req, data);
    })
};

function buildDepromotedUsers(req, data, callback) {
    nsaCassandra.Base.promotionbase.notificationUserObj(req.body.failedUsers, function(err, result){
        data['users'] = result;
        callback(null, req, data);
    })
};

function getPromotionTemplate(req, data, callback) {
    try {
        var data1 = {action: constant.CREATE_ACTION, userType: constant.STUDENT};
        nsaCassandra.Feature.getFeatureTemplate(req, data1, function (err, result) {
            callback(err, req, data, result);
        })
    } catch (err) {
        logger.debug(err);
    }
};

function getDePromotionTemplate(req, data, callback) {
    try {
        var data1 = {action: constant.UPDATE_ACTION, userType: constant.STUDENT};
        nsaCassandra.Feature.getFeatureTemplate(req, data1, function (err, result) {
            callback(err, req, data, result);
        })
    } catch (err) {
        logger.debug(err);
    }
};

function getTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.promotionbase.getTemplateObj(req, templates, function(err, templateObj) {
        if (err) {
            logging.debugLog(req, 'Send Notification - Promoted student Err ', err);
        }
        callback(err, req, users, templateObj);
    })
};

function getDePromoteTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.promotionbase.getDePromoteTemplateObj(req, templates, function(err, templateObj) {
        if (err) {
            logging.debugLog(req, 'Send Notification - Promoted student Err ', err);
        }
        callback(err, req, users, templateObj);
    })
};

function buildFeatureNotificationObj(req, users, templateObj, callback) {
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        notificationObj.isDetailedNotification = true,
        notificationObj.replacementKeys = [constant.FIRST_NAME];
        notificationObj.notifyTo.status = req.body.notifyTo.status.toString();
        callback(err, req, notificationObj);
    })
};
exports.buildFeatureNotificationObj = buildFeatureNotificationObj;

exports.shuffleStudents  = function(req, res) {
    var data = {};
    data.update = true;
    async.waterfall([
        saveClassAssocAcademics.bind(null, req, data),
        saveClassSectionTaxonomy.bind(),
        updateUserClassfications.bind(),
        getVehicleUsers.bind(),
        updateVehicleUsers.bind(),
        executeBatch.bind()
    ], function (err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
        }
        else{
            updateUserInEs(req, result, function (err, response) {
                if(err) {
                    events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
                } else {
                    var body = req.body;
                    if(body.notifyTo.status == "Sent"){
                        sendShuffleNotification(req, function(err1, data){
                            if(err1) {
                                events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
                            } else {
                                var data= {message: message.nsa610};
                                events.emit('JsonResponse', req, res, data);
                            }
                        })
                    } else {
                        var data={message: message.nsa610};
                        events.emit('JsonResponse', req, res, data);
                    }
                }
            })

        }

    })
};


function sendShuffleNotification(req, callback) {
    var data = [];
    async.waterfall([
            buildShuffleUsers.bind(null, req, data),
            getPromotionTemplate.bind(),
            getShuffleTemplateObj.bind(),
            buildFeatureNotificationObj.bind(),
            notificationService.sendAllNotification.bind(),
            notificationService.saveNotificationInfo.bind()
        ],
        function (err, data) {
            callback(err, data)
        }
    )
};

function buildShuffleUsers(req, data, callback) {
    nsaCassandra.Base.promotionbase.notificationUserObj(req.body.users, function(err, result){
        data['users'] = result;
        callback(null, req, data);
    })
};

function getShuffleTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.promotionbase.getShuffleTemplateObj(req, templates, function(err, templateObj) {
        if (err) {
            logging.debugLog(req, 'Send Notification - Promoted student Err ', err);
        }
        callback(err, req, users, templateObj);
    })
};

exports.updatePromoteStudents  = function(req, res) {
    var data = {};
    data.batchObj = [];
    async.waterfall([
        updatePromotedUserClassfications.bind(null, req, data),
        executeBatch.bind()
    ], function (err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
        }
        else{
            updatePromotedUserInEs(req, result, function (err, response) {
                console.log("err", err)
                if(err) {
                    events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
                } else {
                    var data= {message: message.nsa609};
                    events.emit('JsonResponse', req, res, data);
                }
            })

        }

    })
};

exports.getPromotedClasses  = function(req, res) {
    req.headers.academicyear = req.params.year;
    nsaCassandra.Promotion.getAllSchoolClassSections(req, function (err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
        }
        else {
            var resData = {}
            var data = _.uniqBy(JSON.parse(JSON.stringify(result)), 'class_id');
            result = _.filter(data, function(o) { o['new_academic_year'] = req.params.academicYear; return o.promoted_class_id != null; });
            events.emit('JsonResponse', req, res, result);

        }
    })
};

/*exports.getShuffledClasses  = function(req, res) {
    req.headers.academicyear = req.params.year;
    nsaCassandra.Promotion.getAllShuffleSchoolClassSections(req, function (err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa2401});
        }
        else {
            var resData = {}
            var data = _.uniqBy(JSON.parse(JSON.stringify(result)), 'class_id');
            result = _.filter(data, function(o) { o['new_academic_year'] = req.params.academicYear; return o.promoted_class_id != null; });
            events.emit('JsonResponse', req, res, result);

        }
    })
};*/

function updatePromotedUserInEs(req, data, callback) {
    async.waterfall([
        getEsStudentUserByName.bind(null, req, data),
        getEsUserByNameAndYear.bind(),
        constructUsers.bind(),
        saveEsUsers.bind(),
    ], function (err, result) {
        callback(err, result)
    })
}

function constructUsers(req, data, callback) {
    var newUser = data.newUser;
    var oldUser = data.oldUser;
    var body = [];

    try {
        if(newUser) {
            body.push( { "update": { "_index":  global.config.elasticSearch.index.userIndex, "_type": global.config.elasticSearch.index.studentType, "_id": newUser[0]._id} });
            body.push({"doc" : {"classes" : req.body.users[0].classes, "preclasses" : req.body.users[0].preClasses}});
        }

        if(oldUser) {
            body.push( { "update": { "_index":  global.config.elasticSearch.index.userIndex, "_type": global.config.elasticSearch.index.studentType, "_id": oldUser[0]._id} });
            body.push({"doc" : {"promoted" : true}});
        }
        data.userObj = body;
        callback(null, req, data);
    } catch (err) {
        callback(err, req, data);
    }
}


function saveUserInEs(req, data, callback) {
    async.waterfall([
        getEsStudentUsers.bind(null, req, data),
        constructUpdateUserObj.bind(),
        constructUserObj.bind(),
        constructFailedUserObj.bind(),
        saveEsUsers.bind(),
    ], function (err, result) {
        callback(err, result)
    })
}


function updateUserInEs(req, data, callback) {
    async.waterfall([
        buildUpdateUserObj.bind(null, req, data),
        saveEsUsers.bind(),
    ], function (err, result) {
        callback(err, result)
    })
}

function saveFailedUsers(req, data, callback) {
    async.waterfall([
        saveClassAssociationForFailed.bind(null, req, data),
    ], function (err, result) {
        callback(err, result)
    })
}

function saveClassAssociationForFailed(req, data, callback) {
    nsaCassandra.Promotion.saveClassAssociationForFailed(req, data, function (err, result) {
        callback(err, req, data);
    })

}

function getEsStudentUsers(req, data, callback) {
    req.headers.academicyear = req.body.academicYear;
    var searchParams = nsabb.getUsersByClassSectionsQueryParam(req);
    nsaElasticSearch.search.getESUsersByQuery(searchParams, function (err, users, status) {
        data.esUsers = users;
        callback(err, req, data)
    })
}

function getEsStudentUserByName(req, data, callback) {
    req.headers.academicyear = req.body.academicYear;
    var params = req.params;
    var searchParams = nsabb.getUserByUserNameQuery(req, params);
    nsaElasticSearch.search.getESUsersByQuery(searchParams, function (err, users, status) {
        data.newUser = users;
        callback(err, req, data)
    })
}

function getEsUserByNameAndYear(req, data, callback) {
    req.headers.academicyear = req.body.year;
    var params = req.params;
    var searchParams = nsabb.getUserByUserNameQuery(req, params);
    nsaElasticSearch.search.getESUsersByQuery(searchParams, function (err, users, status) {
        data.oldUser = users;
        callback(err, req, data)
    })
}

function getpromotedEsStudentUsers(req, callback) {
    req.headers.academicyear = req.body.year;
    var classes = req.body.classes;
    var searchParams = nsabb.getDepromotedUsersByClsSec(req, classes, req.body.promoted);
    nsaElasticSearch.search.getESUsersByQuery(searchParams, function (err, users, status) {
        callback(err, users)
    })
}

function saveEsUsers(req, data, callback) {

    var doc = _.chunk(data.userObj, constant.ES_100_CHUNK_SIZE);
    var results = {};
    for(var i = 0; i < doc.length; i++) {
        console.info('result = ', doc[i]);
        nsaElasticSearch.index.bulkDoc({
            body: doc[i]
        }, function (err,result) {
            console.info('result = ', result.items[0]);
            console.info('err = ', err);
            results = result;
        })
        if(i == (doc.length -1)) {
            callback(null, results);
        }
    }
}

function upadteClassAssoc(req, data, callback) {
    nsaCassandra.Promotion.upadteClassAssoc(req, data, function (err, result) {
        callback(err, req, result)
    })
}

function updateSchoolPeriods(req, data, callback) {
    nsaCassandra.Promotion.updateSchoolPeriods(req, data, function (err, result) {
        callback(err, req, result)
    })
}

function updateTimetableConfig(req, data, callback) {
    nsaCassandra.Promotion.updateTimetableConfig(req, data, function (err, result) {
        callback(err, req, result)
    })
}

function updateVehicleUsers(req, data, callback) {
    nsaCassandra.Promotion.updateVehicleUsers(req, data, function (err, result) {
        callback(err, req, result)
    })
}


function constructUserObj(req, data, callback) {
    var body = data.userObj ? data.userObj : [];
   try {
       var updateUsers = _.intersectionBy(req.body.users, data.esUsers, 'user_name');
       var newUsers = _.differenceBy(req.body.users, data.esUsers , 'user_name');
       loopUserobj(req, newUsers, 'insert', function (err, result) {
           if(err) {
               callback(err, req, data);
           } else {
               body.push(result);
               loopUserobj(req, updateUsers, 'update', function (err, result) {
                   if(err) {
                       callback(err, req, data);
                   } else {
                       body.push(result);
                       data.userObj = _.flatten(body);
                       callback(null, req, data);
                   }

               });
           }
       });

   } catch (err) {
       callback(err, req, body);
   }

}

function buildUpdateUserObj(req, data, callback) {
    var body = [];
    try {
            loopUserobj(req, req.body.users, 'update', function (err, result) {
                if(err) {
                    callback(err, req, data);
                } else {
                    data.userObj = _.flatten(result);
                    callback(null, req, data);
                }

            });

    } catch (err) {
        callback(err, req, body);
    }

}

function constructFailedUserObj(req, data, callback) {
    var body = data.userObj;
    try {
        if(!_.isEmpty(req.body.failedUsers)) {
            loopUserobj(req, req.body.failedUsers, 'insert', function (err, result) {
                if(err) {
                    callback(err, req, data);
                } else {
                    body.push(result);
                    data.userObj = _.flatten(body);
                    callback(null, req, data);
                }
            });
        } else {
            callback(null, req, data);
        }


    } catch (err) {
        callback(err, req, body);
    }

}

function constructUpdateUserObj(req, data, callback) {
    var body = [];
    try {
        data.esPromoted = true;
        loopUpdateUserobj(req, req.body.users, data, 'update', function (err, result) {
            if(err) {
                callback(err, req, data);
            } else {
                body.push(result);
                data.esPromoted = false;
                loopUpdateUserobj(req, req.body.failedUsers, data, 'update', function (err, result) {
                    if(err) {
                        callback(err, req, data);
                    } else {
                        body.push(result);
                        data.userObj = _.flatten(body);
                        callback(null, req, data);
                    }

                });
            }
        });

    } catch (err) {
        callback(err, req, body);
    }

}

function loopUserobj(req, users, keyValue, callback) {
    var body = [];
    var createObj = function(object, callback) {
            var doc = {};
            var docId = object._id;
            console.log("")
            if(keyValue == 'delete') {
                body.push({ "delete": { "_index": global.config.elasticSearch.index.userIndex, "_type": global.config.elasticSearch.index.studentType, "_id": docId }})
                callback(null, body);
            } else if(keyValue == 'update') {
                object.academic_year = req.body.academicYear;
                body.push( { "index": { "_index":  global.config.elasticSearch.index.userIndex, "_type": global.config.elasticSearch.index.studentType, "_id": docId} });
                delete object._id;
                delete object.newClassId;
                delete object.newSectionId;
                delete object.promoted;
                body.push(object);
                callback(null, body);
            } else {
                object.academic_year = req.body.academicYear;
                body.push( { "index": { "_index":  global.config.elasticSearch.index.userIndex, "_type": global.config.elasticSearch.index.studentType, "_id": (models.uuid()).toString()} });
                delete object._id;
                delete object.newClassId;
                delete object.newSectionId;
                delete object.promoted;
                body.push(object);
                callback(null, body);
            }

    };
    if(users.length > 0) {
        async.times(users.length, function (i, next) {
            var obj = users[i];
            createObj(obj, function (err, data) {
                next(err, data);
            });
        }, function (err, Objs) {
            callback(null, body)
        });
    } else {
        callback(null, body);
    }


}


function loopUpdateUserobj(req, users, data, keyValue, callback) {
    var body = [];
    var createObj = function(object, callback) {
        var doc = {};
        object.promoted = data.esPromoted;
        var docId = object._id;
        if(keyValue == 'delete') {
            body.push({ "delete": { "_index": global.config.elasticSearch.index.userIndex, "_type": global.config.elasticSearch.index.studentType, "_id": docId }})
            callback(null, body);
        } else if(keyValue == 'update') {
            object.academic_year = req.body.year;
            body.push( { "update": { "_index":  global.config.elasticSearch.index.userIndex, "_type": global.config.elasticSearch.index.studentType, "_id": docId} });
            body.push({"doc" : {"promoted" : data.esPromoted}});
            callback(null, body);
        } else {
            object.academic_year = req.body.year;
            body.push( { "index": { "_index":  global.config.elasticSearch.index.userIndex, "_type": global.config.elasticSearch.index.studentType, "_id": models.uuid()} });
            body.push(object);
            callback(null, body);
        }

    };
    async.times(users.length, function (i, next) {
        var obj = users[i];
        createObj(obj, function (err, data) {
            next(err, data);
        });
    }, function (err, Objs) {
        callback(null, body)
    });

}

function getClassesByClassId(req, callback){
    nsaCassandra.Promotion.getClassesByClsId(req, function(err, result){
        callback(err, result)
    });
}
exports.getClassesByClassId = getClassesByClassId;

function getFeatures(req, callback){
    var data = {};
    nsaCassandra.Promotion.getFeature(req, function(err, result){
        data.features = result;
        callback(err, req, data)
    });
}
exports.getFeatures = getFeatures;

function getFeaturesByYear(req, val, callback){
    nsaCassandra.Promotion.getFeaturesByYear(req, val, function(err, result){
        callback(err, result)
    });
}
exports.getFeaturesByYear = getFeaturesByYear;

function updateSchoolFeatures(req, data, callback){
    nsaCassandra.Promotion.updateSchoolFeatures(req, data, function(err, result){
        callback(err, req, result)
    });
}
exports.updateSchoolFeatures = updateSchoolFeatures;


function getAcademicYears(req, val, callback){
    nsaCassandra.Academics.getAllSchoolAcademicYears(req, val, function(err, result){
        callback(err, result);
    })
}
exports.getAcademicYears = getAcademicYears;

function getAllClasses(req, val, callback) {
    var year = req.body.year != undefined ? req.body.year : req.params.year;
    nsaCassandra.Promotion.getClassesByYear(year, val, function(err, result){
            callback(err, result)
        });
};
exports.getAllClasses = getAllClasses;

function getClassByOrder(req, callback) {
    var params = {};
    params.year = req.body.year != undefined ? req.body.year : req.params.year;
    params.orderBy = req.body.orderBy;
    nsaCassandra.Promotion.getClassByOrder(req, params, function(err, result){
        callback(err, result)
    });
};
exports.getClassByOrder = getClassByOrder;

function getClasses(req, callback) {
    nsaCassandra.Promotion.getClasses(req, function(err, result){
        callback(err, result)
    });
};
exports.getClasses = getClasses;

function getLastYearClasses(req, callback) {
    var year = req.body.academicYear;
    nsaCassandra.Promotion.getClassesByYear(year, function(err, result){
        callback(err, result)
    });
};
exports.getLastYearClasses = getLastYearClasses;


function getAllTerms(req, val, callback) {
    nsaCassandra.Promotion.getAllTermsByYear(req, val, function(err, result){
        callback(err, result)
    });
};
exports.getAllTerms = getAllTerms;

function updateAcademicYear(req, data, callback){
    nsaCassandra.Academics.updateAcademicYear(req, data, function(err, result1){
        callback(err, req, result1);
    })
}

function getAllSubjects(req, val, callback) {
    nsaCassandra.Promotion.getAllSubjectsByYear(req, val, function(err, result){
        callback(err, result)
    });
};
exports.getAllSubjects = getAllSubjects;

function academicYearDetails(req, val, callback) {
    nsaCassandra.Promotion.getAllAcademicYearDetails(req, val, function(err, result){
        callback(err, result)
    });
};
exports.academicYearDetails = academicYearDetails;

function getAllSections(req, val, callback){
    nsaCassandra.Promotion.getAllSectionsByYear(req, val, function (err, result) {
       callback(err, result)
    });
};
exports.getAllSections = getAllSections;

function getAllClassesAssoc(req, callback){
    var year = req.body.year != undefined ? req.body.year : req.params.year;
    nsaCassandra.Promotion.getAllClassesAssoc(year, function (err, result) {
        callback(err, result)
    });
};
exports.getAllClassesAssoc = getAllClassesAssoc;

function getLastYearClassAssoc(req, callback) {
    var year = req.body.academicYear;
    nsaCassandra.Promotion.getAllClassesAssoc(year, function(err, result){
        callback(err, result)
    });
};
exports.getLastYearClassAssoc = getLastYearClassAssoc;

function getAllTaxonomyObject(req, val, callback) {
    nsaCassandra.Promotion.getAllTaxonomy(req, val, function (err, result) {
        callback(err, result)
    });
}
exports.getAllTaxonomyObject = getAllTaxonomyObject;

function updateClassAcademics(req, data, callback){
   nsaCassandra.Promotion.updateClassAcademicYear(req, data, function(err, result){
        callback(err, req, result)
   })
};
exports.updateClassAcademics = updateClassAcademics;

function updateClassOrderBy(req, data, callback){
    nsaCassandra.Promotion.updateClassOrderBy(req, data, function(err, result){
        callback(err, req, result)
    })
};
exports.updateClassOrderBy = updateClassOrderBy;

function updateClassAssocAcademics(req, data, callback){
    nsaCassandra.Promotion.updateClassAssocAcademicYear(req, data, function(err, result){
        callback(err, req, result)
    })
};
exports.updateClassAssocAcademics = updateClassAssocAcademics;

function saveClassAssocAcademics(req, data, callback){
    async.waterfall([
        nsaCassandra.Promotion.saveClassAssocAcademics.bind(null, req, data)
    ], function (err, result) {
        callback(err, req, result)
    })
};
exports.saveClassAssocAcademics = saveClassAssocAcademics;


function deleteClassAssoc(req, data, result, callback){
    data.delClassObj = result;
    nsaCassandra.Promotion.deleteClassAssoc(req, data, function(err, result){
        callback(err,req, result)
    })
};

function updateSectionsAcademics(req, data, callback){
    nsaCassandra.Promotion.updateSectionAcademicYear(req, data, function(err, result){
        callback(err,req, result)
    })
};
exports.updateSectionAcademics = updateSectionsAcademics;

function updateTermsAcademics(req, data, callback){
    nsaCassandra.Promotion.updateTermsAcademicYear(req, data, function(err, result){
        callback(err,req, result)
    })
};
exports.updateTermsAcademics = updateTermsAcademics;

function updateSubjectAcademics(req, data, callback){
    nsaCassandra.Promotion.updateSubjectsAcademicYear(req, data, function(err, result){
        callback(err,req, result)
    })
};
exports.updateSubjectAcademics = updateSubjectAcademics;

function updateAcYear(req, data, callback){
    nsaCassandra.Promotion.updateAcYearDetails(req, data, function(err, result){
        callback(err,req, result)
    })
};
exports.updateAcYear = updateAcYear;

function updateTaxonomyAcademics(req, data, callback){
    nsaCassandra.Promotion.updateTaxonomyAcademicYear(req, data, function(err, result){
        callback(err,req, result)
    })
};
exports.updateTaxonomyAcademics = updateTaxonomyAcademics;

function saveClassTaxonomy(req, data, callback){
    nsaCassandra.Promotion.saveTaxonomyForClass(req, data, function(err, result){
        callback(err,req, result)
    })
};
exports.saveClassTaxonomy = saveClassTaxonomy;

function saveSectionTaxonomy(req, data, callback){
    nsaCassandra.Promotion.saveTaxonomyForSections(req, data, function(err, result){
        callback(err,req, result)
    })
};
exports.saveSectionTaxonomy = saveSectionTaxonomy;

function saveClassSectionTaxonomy(req, data, callback) {
    async.waterfall([
        getClassTaxonomy.bind(null, req, data),
        getClassSecTaxonomy.bind(),
        saveClassTaxonomy.bind(),
        saveSectionTaxonomy.bind()
    ], function (err, req, result) {
        callback(err, req, result)
        console.log('result....................................................',JSON.parse(JSON.stringify(result)))
    })
}

function saveFailedClassSectionTaxonomy(req, data, callback) {
    async.waterfall([
        getFailedClassTaxonomy.bind(null, req, data),
        getFailedClassSecTaxonomy.bind(),
        saveFailedClassTaxonomy.bind(),
        saveFailedSectionTaxonomy.bind()
    ], function (err, req, result) {
        callback(err, req, result)
    })
}

function getFailedClassTaxonomy(req, data, callback) {
    nsaCassandra.Promotion.getFailedClassTaxonomy(req, function(err, result){
        data.failClassTaxonomy = result;
        callback(err, req, data)
    })
}

function getFailedClassSecTaxonomy(req, data, callback) {
    nsaCassandra.Promotion.getFailedClassSecTaxonomy(req, data, function(err, result){
        data.failSecTaxonomy = result;
        callback(err, req, data)
    })
}

function saveFailedClassTaxonomy(req, data, callback){
    nsaCassandra.Promotion.saveFailedTaxonomyForClass(req, data, function(err, result){
        callback(err,req, result)
    })
};
exports.saveFailedClassTaxonomy = saveFailedClassTaxonomy;

function saveFailedSectionTaxonomy(req, data, callback){
    nsaCassandra.Promotion.saveFailedTaxonomyForSections(req, data, function(err, result){
        callback(err,req, result)
    })
};
exports.saveFailedSectionTaxonomy = saveFailedSectionTaxonomy;

function getClassTaxonomy(req, data, callback) {
    nsaCassandra.Promotion.getClassTaxonomy(req, function(err, result){
        data.classTaxonomy = result;
        callback(err, req, data)
    })
}

function delClassSecTaxonomy(req, data, callback) {
    nsaCassandra.Promotion.deleteClassSecTaxonomy(req, data, function(err, result){
        callback(err, req, data)
    })
}

function getClassSecTaxonomy(req, data, callback) {
    nsaCassandra.Promotion.getClassSecTaxonomy(req, data, function(err, result){
        data.secTaxonomy = result;
        callback(err, req, data)
    })
}

function saveUserClassfications(req, data, callback) {
    async.waterfall([
        saveUserClassficationObj.bind(null, req, data),
        saveDepromotedUsers.bind(),
        updatePromotedUsers.bind(),
        updateDepromotedUsers.bind()
    ], function (err, req, result) {
        callback(err, req, result)
    })
}

function updateUserClassfications(req, data, callback) {
    async.waterfall([
        saveUserClassficationObj.bind(null, req, data),
    ], function (err, req, result) {
        callback(err, req, result)
    })
}

function updatePromotedUserClassfications(req, data, callback) {
    async.waterfall([
        delDepromotedUserClass.bind(null, req, data),
        saveUserClassficationObj.bind(),
        updatePromotedUsers.bind()
    ], function (err, req, result) {
        callback(err, req, result)
    })
}

function saveUserClassficationObj(req, data, callback) {
    nsaCassandra.Promotion.saveUserClassfication(req, data, function(err, result){
        callback(err,req, result)
    })
}

function saveDepromotedUsers(req, data, callback) {
    nsaCassandra.Promotion.saveDepromotedUsers(req, data, function(err, result){
        callback(err,req, result)
    })
}

function updatePromotedUsers(req, data, callback) {
    nsaCassandra.Promotion.updatePromotedStatus(req, data, function(err, result){
        callback(err,req, result)
    })
}

function updateDepromotedUsers(req, data, callback) {
    data.promoted = false;
    nsaCassandra.Promotion.updateDePromotedStatus(req, data, function(err, result){
        callback(err,req, result)
    })
}

function delDepromotedUserClass(req, data, callback) {
    nsaCassandra.Promotion.delUserClassficationObj(req, data, function(err, result){
        callback(err,req, result)
    })
}

function getUserClassification(req, data, callback) {
    nsaCassandra.Promotion.getUserClassification(req, data, function(err, result){
        callback(err,req, result)
    })
}

function getDepromotedUsers(req, data, callback) {
    nsaCassandra.Promotion.getDepromotedUsers(req, data, function(err, result){
        callback(err,req, result)
    })
}


function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, res) {
        callback(err, data);
    })
}
exports.executeBatch = executeBatch;

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.CLASS_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};

exports.buildErrResponse = buildErrResponse;

function buildStudentErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.STUDENT, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;

