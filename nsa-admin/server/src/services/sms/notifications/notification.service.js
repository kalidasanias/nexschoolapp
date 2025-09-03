/**
 * Created by Sai Deepak on 27-Dec-16.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    smsService = require('@nsa/nsa-notification').SMSService,
    pushService = require('@nsa/nsa-notification').PushNotificationService,
    emailService = require('@nsa/nsa-notification').EmailService,
    serviceUtils = require('@nsa/nsa-commons').serviceUtils,
    taxanomyUtils = require('@nsa/nsa-commons').taxanomyUtils,
    BaseError = require('@nsa/nsa-commons').BaseError,
    es = require('../../search/elasticsearch/elasticsearch.service'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    async = require('async'),
    _ = require('lodash'),
    nsanu = require('@nsa/nsa-bodybuilder').notificationUtil,
    nsaElasticSearch = require('@nsa/nsa-elasticsearch'),
    gallary = require('../../../services/gallery/gallery.service'),
    logger = require('../../../../config/logger');


exports.updateDeactiveStatus = function(req, res) {
    async.waterfall([
        nsaCassandra.Notification.getAllNotificationLogs.bind(null, req),
        executeBatch.bind()
    ], function (err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa204));
        } else {
            console.log('done')
            events.emit('JsonResponse', req, res, {message: message.nsa205});
        }
    })
};

exports.getAllNotifications = function(req, res) {
    var notificationQuery = nsanu.getNotificationQuery(req);
    nsaElasticSearch.search.searchDoc(req, notificationQuery, constant.NOTIFICATION_PERMISSIONS, function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa201));
        } else {
            events.emit('SearchResponse', req, res, result);
        }
    })
};

exports.notificationById = function(req, res) {
    nsaCassandra.Notification.notificationById(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa201));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.sendNotification = function (req, res) {
    async.waterfall(
        [
            buildTaxanomyObj.bind(null, req),
            getUsers.bind(),
            buildNotificationObj.bind(),
            saveNotificationInfo.bind()
        ],
        function (err,  result) {

            var output = {};
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa209));
            } else {
                sendNotificationAfterSave(req, result, function (err, req, result) {
                    if(err) {
                        logger.debug(err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa209));
                    } else if (result.smsObj == false) {
                        output['message'] = message.nsa214;
                        events.emit('ErrorJsonResponse', req, res, output);
                    } else {
                        output['message'] = message.nsa205;
                        output['data'] = result;
                        events.emit('JsonResponse', req, res, output);
                    }
                });
            }

        }
    );
};

exports.saveNotificationWithoutMedia = function (req, res) {
    async.waterfall(
        [
            buildTaxanomyObj.bind(null, req),
            getUsers.bind(),
            buildNotificationObj.bind(),
            saveNotificationInfo.bind()
        ],
        function (err,  result) {

            var output = {};
            if(err) {
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa209));
            } else {
                var output = {};
                output['message'] = message.nsa205;
                output['data'] = result;
                events.emit('JsonResponse', req, res, output);
            }

        }
    );
};


function sendAllNotification(req, notificationObj, callback) {
    async.parallel({
        sms: smsNotification.bind(null, req, notificationObj),
        push: pushNotification.bind(null, req, notificationObj),
        email: emailNotification.bind(null, req, notificationObj)
    }, function(err, result) {
        callback(err, req, notificationObj);
    });
};
exports.sendAllNotification = sendAllNotification;

function sendNotificationAfterSave(req, notificationObj, callback) {
    async.parallel({
        sms: smsNotification.bind(null, req, notificationObj),
        push: pushNotification.bind(null, req, notificationObj),
        email: emailNotification.bind(null, req, notificationObj)
    }, function(err, result) {
        if(err) {
            callback(err, req, notificationObj);
        } else {
            upadteMediaStatus(req, notificationObj, function (err, result) {
                callback(err, req, notificationObj);
            })
        }
    });
};
exports.sendNotificationAfterSave = sendNotificationAfterSave;

function upadteMediaStatus(req, notificationObject, callback) {
    async.waterfall ( [
        updateNotificationStatus.bind(null, req, notificationObject),
        statusUpdateQuery.bind()
    ], function (err, result) {
        callback(err, notificationObject);
    })

}

function smsNotification(req, notificationObj, callback) {
    notificationObj['canSendNotification'] = canSendNotification(req);
    if(notificationObj.notify.sms) {
        async.waterfall([
            findLimit.bind(null, req, notificationObj),
            checkSmsLimit.bind()
        ], function(err, result) {
            if(result) {
                async.waterfall(
                    [
                        getSenderIds.bind(null, req, notificationObj),
                        serviceUtils.buildSMSObj.bind(),
                        getSMSConfigObj.bind(),
                        smsService.sendSMS.bind(),
                    ],
                    function (err,  data) {
                        callback(err, data)
                    }
                );
            } else {
                notificationObj.smsObj = false;
                callback(err, notificationObj.smsObj);
            }
        });
    } else {
        callback(null, false)
    }

};
exports.smsNotification = smsNotification;

function checkSmsLimit(req, notificationObj, media, callback) {
    if(notificationObj.notify.sms) {
        nsaCassandra.MediaUsageLimit.checkSmsLimit(req, 1, notificationObj, media, function(err, result) {
            callback(err, result);
        })
    }
};
exports.checkSmsLimit = checkSmsLimit;

function getUsers(req, data, callback) {
    getContacts(req, function(err, result) {
        if (err) {
            logger.debug(err);
            callback(err, req, null);
        } else {
            data['users'] = result;
            data['students'] = req.body.students || null;
            callback(null, req, data);
        }
    })
};
exports.getUsers = getUsers;

function getContacts(req, callback) {
    var users = [];
    async.parallel({
        emp: getUsersByType.bind(null, req),
        student: getUsersByClassSections.bind(null, req),
        userObjs: getUsersByUniqueIds.bind(null, req)
    }, function(err, result) {
        if (err) {
            logger.debug(err);
            callback(err, null);
        } else {
            var students = req.body.students || [];
            users = _.concat(users, result.emp, result.student, result.userObjs, students);
            users =  _.uniqBy(users, 'userName');
            callback(null, users);
        }
    });
};
exports.getContacts = getContacts;

function getUsersByType(req, callback) {
    var userType = req.body.notifyTo.userType;
    var emp = _.includes(userType, constant.ALL_EMPLOYEE);
    if(emp) {
        es.getActiveEmployees(req, function(err, result){
            callback(err, result);
        });
    } else {
        callback(null, []);
    }
};
exports.getUsersByType = getUsersByType;

function getUsersByClassSections(req, callback) {
    var classes = req.body.classes;
    if(Array.isArray(classes) && classes.length > 0) {
        es.getUsersByClassSections(req, function(err, result){
            callback(err, result);
        });
    } else {
        callback(null, []);
    }

};
exports.getUsersByClassSections = getUsersByClassSections;

function getUsersByUniqueIds(req, callback) {
    try {
        var userIds = req.body.users;
        if(Array.isArray(userIds) && userIds.length > 0) {
            es.getUsersByUniqueIds(req, userIds, function(err, result){
                callback(err, result);
            });
        } else {
            callback(null, []);
        }
    } catch (err) {
        console.log('err', err);
    }

};
exports.getUsersByUniqueIds = getUsersByUniqueIds;

function getSenderIds(req, notificationObj, callback) {
    nsaCassandra.Template.getAllSenderIds(req, 1, function(err, senderIds) {
        callback(err, req, notificationObj, senderIds);
    })
};
exports.getSenderIds = getSenderIds;

function buildNotificationObj(req, users, callback) {
    nsaCassandra.NotificationConverter.buildNotificationObj(req, users, function(err, notificationObj) {
        callback(err, req, notificationObj);
    })
};
exports.buildNotificationObj = buildNotificationObj;

function getSMSConfigObj(notificationObj, callback) {
    // TODO : below code method and contentType to be moved to common constants
    notificationObj.configObj = {statusUrl:global.config.sms.valueLeaf.statusUrl, groupStatusUrl:global.config.sms.valueLeaf.groupStatusUrl, smsUrl: global.config.sms.valueLeaf.url, method: 'POST', contentType: 'Application/json'}
    callback(null, notificationObj);
};
exports.getSMSConfigObj = getSMSConfigObj;

function saveNotificationInfo(req, notificationObj, callback) {
    if(notificationObj.notify.sms || notificationObj.notify.push || notificationObj.notify.email) {
        async.waterfall(
            [
                constructNotificationObj.bind(null, req, notificationObj),
                constructMediaUsageLogObj.bind(),
                findLimit.bind(),
                updateMediaLimitObj.bind(),
                insertAuditLog.bind(),
                executeBatch.bind()
            ],
            function (err, result) {
                if(err) {
                    callback(err, null)
                } else {
                    updateNotificationInES(req, result, function (err, result) {
                        callback(err, result)
                    })
                }
            }
        );
    } else {
        callback(null, notificationObj);
    }

};
exports.saveNotificationInfo = saveNotificationInfo;

function updateNotificationInES(req, data, callback) {
    var notifyObjs = data.esNotificationObj;
    var notifyDetailObjs = data.esNotificationDetailObjs;
    async.parallel({
         notificationObjs : nsaCassandra.UserJson.buildNotificationObj.bind(null, req, notifyObjs),
         notificationDetailsObjs : nsaCassandra.UserJson.buildNotificationDetailObjs.bind(null, req, notifyDetailObjs)
    }, function (err, result) {
        var bulkParams = _.concat(result.notificationObjs, result.notificationDetailsObjs);
        var array = _.chunk(bulkParams, constant.ES_CHUNK_SIZE);
        async.times(array.length, function(i, next) {
            var objs = array[i];
            updateBulkObjs(objs, function(err, result) {
                next(err, result);
            });
        }, function(err, objs) {
            callback(err, data);
        });
    })
};
exports.updateNotificationInES = updateNotificationInES;


function updateBulkObjs(bulkParams, callback) {
    nsaElasticSearch.index.bulkDoc({body: bulkParams}, function (err, result) {
        callback(err, result);
    });
};

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, data);
    })
};
exports.executeBatch = executeBatch;

function updateMediaLimitObj(req, notificationObj, media, callback) {
    notificationObj.smsObj = notificationObj.smsObj != undefined ? notificationObj.smsObj : true;
    if(media != null && notificationObj.smsObj) {
        nsaCassandra.Base.mediabase.updateMediaLimitObj(req, notificationObj, media, function(err, data) {
            callback(err, req, data);
        })
    } else {
        callback(null, req, notificationObj);
    }

};
exports.updateMediaLimitObj = updateMediaLimitObj;

function findLimit(req, notificationObj, callback) {
    if(notificationObj.notify.sms) {
        nsaCassandra.MediaUsageLimit.findLimit(req, 1, function(err, result) {
            callback(err, req, notificationObj, result);
        })
    } else {
        callback(null, req, notificationObj, null);
    }

};
exports.findLimit = findLimit;

function constructMediaUsageLogObj(req, notificationObj, callback) {
    nsaCassandra.Base.mediabase.constructMediaUsageLogObj(req, notificationObj, function(err, data) {
        callback(err, req, data);
    })
};
exports.constructMediaUsageLogObj = constructMediaUsageLogObj;

function constructNotificationObj(req, notificationObj, callback) {
    nsaCassandra.Base.notificationbase.constructNotificationObj(req, notificationObj, function(err, data) {
        data.features = {featureId : constant.NOTIFICATION, actions : constant.CREATE, featureTypeId : notificationObj.notification_id};
        callback(err, req, data);
    })
};
exports.constructNotificationObj = constructNotificationObj;

function updateNotificationStatus(req, notificationObj, callback) {
    nsaCassandra.Base.notificationbase.updateNotificationStatus(req, notificationObj, function(err, data) {
        callback(err, req, data);
    })
}
exports.updateNotificationStatus = updateNotificationStatus;

function emailNotification(req, notificationObj, callback) {
    notificationObj['canSendNotification'] = canSendNotification(req);
    if(notificationObj.notify.email) {
        async.waterfall(
            [
                emailService.sendEmail.bind(null, req)
            ],
            function (err,  data) {
                callback(err, data);
            }
        );
    } else {
        callback(null, false)
    }
};
exports.emailNotification = emailNotification;

function pushNotification(req, notificationObj, callback) {
    notificationObj['canSendNotification'] = canSendNotification(req);
    if(notificationObj.notify.push) {
        async.waterfall(
            [
                getSchoolDetails.bind(null, req, notificationObj),
                serviceUtils.buildPushObj.bind(),
                pushService.pushNotification.bind()
            ],
            function (err,  data) {
                callback(err, data);
            }
        );
    } else {
        callback(null, false)
    }
};
exports.pushNotification = pushNotification;

function getSchoolDetails(req, notificationObj, callback) {
    nsaCassandra.School.getSchoolDetails(req, function(err, result){
        notificationObj.schoolDetails = result;
        callback(err, req, notificationObj);
    })
}
exports.getSchoolDetails = getSchoolDetails;

exports.deleteNotifications = function(req, res) {
    nsaCassandra.Notification.deleteNotifications(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, err);
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveDraftNotification = function(req, res) {
    async.waterfall(
        [
            buildTaxanomyObj.bind(null, req),
            getUsers.bind(),
            buildNotificationObj.bind(),
            constructNotificationObj.bind(),
            insertAuditLog.bind(),
            executeBatch.bind()
        ],
        function (err, result) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa212));
            } else {
                updateNotificationInES(req, result, function (err, result) {
                    if(err) {
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa212));
                    } else {
                        var output = {};
                        output['message'] = message.nsa210;
                        output['data'] = result;
                        events.emit('JsonResponse', req, res, output);
                    }
                })
            }
        }
    );
};

exports.draftNotificationById = function(req, res) {
    nsaCassandra.Notification.draftNotificationById(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa201));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.deleteDraftNotificationById = function(req, res) {
    nsaCassandra.Notification.deleteDraftNotificationById(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa202));
        } else {
            var params = {index: global.config.elasticSearch.index.notificationsIndex,
            type: global.config.elasticSearch.index.notificationsType,
            id: req.params.id};

            nsaElasticSearch.delete.deleteDoc(params, function (err, data) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa202));
                } else {
                    result['message'] = message.nsa211;
                    events.emit('JsonResponse', req, res, result);
                }
            })
        }
    })
};

exports.updateDraftNotificationById = function(req, res) {
    var status = req.body.notifyTo.status;
    var sendMedia = req.body.notifyTo.sendMedia;
    if (status == "Sent") {
        async.waterfall(
            [
                buildTaxanomyObj.bind(null, req),
                getUsers.bind(),
                buildNotificationObj.bind(),
                updateNotificationInfo.bind()
            ],
            function (err,  result) {
                var output = {};
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa209));
                } else {
                    if(sendMedia) {
                        sendNotificationAfterSave(req, result, function (err,req, result) {

                            if (err) {

                                logger.debug(err);
                                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa209));
                            } else if (result.smsObj == false) {
                                output['message'] = message.nsa214;
                                events.emit('ErrorJsonResponse', req, res, output);
                            } else {
                                output['message'] = message.nsa205;
                                output['data'] = result;
                                events.emit('JsonResponse', req, res, output);
                            }
                        });
                    } else {
                        output['message'] = message.nsa205;
                        output['data'] = result;
                        events.emit('JsonResponse', req, res, output);
                    }

                }
            }
        );

    } else {
        async.waterfall(
            [
                buildTaxanomyObj.bind(null, req),
                getUsers.bind(),
                buildNotificationObj.bind(),
                updateNotification.bind(),
                executeBatch.bind(),
            ],
            function (err, result) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, err);
                } else {
                    updateNotificationInES(req, result, function (err, data) {
                        if(err) {
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa212));
                        } else {
                            var result = {};
                            result['message'] = message.nsa210;
                            result['data'] = data;
                            events.emit('JsonResponse', req, res, result);
                        }
                    })
                }
            }
        );
    }
};

function sendNotifications(req, data, callback) {
    async.waterfall([
        getUsers.bind(null, req, data),
        buildNotificationObj.bind(),
        sendNotificationAfterSave.bind()
    ], function (err, req, response) {
        callback(err, response)
    })
}

exports.sendOnlyNotifications = function (req, res) {
    var data = [];
    sendNotifications(req, data, function(err, result){
        var output = {};
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa209));
        } else if (result.smsObj == false) {
            output['message'] = message.nsa214;
            events.emit('ErrorJsonResponse', req, res, output);
        } else {
            output['message'] = message.nsa205;
            output['data'] = result;
            events.emit('JsonResponse', req, res, output);
        }
    })

}

exports.updateAttachmentsById = function(req, res) {
    var data = [];
    var status = req.body.notifyTo.status;
    async.waterfall(
        [
            updateAttachmentsById.bind(null, req, data),
            findMediaLogsObj.bind(),
            updateMediaLogsObj.bind(),
            insertAuditLog.bind(),
            executeBatch.bind()
        ],
        function (err,  data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa209));
            } else {
                updateAttachmentsInES(req, data, function (err1, output) {
                    if(err1) {
                        logger.debug(err1);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa4702));
                    } else {
                        if (status == 'Sent') {
                            var output = {};
                            sendNotifications(req, data, function (err, response) {
                                if (err) {
                                    logger.debug(err);
                                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa209));
                                } else if (data.smsObj == false) {
                                    output['message'] = message.nsa214;
                                    events.emit('ErrorJsonResponse', req, res, output);
                                } else {
                                    output['message'] = message.nsa205;
                                    output['data'] = response;
                                    events.emit('JsonResponse', req, res, output);
                                }
                            })

                        } else {
                            var output = {message: message.nsa4701};
                            events.emit('JsonResponse', req, res, output);
                        }
                    }
                });

            }
        }
    );

};

function statusUpdateQuery(req, data, callback) {
    es.statusUpdateQuery(req, data, function (err, result) {
        var array = _.chunk(result, constant.ES_CHUNK_SIZE);
        async.times(array.length, function(i, next) {
            var objs = array[i];
            es.updateBulkObjs(objs, function(err, result) {
                next(err, result);
            });
        }, function(err, objs) {
            callback(err, data);
        });
    })
}


function updateAttachmentsInES(req, data, callback) {
    async.parallel({
        notificationObjs : es.attachmentsNotifUpdateQuery.bind(null, req, data),
        notificationDetailsObjs : es.attachmentsNotifDetailsUpdateQuery.bind(null, req, data)
    }, function (err, result) {
        var bulkParams = _.concat(result.notificationObjs, result.notificationDetailsObjs);
        var array = _.chunk(bulkParams, constant.ES_CHUNK_SIZE);
        async.times(array.length, function(i, next) {
            var objs = array[i];
            es.updateBulkObjs(objs, function(err, result) {
                next(err, result);
            });
        }, function(err, objs) {
            callback(err, data);
        });
    })
}
exports.updateAttachmentsInES = updateAttachmentsInES;

function updateAttachmentsById(req, data, callback) {
    nsaCassandra.Base.notificationbase.updateAttachmentsObj(req, data, function(err, data) {
        data.features = {featureId : constant.NOTIFICATION, actions : constant.UPDATE, featureTypeId : data.notification_id};
        callback(err, req, data);
    })
}


function findMediaLogsObj(req, data, callback) {
    nsaCassandra.Base.notificationbase.findMediaLogsObj(req, data, function(err, data) {
        callback(err, req, data);
    })
};
exports.findMediaLogsObj = findMediaLogsObj;

function updateMediaLogsObj(req, data, callback) {
    nsaCassandra.Base.notificationbase.updateMediaLogsObj(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.updateMediaLogsObj = updateMediaLogsObj;


function updateNotificationInfo(req, notificationObj, callback) {
    async.waterfall(
        [
            updateNotification.bind(null, req, notificationObj),
            constructMediaUsageLogObj.bind(),
            findLimit.bind(),
            updateMediaLimitObj.bind(),
            insertAuditLog.bind(),
            executeBatch.bind(),
        ],
        function (err, result) {
            if(err) {
                callback(err, null)
            } else {
                updateNotificationInES(req, result, function (err, result) {
                    callback(err, result)
                })
            }
        }
    );
};
exports.updateNotificationInfo = updateNotificationInfo;

function updateNotification(req, notificationObj, callback) {
    nsaCassandra.Base.notificationbase.updateNotification(req, notificationObj, function(err, data) {
        data.features = {featureId : constant.NOTIFICATION, actions : constant.UPDATE, featureTypeId : notificationObj.notification_id};
        callback(err, req, data);
    })
}
exports.updateNotification = updateNotification;

exports.getNotificationlogsById = function(req, res) {
    nsaCassandra.Notification.getNotificationlogsById(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa208));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getMediaUsedCount = function(req, res) {
    nsaCassandra.Notification.getMediaUsedCount(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa206));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getMediaLogByObjectId = function(req, res) {
    try {
        req.body.objectId = req.params.id;
        var notificationQuery = nsanu.getNotificationLogByObjectQuery(req);
        nsaElasticSearch.search.searchDoc(req, notificationQuery, null, function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa208));
            } else {
                events.emit('SearchResponse', req, res, result);
            }
        });
    } catch (cerr) {
        logger.debug(err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa208));
    }


    /*nsaCassandra.Notification.notificationByObjectId(req, function(err, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa206));
        } else {
            if(data.length > 0) {
                var count = 0;
                var finalResult = []
                _.forEach(data, function(value, key) {
                    if(value.notification_id != null && value.notification_id != undefined) {
                        req.params.id = value.notification_id.toString();
                        nsaCassandra.Notification.getNotificationlogsById(req, function(err, result) {
                            if (err) {
                                logger.debug(err);
                                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa208));
                            } else {
                                count ++;
                                finalResult.push(result);
                                if(count == data.length) {
                                    events.emit('JsonResponse', req, res, nsaCassandra.Base.baseService.returnDateFormatedResult(_.flatten(finalResult), 'updated_date'));
                                }
                            }
                        })
                    }
                })
            } else {
                events.emit('JsonResponse', req, res, []);
            }

        }
    })*/
};

exports.checkStatus = function(req, res) {
    getSMSConfigObj({}, function (err, notificationObj) {
        smsService.checkStatus(req, notificationObj, function (err, data) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa208));
            } else {
                events.emit('JsonResponse', req, res, JSON.parse(data));
            }
        })
    })
};

exports.getNotificationByUser = function(req, res) {
    nsaCassandra.Notification.getNotificationByUser(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa201));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};


exports.deleteAttachments = function (req, res) {
    var data = [];
    async.waterfall(
        [
            deleteAttachmentsObjs.bind(null, req, data),
            deleteAttachmentsDetailsObjs.bind(),
            insertAuditLog.bind(),
            executeBatch.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4704));
            } else {
                req.body.seletedImageIds = result.s3DeleteIds;
                /*gallary.deleteS3Src(req, function(err, result1){
                 if(err){
                 logger.debug(err);
                 }else {
                 var output = { message: message.nsa4703, data: req.body}
                 events.emit('JsonResponse', req, res, output);
                 }
                 });*/
                getAttachmentsByKey(req, result, function (err, data) {
                    if(_.isEmpty(data)) {
                        async.parallel([
                            gallary.deleteS3Src.bind(null, req),
                            updateAttachmentsInES.bind(null, req, result)
                        ], function (err, result) {
                            if(err){
                                logger.debug(err);
                            }else {
                                var output = { message: message.nsa4703, data: req.body}
                                events.emit('JsonResponse', req, res, output);
                            }
                        })
                    } else {
                        async.parallel([
                            updateAttachmentsInES.bind(null, req, result)
                        ], function (err, result) {
                            if(err){
                                logger.debug(err);
                            }else {
                                var output = { message: message.nsa4703, data: req.body}
                                events.emit('JsonResponse', req, res, output);
                            }
                        })
                    }
                })

            }
        }
    );
};

function deleteAttachmentsObjs(req, data, callback) {
    nsaCassandra.Base.notificationbase.deleteAttachmentsObj(req, data, function(err, result) {
        data.features = {featureId : constant.NOTIFICATION, actions : constant.UPDATE, featureTypeId : data.id};
        callback(err, req, result);
    })
};
exports.deleteAttachmentsObjs = deleteAttachmentsObjs;

function deleteAttachmentsDetailsObjs(req, data, callback) {
    nsaCassandra.Base.notificationbase.deleteAttachmentsDetailsObj(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.deleteAttachmentsDetailsObjs = deleteAttachmentsDetailsObjs;


function getAttachmentsByKey(req, data, callback) {
    nsaCassandra.Base.notificationbase.deleteAttachmentByKey(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.getAttachmentsByKey = getAttachmentsByKey;

function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.insertAuditLog = insertAuditLog;

function canSendNotification(req) {
    var host = req.headers.host.split(":");
    var fromHost = global.config.notificationHost
    return (fromHost.indexOf(host[0]) > -1)
};
exports.canSendNotification = canSendNotification;

function buildTaxanomyObj(req, callback) {
    var data = {};
    taxanomyUtils.buildTaxanomyObj(req, function(err, result){
        data['taxanomy'] = result;
        callback(err, req, data)
    })
}
exports.buildTaxanomyObj = buildTaxanomyObj;


function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.NOTIFY_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;

function throwNotificationErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.NOTIFY_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwNotificationErr = throwNotificationErr;

