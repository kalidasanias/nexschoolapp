/**
 * Created by kiranmai on 9/20/17.
 */

var fs = require("fs"),
    JSONStream = require('JSONStream'),
    through = require('through'),
    nsaElasticSearch = require('@nsa/nsa-elasticsearch'),
    events = require('@nsa/nsa-commons').events,
    async = require('async');

exports.updateMediaUsageLog = function (req, res) {
    try {
        setTimeout(function (args) { events.emit('JsonResponse', req, res, 'success'); }, 200)
        var count = 0
        fs.createReadStream(__dirname + '/notifications.json', {encoding: 'utf8'})
            .pipe(JSONStream.parse('school_media_usage_log.*'))
            .pipe(through(function (data) {
                if(data.media_name != undefined && data.media_name != null && !Array.isArray(data.media_name))
                    data.media_name = data.media_name.replace('[','').replace(']','').split(",").map(function(item) {return item.trim()});
                count++
                var $this = this
                $this.pause();
                var params = {
                    index: global.config.elasticSearch.index.notificationsIndex,
                    type: global.config.elasticSearch.index.notificationDetailsType,
                    id: data.id,
                    parent: data.notification_id,
                    body: data
                };

                nsaElasticSearch.index.indexDoc(params, function (err, data) {
                    if(err) {
                        console.log('errr', err)
                    } else {
                        console.log('done', count, data.result)
                        $this.resume();
                    }

                })
            }))

    } catch (e) {
        console.log('expe', e);
    }
};

exports.updateAssignmentDetails = function(req, res) {
    try {
        var count = 0
        setTimeout(function (args) { events.emit('JsonResponse', req, res, 'success'); }, 200)
        fs.createReadStream(__dirname + '/assignments.json', {encoding: 'utf8'})
            .pipe(JSONStream.parse('school_assignment_details.*'))
            .pipe(through(function (data) {
                var array = [];
                var subjectsDetails = [];
                var subObjs = data.subjects.replace('[', '').replace(']', '').replace(/\=/g, ':');
                var splits = array.concat(subObjs.split(','));
                for(var i=0;i<splits.length;i++) {
                    var arr = splits[i].split(':');
                    var subObj = {
                        subject_id: arr[0].trim(),
                        subject_name: arr[1].trim()
                    };
                    subjectsDetails.push(subObj);
                }
                var attachmentsArray = [];
                if(!_.isEmpty(data.attachments)) {
                    _.forEach(data.attachments, function (item, key) {
                        attachmentsArray.push({id: key, name: item})
                    })
                } else {
                    attachmentsArray = null;
                };
                data['attachments'] = attachmentsArray;
                data['subjects'] = subjectsDetails;
                if(data.media_name != undefined && data.media_name != null && !Array.isArray(data.media_name))
                    data.media_name = data.media_name.replace('[','').replace(']','').split(",").map(function(item) {return item.trim()});
                count++
                var $this = this
                $this.pause();
                var params = {
                    index: global.config.elasticSearch.index.assignmentsIndex,
                    type: global.config.elasticSearch.index.assignmentDetailsType,
                    id: data.assignment_detail_id,
                    parent: data.assignment_id,
                    body: data
                };

                nsaElasticSearch.index.indexDoc(params, function (err, data) {
                    if(err) {
                        console.log('errr', err)
                    } else {
                        console.log('done', count, data.result)
                        $this.resume();
                    }

                })
            }))

    } catch (e) {
        console.log('expe', e);
    }
};