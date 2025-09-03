/**
 * Created by Kiranmai A on 4/19/2017.
 */

var baseService = require('../common/base.service')
    , schoolConverter = require('../../converters/school.converter')
    , _ = require('lodash')
    , passwordHash = require('password-hash')
    , async = require('async')
    , models = require('../../models/index');

var School = function f(options) {
    var self = this;
};

School.getSchoolDetails = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = { tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id) };
    models.instance.SchoolDetails.findOne(findQuery, function(err, result){
            callback(err, schoolConverter.schoolObject(result));
        });
};

School.updateSchoolDetailsImages = function(req, callback) {
    var body = req.body;
    var attachments = [];
    var headers = baseService.getHeaders(req);

    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        created_date: req.body.created_date
    };
    if(body.image_url != null) {
        if(body.selectedImageIds != undefined) {
            attachments = removeAttchments(body.selectedImageIds, body.image_url)
        } else {
                attachments = body.image_url;
                attachments.push(body.attachments);
                attachments = _.flatten(attachments)
            }
    } else {
        attachments = body.attachments;
    }
    var attachmentsObj = baseService.getMapFromFormattedMap(attachments);
    var updateSection = {
        image_url: attachmentsObj,
    };


    models.instance.SchoolDetails.update(findQuery, updateSection, function (err, result) {
        callback(err, result)
    });
};


School.getSchoolDetailsForProcessor = function(callback) {
    models.instance.SchoolDetails.find({}, function(err, result){
        callback(err, result);
    });
};

function removeAttchments(selected, attachments) {
    _.forEach(selected, function (val) {
        _.remove(attachments, function(n) {
            return n.id == val;
        });
    })
    return attachments;

}

function membersUpdate(object, tanent, callback){
    var tanentId = models.timeuuidFromString(tanent);
    models.instance.SchoolMembers.update(
        {id: object.id},
        {tenant_id: tanentId},
        function(err, result){
            if(err){
                callback(err, null);
            }else {
                callback(null, result);
            }
        });
};

  var newTanentObj = function(object, data, memberDetails, callback){
     try {
         var userSchoolDetails =  _.find(data.schoolDetails, {'tenant_id': object.tenant_id,'school_id': object.school_id});
         var password =  userSchoolDetails ? userSchoolDetails.password : '1234';
         var uniqId = models.uuid();
         var obj = new models.instance.SchoolMembers ({
             id: uniqId,
             user_name: object.primary_phone,
             first_name: object.first_name,
             tenant_id: object.tenant_id,
             password:  passwordHash.generate(password),
             user_type: "Parent",
             created_date: new Date(),
             updated_date: new Date(),
         });
         obj.save(function (err, result) {
             var newXrefObj = function(obj1, cb){
                 var findQuery = {member_user_name: obj1.member_user_name, member_id: models.uuidFromString(obj1.member_id),
                     user_id: models.uuidFromString(obj1.user_id)
                 };
                 models.instance.SchoolMembersXref.delete(findQuery, function(err1, result1){
                     obj1.id = models.uuid();
                     obj1.member_id = uniqId;
                     obj1.updated_date = new Date();
                     var objXref = new models.instance.SchoolMembersXref(obj1);
                     objXref.save(function(err2, result2){
                         cb(err, result2);
                     })
                 })
             };

              var memberXrefRecords = _.filter(memberDetails, 'tenant_id');
             async.times(memberXrefRecords.length, function (i, next) {
                 var obj = memberXrefRecords[i];
                 newXrefObj(obj, function (err, newResult) {
                     next(err, newResult);
                 });
             }, function (err, xrefs) {
                 callback(null, xrefs)
             });
         })
     }catch (err){
         callback(err, null)
     }
  };

School.updateTanentId = function(data, callback){
    try {
        var createObj = function(object, callback) {
            var memberDetails = _.filter(data.MembersXref, {'member_id': object.id});
             var tanents = _.groupBy(memberDetails, 'tenant_id');
            var size = _.size(tanents);
            if(size.length > 1){
                var tanentId = _.map(tanents, function(val, key){return key});
                membersUpdate(object, tanentId[0], function(err, result){
                    var newTenantIds = _.filter(memberDetails, function(o){return o.tenant_id.toString() !== tanentId[0]});
                     newTenantIds = _.uniq(newTenantIds);
                    async.times(newTenantIds.length, function (i, next) {
                        var obj = newTenantIds[i];
                        newTanentObj(obj, data, memberDetails, function (err, newResult) {
                            next(err, newResult);
                        });
                    }, function (err, Objs) {
                        callback(null, Objs)
                    });

                })
            }else {
                var tanentId = _.map(tanents, function(val, key){return key});
                membersUpdate(object, tanentId[0], function(err, result){
                    callback(err, result)
                })
            }
        };


        var Members = data.Members;
        async.times(Members.length, function (i, next) {
            var obj = Members[i];
            createObj(obj, function (err, data) {
                next(err, data);
            });
        }, function (err, Objs) {
            callback(null, Objs)
        });
    }catch (err){
        callback(err, null)
    }
}


module.exports = School;