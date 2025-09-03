/**
 * Created by bharatkumarr on 17/08/17.
 */

var http = require('http'),
    FormData = require('form-data'),
    multiparty = require('multiparty'),
    request = require('request'),
    _ = require('lodash'),
    s3 = require('@nsa/nsa-asset').s3,
    async = require('async'),
    dateFormat = require('dateformat'),
    nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    logger = require('../../common/logging'),
    constant = require('@nsa/nsa-commons').constants,
    nsanu = require('@nsa/nsa-bodybuilder').notificationUtil,
    nsaElasticSearch = require('@nsa/nsa-elasticsearch'),
    message = require('@nsa/nsa-commons').messages,
    notification = require('../sms/notifications/notification.service');

exports.getAllNotifications = function(req, res) {
    nsaCassandra.VoiceNotification.getAllNotifications(req, function(err, result) {
        if (err) {
            logger.debugLog(req,'Unable to get Voice Notifications ', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa201));
        } else {
            events.emit('JsonResponse', req, res,  _.sortBy(result, 'updated_date').reverse());
        }
    })
};

exports.getAllNotificationsByCreatedById = function(req, res) {
    nsaCassandra.VoiceNotification.getAllNotificationsByCreatedById(req, function(err, result) {
        if (err) {
            logger.debugLog(req, "get Audio By Created By ID Error ", err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa201));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getAllVoiceNotificationLogsById = function(req, res) {
    if (req.query.search) {
        req.query.keyword = req.query.search['value'];
    }
    var notificationQuery = nsanu.getVoiceNotificationLogQuery(req);
    nsaElasticSearch.search.searchDoc(req, notificationQuery, constant.NOTIFICATION_PERMISSIONS, function (err, result) {
        if (err) {
            logger.debugLog(req, "Get Voice Notification from ES Error ", err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1601));
        } else {
            events.emit('SearchResponse', req, res, result);
        }
    })
};

exports.getAllAudios = function(req, res) {
    try {
        nsaCassandra.VoiceNotification.getAllAudios(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get All Audio', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa201));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get Get All Audio', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa201));
    }
};

exports.getAllDeviceAudios = function(req, res) {
    try {
        nsaCassandra.VoiceNotification.getAllDeviceAudios(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get All Audio', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa201));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get Get All Audio', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa201));
    }
};

exports.sendNotification = function (req, res) {
    try {
        async.waterfall(
            [
                notification.buildTaxanomyObj.bind(null, req),
                getUsers.bind(),
                sendVoiceNotification.bind(),
                saveNotificationInfo.bind()
            ],
            function (err, data) {
                if (err) {
                    logger.debugLog(req, 'Unable to send voice message ', err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, 'Unable to send voice message '));
                } else {
                    if (req.body.is_app_notification) {
                        if(req.body.notifyTo.status === 'Sent' ) {
                            req.body.notify = {push: true};

                            sendPushNotification(req, data, function () {
                                if (err) {
                                    logger.debugLog(req, 'Unable to send push notification ', err);
                                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(e, 'Unable to send push notification '));
                                } else{
                                    events.emit('JsonResponse', req, res, {message: 'Successfully sent push voice message  '});
                                }
                            })
                        } else {
                            events.emit('JsonResponse', req, res, {message: 'Successfully saved push voice message '});
                        }
                    } else {
                        events.emit('JsonResponse', req, res, {message: 'Successfully sent voice message '});
                    }
                }
            }
        );
    } catch (e) {
        logger.debugLog(req, 'Unable to send voice message ', e);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(e, 'Unable to send voice message '));
    }
};

function sendPushNotification(req, data, callback) {

    try {
        async.parallel({
            audioGallery: updateAudioGallery.bind(null, req),
            notify: sendNoticationChannels.bind(null, req, data)
        }, function(err, data) {
            callback(err, data);
        });

    } catch (e) {
        callback(e, data);
    }

}

function sendNoticationChannels(req, data, callback) {
    var notificationObj = {
        phoneNo: req.body.phoneNo || null,
        notifyTo: req.body.notifyTo || null,
        createdDate: req.body.createdDate || null,
        notificationId: req.body.notificationId || null,
        notify: req.body.notify || null,
        mediaName: ['push'],
        smsTemplate: { templateName: req.body.download_link, title: req.body.name },
        emailTemplate: { templateName: req.body.download_link, title: req.body.name },
        pushTemplate: { templateName: req.body.download_link, title: req.body.name },
        classes: req.body.classes || null,
        users: data.users_result.users || null,
        notifiedCategories: data.taxanomy || null,
        notifiedStudents: data.users_result.students || null
    }
    async.waterfall([
        notification.sendAllNotification.bind(null, req, notificationObj),
        notification.saveNotificationInfo.bind(),

    ], function (err, result) {
        notification.updateNotificationInES(req, result, function (err, result) {
            callback(err, result)
        });
    })
}


function updateAudioGallery(req, callback) {
    if (req.body.audio_gallery) {
        nsaCassandra.VoiceNotification.saveAudio(req, function(err, result) {
            if (err) {
                logger.debugLog(req, 'Unable to update school audios ', err);
            }
            callback();
        });
    } else {
        callback();
    }
}

function getVoiceMessageTemplate(req, callback) {
    var result = {featureId : constant.VOICE, subFeatureId: constant.VOICE_MESSAGE, action: constant.CREATE_ACTION, userType: constant.STUDENT};
    var headers = nsaCassandra.BaseService.getHeaders(req);
    result.school_id = headers.school_id;
    result.tenant_id = headers.tenant_id;
    result.pushTemplate  = { templateName: req.body.name, title: req.body.file_name };
};

function getUsers(req, data, callback) {
    notification.getUsers(req, data, function(err, req, results) {
        data['users_result'] = JSON.parse(JSON.stringify(results));

        var arr = [];
        if (results) {
            async.each(_(results['users']).omitBy(_.isUndefined).omitBy(_.isNull).value(), function (value, iCallback) {
                arr.push(value.primaryPhone);
                iCallback();
            }, function (err) {
                data['users'] = arr;
                callback(null, req, data);
            });
        } else if(err) {
            callback(err, req, data);
        }
    });
}

function sendVoiceNotification(req, data, callback) {
    if (req.body.is_app_notification === undefined || req.body.is_app_notification === false) {
        checkVoiceCallLimit(req, data, function (err) {
            if (err) {
                callback(err, req, data)
            } else {
                if (req.body.notifyTo.status !== 'Draft') {
                    sendNowVoiceMsg(req, data, callback);
                } else {
                    callback(null, req, data);
                }
            }
        })
    } else {
        callback(null, req, data);
    }
}

function checkVoiceCallLimit(req, data, cb) {
    nsaCassandra.MediaUsageLimit.findLimit(req, 5, function(err, media) {
        if (err) {
            cb(err);
        } else {
            var extraUsers = _.compact(_.split(req.body.phoneNo, ','));
            var totalCount = data['users'].length + extraUsers.length;
            var usedCount = media[0].used_count;
            var available_limit = media[0].available_limit;
            if (available_limit === -1) {
                cb(null);
            } else {

                var remaining_limit = available_limit - usedCount;
                data['totalCount'] = totalCount;
                data['usedCount'] = usedCount + totalCount;
                data['media'] = media;

                if (totalCount > remaining_limit) {
                    cb({message: 'voice limit exceeds'});  //voice limit exceeds available sms count
                } else {
                    cb(null);
                }
            }
        }
    })

};

function saveNotificationInfo(req, data, callback) {
    try {
        async.waterfall(
            [
                constructNotificationObj.bind(null, req, data),
                updateMediaLimitObj.bind(),
                insertAuditLog.bind(),
                executeBatch.bind(),
            ],
            function (err, result) {
                callback(err, result)
            }
        );
    } catch (e) {
        logger.debugLog(req, 'Unable to save voice message ', e);
        callback(err, null);
        // events.emit('ErrorJsonResponse', req, res, buildErrResponse(e, 'Unable to save voice message '));
    }

};
exports.saveNotificationInfo = saveNotificationInfo;

function constructNotificationObj(req, data, callback) {
    nsaCassandra.Base.notificationbase.constructVoiceNotificationObj(req, data, function(err, data) {
        data.features = {featureId : constant.NOTIFICATION, actions : constant.CREATE, featureTypeId : data.notification_id};
        callback(err, req, data);
    })

}

function updateMediaLimitObj(req, data, callback) {
    if (req.body.notifyTo.status !== 'Draft' && !req.body.is_mobile_recording && (req.body.is_app_notification  === undefined || req.body.is_app_notification === false)) {
        nsaCassandra.Base.mediabase.updateVoiceLimitObj(req, data, function (err, data) {
            callback(err, req, data);
        })
    } else {
        callback(null, req, data);
    }
};

function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, result) {
        callback(err, req, result);
    })
};

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, data);
    })
};

exports.getAudios = function (req, res) {
    var baseUrl = global.config.sms.voice.audioUrl;
    call3rdParty(req, baseUrl, function (err, result) {
        if (err) {
            logger.debugLog(req, 'Get list of Audio file Names ', err);
            events.emit('ErrorJsonResponse', req, res,  err);
        } else {
            getFormatedResult(req, result.data, function(err, data){
                if (err) {
                    logger.debugLog(req, 'Get list of Audio file Names ', err);
                    events.emit('ErrorJsonResponse', req, res,  err);
                } else {
                    events.emit('JsonResponse', req, res, data);
                }
            })
        }
    });
};

function getFormatedResult(req, mobidata, callback){
    try {
        nsaCassandra.VoiceNotification.getAllAudios(req, function (err, cassandraData) {
             var audios = _.intersectionWith(mobidata, cassandraData, function(mobi, cassan){
                    mobi.uniqId = cassan.id;
                    mobi.nsaStatus = cassan.status;
                return mobi.id === cassan.audio_id;
            });
            async.times(audios.length, function(i, next){
                var obj = audios[i];
                if (obj.nsaStatus === 'initiated' && obj.status === 'Approved') {
                    updateStatus(req, obj, function (err, data) {
                        next(err, data);
                    })
                } else {
                    next(null, obj);
                }
            }, function(err, audioObjs){
                callback(err, audioObjs);
            })
        });
    } catch (err) {
        logger.debugLog(req, 'Get list of Audio file Names ', err);
        callback(err, audios)
    }
}

var updateStatus = function(req, object, callback){
     nsaCassandra.VoiceNotification.updateAudio(req, object, function(err, result){
         callback(err, result);
     });
};

exports.updateCassandra = function (req, res) {
    nsaCassandra.VoiceNotification.saveAudio(req, function(err, result) {
        if (err) {
            events.emit('ErrorJsonResponse', req, res,  err);
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa441});
        }
    })
};

function upload() {
    async.parallel({
        audioGallery: updateAudioGallery.bind(null, req),
        notify: sendNoticationChannels.bind(null, req, data)
    }, function(err, data) {
        if (err) {

        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa441});

        }
    });
}

exports.uploadAudio = function (req, res) {
    var form = new multiparty.Form();
    req.body.attachments = [];
    req.body.attachments.push({});
    form.on('field', function(name, value) {
        if (name === 'path') {
            // destPath = value;
        }
        if (name === 'download_link') {
            req.body.attachments[0].key = value;
        }
        if (name === 'file_name') {
            req.body.attachments[0].name = value;
        }
    });

    form.on('part', function(part) {
        part.name = part.filename;

        var formData = new FormData();
        formData.append('method', global.config.sms.voice.uploadMethod);
        formData.append('api_key', global.config.sms.voice.api_key);
        formData.append('fileName', part.filename);
        formData.append('type', 'transactional');
        formData.append('voicefile', part);

        formData.getLength(function(err, length){
            var reqHeaders = formData.getHeaders();
            reqHeaders['content-length'] = length + part.byteCount;
            reqHeaders['Accept'] = '*/*';

            var r = request.post(global.config.sms.voice.audioUploadUrl, { headers: reqHeaders },
                function(err, resp, body) {
                    if (err) {
                        logger.debugLog(req, "Upload Audio Error ", err);
                        events.emit('ErrorJsonResponse', req, res, err)
                    } else {
                        try {
                            body = JSON.parse(body);
                            if (body.status) {
                                req.body.id = body.data.Id;
                                nsaCassandra.VoiceNotification.saveAudio(req, function(err, result) {
                                    if (err) {
                                        events.emit('ErrorJsonResponse', req, res,  err);
                                    } else {
                                        events.emit('JsonResponse', req, res, {message: message.nsa441});
                                    }
                                });

                            } else {
                                logger.debugLog(req, " Upload Failed by mobtexting ", body.message);
                                events.emit('ErrorJsonResponse', req, res, {message: body.message})
                            }

                        } catch (e) {
                            logger.debugLog(req, "Upload Audio Error ", e);
                            events.emit('ErrorJsonResponse', req, res, e)
                        }

                    }
                });

            r._form = formData;

        });



    });
    form.parse(req);
};

function sendNowVoiceMsg (req, data, callback) {
    var phoneNos = '';
    if (req.body.phoneNo && req.body.phoneNo.length > 0) {
        phoneNos = req.body.phoneNo + ',';
    }
    var formattedDate = '';
    if (req.body.schedule_date) {
        formattedDate = '&schedule_datetime=' + dateFormat(req.body.schedule_date, "yyyy-mm-dd HH:MM:ss");
    }
    var receiver = phoneNos + data['users'].toString();
    if (receiver.length > 1800) {
        var splitedUsers = _.chunk(data['users'], 150);
        async.each(splitedUsers, function (value, iCallback) {
            var baseUrl = global.config.sms.voice.scheduleUrl + phoneNos + value.toString() +
                '&prompt_id=' + req.body.audio_id + formattedDate;

            phoneNos = '';

            // console.info('baseUrl...', baseUrl);
            // iCallback();
            call3rdParty(req, baseUrl, function (err, results) {
                if (err) {
                    logger.debugLog(req,'Unable to send voice message url ' + baseUrl , err);
                    callback(err, req, data);
                } else {
                    iCallback();
                }
            });
        }, function (err) {
            if (err) {
                logger.debugLog(req,'Unable to send voice message ' , err);
                callback(err, req, data);
            } else {
                callback(null, req, data);
            }
        });

    } else {

        var baseUrl = global.config.sms.voice.scheduleUrl + phoneNos + data['users'].toString() +
            '&prompt_id=' + req.body.audio_id + formattedDate;
        // console.info('else baseUrl...', baseUrl);
        // callback(null, req, data);
        call3rdParty(req, baseUrl, function (err, results) {
            if (err) {
                logger.debugLog(req,'Unable to send voice message url ' + baseUrl , err);
                callback(err, req, data);
            } else {
                callback(null, req, data);
            }
        });
    }
};

function call3rdParty(req, url, callback) {
    http.get(url, function (res) {
        var body = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            try {
                var response = JSON.parse(body);
                if (response.status) {
                    callback(null, response);
                } else {
                    callback(response, null);
                }
            } catch (e) {
                logger.debugLog(req, 'Recieved response from voice call ', body);
                callback(e, null);
            }
        });

        res.on('error', callback);
    }).on('error', callback).end();
};

exports.getVoiceNotificationById = function(req, res) {
    nsaCassandra.VoiceNotification.getVoiceNotificationById(req, function(err, result) {
        if (err) {
            logger.debugLog(req, "get Audio By Id Error ", err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa201));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.deleteNotificationById = function(req, res) {
    nsaCassandra.VoiceNotification.deleteNotificationById(req, function(err, result) {
        if (err) {
            logger.debugLog(req, "Delete Audio By Id Error ", err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa202));
        } else {
            result['message'] = message.nsa211;
            events.emit('JsonResponse', req, res, result);
        }
    })
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.NOTIFY_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};

