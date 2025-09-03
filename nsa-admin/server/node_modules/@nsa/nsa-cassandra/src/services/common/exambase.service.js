/**
 * Created by senthil on 3/30/2017.
 */
var models = require('../../models/index'),
    baseService = require('./base.service'),
    dateService = require('../../utils/date.service.js'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    _ = require('lodash'),
    dateUtils = require('@nsa/nsa-commons').dateUtils,
    constants = require('../../common/constants/constants'),
    templateConverter = require('../../converters/template.converter');

var ExamBase = function f(options) {
    var self = this;
};


ExamBase.getExamTemplateObj = function(req, templates, callback) {
    var subjects = "";
    _.forEach(req.body.schedule, function(subject) {
        var startTime = new Date(subject.exam_start_time);
        var endTime = new Date(subject.exam_end_time);
        subjects += subject.subject_name + ' - ' + dateService.getFormattedDateWithoutTime(subject.date) + ' : ' +
            dateUtils.convertTo12Hour(startTime.toTimeString()) + ' - ' +
            dateUtils.convertTo12Hour(endTime.toTimeString()) + ' \n';
    });


    if(req.body.count == 1 && (req.body.portions.portion_details || req.body.isPortions || !_.isEmpty(req.body.portions.files))){
        if(_.isEmpty(req.body.schedule)){
            var res = templates.sms_template_message.replace('Dear Parent,',message.nsa19009);
            var updateRes = res.replace('has been scheduled','');
            var pushRes = templates.push_template_message.replace('Dear Parent,',message.nsa19009);
            var pushUpdateRes = pushRes.replace('has been scheduled','');
            templates.sms_template_message = updateRes;
            templates.push_template_message = pushUpdateRes;
        }else {
            var updateRes = templates.sms_template_message.replace('All the best!',message.nsa19005);
            templates.sms_template_message = updateRes;
        }
    } else if(req.body.count  !== 1 && (req.body.portions.portion_details || req.body.isPortions || !_.isEmpty(req.body.portions.files))){
        if(_.isEmpty(req.body.schedule)){
            var res = templates.sms_template_message.replace('Dear Parent,',message.nsa19009);
            var updateRes = res.replace('has been scheduled','');
            var pushRes = templates.push_template_message.replace('Dear Parent,',message.nsa19009);
            var pushUpdateRes = pushRes.replace('has been scheduled','');
            templates.sms_template_message = updateRes;
            templates.push_template_message = pushUpdateRes;
        }else {
            var res = templates.sms_template_message.replace('%s','%s has been updated.');
            var updateRes = res.replace('All the best!',message.nsa19005);
            templates.sms_template_message = updateRes;
        }
    }else if(req.body.count  !== 1 && (req.body.portions.portion_details == ''|| _.isEmpty(req.body.portions.files))){
        var res = templates.sms_template_message.replace('%s','%s has been updated.');
        templates.sms_template_message = res;
    }

var params = { exam_name: req.body.written_exam_name, class: req.body.class_name, subjects: subjects};
templateConverter.buildTemplateObj(templates, params, function(err, result) {
    if (err) {
        callback(err, null);
    } else {
        callback(null, result);
    }
});
};

ExamBase.deleteAttachmentByKey = function(req, data, callback) {
    try {
        var body = req.body;
        var findQuery = getFindQuery(req);
        findQuery.attachments = {'$contains_key': req.body.curentFile};
        models.instance.SchoolExamPortion.find(findQuery, {allow_filtering: true}, function (err, result) {
            callback(err, result)
        });

    } catch (err) {
        callback(err, null);
    }
};

function getFindQuery(req){
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;

    return findQuery;
}
module.exports = ExamBase;