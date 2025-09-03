/**
 * Created by kiranmai on 7/11/17.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    message = require('@nsa/nsa-commons').messages,
    constant = require('@nsa/nsa-commons').constants,
    notificationService = require('../sms/notifications/notification.service'),
    es = require('../../../src/services/search/elasticsearch/elasticsearch.service'),
    logger = require('../../common/logging'),
    _ = require('lodash'),
    nsaElasticSearch = require('@nsa/nsa-elasticsearch'),
    s3 = require('@nsa/nsa-asset').s3,
    multiparty = require('multiparty'),
    excel = require('../../utils/excel'),
    moment = require('moment'),
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    baseService = require('../../services/common/base.service');


exports.getMarkSheetByClassAndSec = function (req, res) {
    nsaCassandra.Marks.getMarkDetailsByClassAndSec(req, function (err, result) {
        if(err) {
            logger.debugLog(req, 'Get MarkSheet by class and section ', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
        } else {
            emitResponse(result, req, res);
        }
    });
};


function constructMarklistPrintDetailObj(req, data, callback) {
    nsaCassandra.Marks.getMarkDetailsByClassAndSec(req, function (err, result) {
        data.marklist = result;
        callback(err, req, data);
    });
};
exports.constructMarklistPrintDetailObj = constructMarklistPrintDetailObj;


function constructGradeMarklistPrintDetailObj(req, data, callback) {
    nsaCassandra.Grades.getSchoolGradeDetails(req, function(err, result) {
        data.grades = _.orderBy(result, 'cgpa_value', 'desc');
        //data.grades = result;
        callback(err, req, data);
    });
};
exports.constructGradeMarklistPrintDetailObj = constructGradeMarklistPrintDetailObj;


exports.getPrintProgressCardReport = function(req, res) {
    var data = {};
    async.waterfall(
        [
            constructMarklistPrintDetailObj.bind(null, req, data),
            constructGradeMarklistPrintDetailObj.bind(),
            getAcademicYearDetails.bind(),
            nsaCassandra.Attendance.getDetailsByClassAndSecPrintProgressCard.bind(),
            getAttendanceHistoryObj.bind(),
            async.apply(getUsersByClassSection.bind(), req),
            constructUserObj.bind(),
            _generateReports.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildStudentErrResponse(err, message.nsa5004));
            } else {
                res.set({
                    'Content-type': 'application/pdf',
                    'Content-Length': result.pdf.length
                });
                events.emit('JsonResponse', req, res, result);

            }
        }
    );
};


function constructUserObj(req, data, callback) {
    var student_info = [];
    var finalJson = {};
    console.log("data.marklist", data.marklist);
    try {
        _.forEach(data.marklist, function(result, key) {
            var userData = _.filter(data.users, {user_name: result.userName});
            var attendance = _.filter(data.attendance, {userName: result.userName});
            var schoolName = "";
            var fatherName = "";
            var Info = {};
            var attendObj = {};
            var profile_picture = null;
            if(!_.isEmpty(attendance)) {
                attendObj.term = req.body.termName;
                var startDate = moment(req.query.startDate).format('MMMM')
                var endDate = moment(req.query.endDate).format('MMMM')
                console.log("startdate", req.query.startDate)
                console.log("enddate", req.query.startDate)
                attendObj.duration = startDate + ' to ' + endDate;
                attendObj.workingDays = attendance[0].totalDays;
                attendObj.daysPresent = attendance[0].present;
                attendObj.percentage = attendance[0].percent;
                Info.Attendance = [attendObj];
            } else {
                Info.Attendance = [];
            }
            if(!_.isEmpty(userData)) {
                schoolName = userData[0].schoolName != undefined ? userData[0].schoolName : " Petit ";
                fatherName = userData[0].parentInfo.father_name != undefined ? userData[0].parentInfo.father_name : " - ";
                profile_picture = userData[0].profile_picture!= undefined ? global.config.aws.s3AccessUrl +  userData[0].schoolId  + "/" +  (userData[0].profile_picture).replace(/ /g,"+") : null;
            }
            Info.schoolName = schoolName;
            Info.academicYear = result.academicYear != undefined ? result.academicYear : " - ";
            Info.writtenExamName = result.writtenExamName != undefined ? result.writtenExamName : " - ";
            Info.fatherName = fatherName;
            Info.firstName = result.firstName != undefined ? result.firstName : " - ";
            Info.className = result.className != undefined ? result.className : " - ";
            Info.sectionName = result.sectionName != undefined ? result.sectionName : " - ";
            Info.remark = result.remark != undefined ? result.remark : " - ";
            Info.profile_picture = profile_picture;
            Info.subjectMarkDetails = result.subjectMarkDetails != undefined ? result.subjectMarkDetails : " - ";
            Info.remark = result.remark != undefined ? result.remark : " - ";
            Info.classTeacherSign = result.classTeacherSign != undefined ? result.classTeacherSign : "Class Teacher Sign";
            Info.motherSign = result.motherSign != undefined ? result.motherSign : "Mother's Sign";
            Info.fatherSign = result.fatherSign != undefined ? result.fatherSign : "Father's Sign";
            Info.principalSign = result.principalSign != undefined ? result.principalSign : "Principal Sign";
            console.log("JSON.parse(JSON.stringify(data.grades))", JSON.parse(JSON.stringify(data.grades)));
            Info.grade = JSON.parse(JSON.stringify(data.grades));
            student_info.push(Info);
        })
        finalJson.Info = student_info
        callback(null, finalJson);
    } catch (err) {
        console.log(err)
        callback(err, finalJson);
    }
    /* _.forEach(data.grades, function(result, key) {
     result = JSON.stringify(result);
     var value = [result];
     Info.grade = value != undefined ? value : " - ";

     });*/
}
exports.constructUserObj = constructUserObj;

function _generateReports(params, callback) {
    try {
        var jasper = require('perfx-node-jasper')({
            path: path.join(__dirname , '/../../../node_modules/perfx-node-jasper/lib/jasperreports-6.4.3/'),
            reports: {
                stock_ofertas: {
                    jasper: path.join(__dirname , '../../common/student-marklist/multi-marklist.jasper'),
                    jrxml: path.join(__dirname , '../../common/student-marklist/multi-marklist.jrxml'),
                    conn: 'in_memory_json'
                }
            }
        });
        jasper.ready(function() {
            var r = jasper.export(
                {
                    report: 'stock_ofertas',
                    data: {},
                    dataset: params
                },
                'pdf'
            );
            params.pdf = r;
            callback(null, params);
        });


    } catch (err) {
        callback(err, null)

    }

}

function getAttendancewithMarkSheet(req, res) {
    async.waterfall([
        nsaCassandra.Marks.getMarkDetailsByClassAndSec.bind(null, req),
        async.apply(getAcademicYearDetails, req),
        nsaCassandra.Attendance.getDetailsByClassAndSecPrintProgressCard.bind(),
        getAttendanceHistoryObj.bind(),
        async.apply(getUsersByClassSection.bind(), req)
    ], function(err, result){
        if(err) {
            logger.debugLog(req, 'Get MarkSheet', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
        } else if (!_.isEmpty(result.marks)) {
            emitResponse1(result, req, res);
        } else {
            buildUserMarksListObj(req, res);
        }
    })
};
exports.getAttendancewithMarkSheet =  getAttendancewithMarkSheet;


function getAcademicYearDetails(req, data, callback) {
    nsaCassandra.Academics.getAcademicYear(req, function(err, result) {
        data.academicYear = result;
        callback(err, req, data);
    })
};

function getUsersByClassSection(req, data, callback) {
    var params = req.params;
    params.size = constant.DEFAULT_PARAM_SIZE;
    es.getUsersByClassSec(req, params, function(err, result){
        data.users = result;
        callback(err, req, data)
    })
};

function getAttendanceHistoryObj(data, callback) {
    nsaCassandra.Attendance.getAttendanceHistoryObjs(data, function(err, result){
        console.log("result", result);
        data.attendance = result;
        callback(err, data);
    })
};
exports.getAttendanceHistoryObj = getAttendanceHistoryObj;

function buildUserMarksListObj(req, res) {
    var params = req.params;
    params.size = constant.DEFAULT_PARAM_SIZE;
    async.parallel({
        users: es.getUsersByClassSec.bind(null, req, params),
        examSchedule: nsaCassandra.Exam.getExamSchedule.bind(null, req)
    }, function (err, result) {
        if (err) {
            logger.debugLog(req, 'Get Students for MarkSheet ', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
        } else {
            saveMarkSheet(req, result, function (err, data) {
                if (err) {
                    logger.debugLog(req, 'Generate MarkSheet objects for All Students', err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
                } else if (_.isEmpty(data)) {
                    events.emit('JsonResponse', req, res, []);
                } else {
                    getMarkSheet(req, res);
                }
            });
        }
    })
};
exports.buildUserMarksListObj = buildUserMarksListObj;

function getMarkSheet(req, res) {
    nsaCassandra.Marks.getMarkDetailsByClassAndSec(req, function (err, result) {
        if(err) {
            logger.debugLog(req, 'Get MarkSheet', err);
            events.emit('ErrorJsonResponse',

                req, res, buildErrResponse(err, message.nsa18001));
        } else if (!_.isEmpty(result)) {
            emitResponse(result, req, res);
        } else {
            buildUserMarksListObj(req, res);
        }
    })
};
exports.getMarkSheet =  getMarkSheet;

function getMarkSheetTermId(req, res) {
    nsaCassandra.Marks.getMarkDetailsByClassAndSec(req, function (err, result) {
        if(err) {
            logger.debugLog(req, 'Get MarkSheet', err);
            events.emit('ErrorJsonResponse',

                req, res, buildErrResponse(err, message.nsa18001));
        } else if (!_.isEmpty(result)) {
            emitResponse(result, req, res);
        } else {
            buildUserMarksListObj(req, res);
        }
    })
};
exports.getMarkSheetTermId =  getMarkSheetTermId;

exports.uploadMarkSheet = function (req, res) {
    nsaCassandra.Marks.getMarkDetailsByClassAndSec(req, function (err, result) {
        if(err) {
            logger.debugLog(req, 'Get MarkSheet', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa18009});
        } else {
            var params = req.params;
            params.size = constant.DEFAULT_PARAM_SIZE;
            async.parallel({
                users: es.getUsersByClassSec.bind(null, req, params),
                examSchedule: nsaCassandra.Exam.getExamSchedule.bind(null, req)
            }, function (err, result) {
                if (err) {
                    logger.debugLog(req, 'Get Students for MarkSheet ', err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
                } else if(_.isEmpty(result.examSchedule.schedule)){
                    events.emit('ErrorJsonResponse', req, res, {message: message.nsa18010});
                } else {

                    getExcel(req, function (worksheet, name, workbook) {
                        var validate = validationExcel(req, result, worksheet);
                        if (validate) {
                            result.worksheet = worksheet;
                            result.workbook = workbook;
                            result.name = name;
                            async.waterfall([
                                getS3AccessBaseUrl.bind(null,req, result),
                                UploadMarklistInS3.bind(),
                                importMarksheetFromXlsx.bind()
                            ], function(err, result1){
                                if (err) {
                                    logger.debugLog(req, 'Generate MarkSheet objects for All Students', err);
                                    events.emit('ErrorJreq, filename, uploadid, cbsonResponse', req, res, buildErrResponse(err, message.nsa18001));
                                } else {
                                    events.emit('JsonResponse', req, res, message.nsa18002);
                                }
                            })
                        } else {
                            events.emit('ErrorJsonResponse', req, res,  {message: message.nsa18008});
                        }
                    });
                }
            })
        }
    })
}

function getS3AccessBaseUrl(req, data, callback){
    nsaCassandra.Feature.getFeatureDetails(req, function(err, featureResult) {
        var assetUrl = featureResult.asset_url;
        req.headers.basepath = assetUrl;
        callback(err, req, data);
    })
};

function UploadMarklistInS3(req, data, callback){
    data.workbook.xlsx.writeBuffer().then(function (buffer) {
        s3.uploadFile(req, buffer, data.name, req.params.id, function (err, uploadUrl) {
            data.uploadUrl = uploadUrl;
            callback(err, req, data);
        });
    })
}


function importMarksheetFromXlsx(req, data, callback) {
    var users = data.users;
    if(!_.isEmpty(users)) {
        async.waterfall(
            [
                constructMarklistObj.bind(null, req, data),
                getSchoolGradingDetails.bind(),
                constructMarklistDetailFromXls.bind(),
                insertAuditLog.bind(),
                executeBatch.bind()
            ],
            function (err, data2) {
                if(err) {
                    logger.debugLog(req, 'Failed to save initial marklist and details from excel ', err);
                    callback(err, []);
                } else {
                    saveMarksObjInES(req, data2, function (err, result) {
                        callback(err, result, data);
                    });
                }
            }
        );
    } else {
        callback(null, []);
    }
};

function constructMarklistDetailFromXls(req, data, callback) {
    nsaCassandra.Base.marksbase.constructMarklistDetailFromXls(req, data, function(err, result) {
        callback(err, req, result);
    });
}

function validationExcel(req, data, worksheet) {
    var examSchedule = data.examSchedule.schedule;
    var lastColumn = 3 + examSchedule.length;
    var wsScheduleId = worksheet.getRow(2).getCell(lastColumn).value;
    var wsClassId = worksheet.getRow(3).getCell(lastColumn).value;
    var wsSectionId = worksheet.getRow(4).getCell(lastColumn).value;

    var userNameColumn = worksheet.getColumn(lastColumn), userNames = [];
    userNameColumn.eachCell(function(cell, rowNumber) {
        if (rowNumber > 6 && rowNumber <= worksheet.lastRow._number) {
            userNames.push(cell.value);
        }
    });

    return req.params.id === wsScheduleId &&
        req.params.classId === wsClassId &&
        req.params.sectionId === wsSectionId &&
        data.users.length + 6 === worksheet.lastRow._number &&
        _.uniq(userNames).length === userNames.length;
}

function getExcel(req, cb) {
    var form = new multiparty.Form();
    form.on('field', function(name, value) {
        if (name === 'path') {
            // destPath = value;
        }
    });
    form.on('part', function(part) {
        part.name = part.filename;
        excel.getWorkSheet(part, function(worksheet, workbook) {
            cb(worksheet, part.name, workbook);
        });
    });
    form.parse(req);
};

function generateMarkSheet(req, res) {
    nsaCassandra.Marks.getMarklist(req, function (err, result) {
        if(err) {
            logger.debugLog(req, 'Get MarkSheet', err);
            events.emit('ErrorJsonResponse',
                req, res, buildErrResponse(err, message.nsa18001));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse',req, res, {message: message.nsa18009});
        } else {
            generateExcelSheet(req, res);
        }
    })
};
exports.generateMarkSheet =  generateMarkSheet;

function generateExcelSheet(req, res) {
    var params = req.params;
    params.size = constant.DEFAULT_PARAM_SIZE;
    async.parallel({
        users: es.getUsersByClassSec.bind(null, req, params),
        examSchedule: nsaCassandra.Exam.getExamSchedule.bind(null, req)
    }, function (err, result) {
        if (err) {
            logger.debugLog(req, 'Get Students for MarkSheet ', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
        } else if(_.isEmpty(result.examSchedule.schedule)){
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa18010});
        } else {
            var sectionId = params.sectionId;
            var workbook = excel.createWorkBook(req, result);
            var worksheet = excel.createWorkSheet(workbook,
                result.examSchedule.class_name +  ' - ' + result.examSchedule.sections[sectionId] );
            var row1 = worksheet.addRow([]);
            row1.height = 80;
            worksheet.mergeCells('A1:K1');
            var warningCell = row1.getCell(1);
            warningCell.value = message.nsa18011;
            warningCell.alignment = { wrapText: true };
            warningCell.font = {size: 16, bold:true, color: {"argb": "FFC0000" } };
            warningCell.fill = excel.fills.solidYellow;
            addTitle(worksheet, result.examSchedule, sectionId);
            worksheet.getColumn(1).width = 30;
            addStudents(worksheet, result);
			var sectionName = result.examSchedule.sections[params.sectionId];
            var name = result.examSchedule.written_exam_name + '-' + result.examSchedule.class_name + '-'+ sectionName;
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'EFILENAME' : name + '.xlsx',
                'Access-Control-Expose-Headers': 'EFILENAME',
                'Content-Disposition': 'attachment; filename=' + name + '.xlsx'
            });
            workbook.xlsx.write(res).then(function() {
                res.end();
            });
        }
    })
}


function addTitle(worksheet, examSchedule, sectionId) {
    var examRow = worksheet.addRow(['Exam', examSchedule.written_exam_name]); //2,1
    applyTitleStyle(examRow.getCell(1));
    applyCellStyle(examRow.getCell(2));
    examRow.getCell(examSchedule.schedule.length + 3).value = examSchedule.exam_schedule_id; //(2, examSchedule.schedule.length + 3)

    var classRow = worksheet.addRow(['Class', examSchedule.class_name]); //3,1
    applyTitleStyle(classRow.getCell(1));
    applyCellStyle(classRow.getCell(2));
    classRow.getCell(examSchedule.schedule.length + 3).value = examSchedule.class_id; //3, examSchedule.schedule.length + 3

    var sectionRow = worksheet.addRow(['Section', examSchedule.sections[sectionId]]); //4
    applyTitleStyle(sectionRow.getCell(1));
    applyCellStyle(sectionRow.getCell(2));
    sectionRow.getCell(examSchedule.schedule.length + 3).value = sectionId;
}

function applyTitleStyle(cell) {
    cell.style.font = excel.fonts.arialBlackUI12;
    cell.style.alignment = excel.alignments.right;
}

function applyCellStyle(cell) {
    cell.style.font = excel.fonts.arial12;
    cell.style.alignment = excel.alignments.left;
}

function addStudents(worksheet, data) {
    data.users = _.sortBy(data.users, [user=>user.firstName.toLowerCase()]);
    var rowHidden = worksheet.addRow([]),
        rowHeader = worksheet.addRow(['Name']),
        schedules = data.examSchedule.schedule,
        subjects = [] ;

    rowHidden.getCell(1).value = schedules.length;
    _.forEach(schedules, function(subject, key) {
        subjects.push(subject.subject_name);
        rowHidden.getCell(key+2).value = subject.subject_id; //5
        rowHeader.getCell(key+2).value = subject.subject_name + ' (' + subject.mark  + ')'; //6  .string('Name')
    });
    var totMarks = _.map(data.examSchedule.schedule, function(value){return value.mark});
    rowHeader.getCell(schedules.length + 2).value = 'Total' + ' ('+ _.sum(totMarks) + ')'; //6, schedules.length + 2
    rowHeader.getCell(schedules.length + 3).value = 'User Name'; //6, schedules.length + 3
    rowHeader.getCell(schedules.length + 4).value = 'Code';  //6, schedules.length + 4
    rowHeader.getCell(schedules.length + 5).value = 'Phone';  //6, schedules.length + 5

    _.forEach(data.users, function(user, key) {
        var row = worksheet.addRow([user.firstName]); //7+key
        row.getCell(schedules.length + 3).value = user.userName;
        row.getCell(schedules.length + 4).value = user.userCode;
        row.getCell(schedules.length + 5).value = user.primaryPhone;


        var formula = '';
        _.forEach(schedules, function(subject, key) {
            var currentCell = row.getCell(key+2);
            currentCell.value = 0;
            formula += currentCell._address  + '+';
            currentCell.dataValidation = {
                type: 'decimal',
                operator: 'between',
                allowBlank: false,
                showErrorMessage: true,
                formulae: [0, subject.mark],
                errorStyle: 'stop',
                errorTitle: 'Invalid Mark',
                error: 'Please enter the marks must between 0 and ' + subject.mark
            };
        });
        row.getCell(schedules.length + 2).value = { formula: formula.substr(0, formula.length - 1), result: 0};
    });

    rowHeader.eachCell(function(cell, colNumber) {
        cell.style.font = excel.fonts.arialWhiteUI12;
        cell.style.alignment = excel.alignments.left_top;
        cell.fill = excel.fills.solidBlack;
    });

    rowHidden.hidden = true;
    worksheet.getColumn(schedules.length + 3).hidden = true;
    worksheet.getColumn(schedules.length + 4).hidden = true;
    worksheet.getColumn(schedules.length + 5).hidden = true;
}

function emitResponse(result, req, res) {
    buildResponse(result, function (err, data) {
        if (err) {
            logger.debugLog(req, 'No existing markSheet for class and section ', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    })
};
exports.emitResponse = emitResponse;

function emitResponse1(result, req, res) {
    var data = {};
    buildResponse(result.marks, function (err, response) {
        if (err) {
            logger.debugLog(req, 'No existing markSheet for class and section ', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
        } else {
            data.marks = response;
            data.attendance = result.attendance;
            data.users = result.users;
            events.emit('JsonResponse', req, res, data);
        }
    })
};

function saveMarkSheet(req, data, callback) {
    var users = data.users;
    if(!_.isEmpty(users)) {
        async.waterfall(
            [
                constructMarklistObj.bind(null, req, data),
                getSchoolGradingDetails.bind(),
                constructMarklistDetailObj.bind(),
                insertAuditLog.bind(),
                executeBatch.bind()
            ],
            function (err, data2) {
                if(err) {
                    logger.debugLog(req, 'Failed to save initial marklist and details  ', err);
                    callback(err, []);
                } else {
                    saveMarksObjInES(req, data2, function (err, result) {
                        callback(err, result, data);
                    });
                }
            }
        );
    } else {
        callback(null, []);
    }

};
exports.saveMarkSheet = saveMarkSheet;

function saveMarksObjInES(req, data, callback) {
    async.waterfall([
        getMarksListDetails.bind(null, req, data),
        buildAssessmentObjs.bind(),
        nsaElasticSearch.index.bulkDoc.bind()
    ], function (err, result) {
        if (err) {
            logger.debugLog(req, 'Failed to save initial marklist and details to ES  ', err);
        }
        callback(err, result);
    })
};
exports.saveMarksObjInES = saveMarksObjInES;

function getMarksListDetails(req, data, callback) {
    nsaCassandra.Marks.getDetailsByMarkslistId(req, data, function (err, result) {
        callback(err, req, result);
    })
};
exports.getMarksListDetails = getMarksListDetails;

function buildAssessmentObjs(req, data, callback) {
    nsaCassandra.UserJson.buildAssessmentObjs(req, data, function(err, result) {
        callback(err, {body: result});
    });
};
exports.buildAssessmentObjs = buildAssessmentObjs;

function buildResponse(result, callback) {
    try {
        var users = [];
        var headings = [];
        var count = 0;
        if(!_.isEmpty(result)) {
            headings.push({label: "Name", name: "firstName", priority: 0});
            _.forEach(result, function (user, key1) {
                var maxMarkObject = {}
                var subjectObj = {};
                var subLabel = {};
                var subjectMarkDetailObjs = [];
                var subjectTotal = 0;
                var total = 0;
                var subMarkObjs = user.subjectMarkDetails;
                 user.totalMarks = nsaCassandra.Base.baseService.convertToTwoDecimal(user.totalMarks);
                for (var i=0; i<subMarkObjs.length; i++) {
                    var subObj = {};
                    var headingObj = {};
                    var label = subMarkObjs[i].subject_name + '(' +subMarkObjs[i].max_marks+ ')';
                    if (count == 0) {
                        headingObj.label = label
                        headingObj.name = subMarkObjs[i].subject_name;
                        headingObj.priority = i + 1;
                    }
                    total = total + subMarkObjs[i].max_marks;
                    maxMarkObject[label] = subMarkObjs[i].max_marks;
                    var marksObtained = isNaN(parseFloat(subMarkObjs[i].marks_obtained)) ? 0 : parseFloat(subMarkObjs[i].marks_obtained);
                    subjectTotal = subjectTotal + marksObtained;

                    subObj[subMarkObjs[i].subject_name] = subMarkObjs[i].marks_obtained || 0;
                    subObj['subjectId'] = subMarkObjs[i].subject_id;
                    subObj['subjectName'] = subMarkObjs[i].subject_name;
                    subObj['marksObtained'] = subMarkObjs[i].marks_obtained;
                    subObj['maxMarks'] = subMarkObjs[i].max_marks;

                    subLabel[subMarkObjs[i].subject_name] = subMarkObjs[i].marks_obtained || 0;
                    subLabel["Total"] = nsaCassandra.Base.baseService.convertToTwoDecimal(subjectTotal);
                    subLabel["maxTotal"] = total;
                    subjectMarkDetailObjs.push(subObj);
                    if (count == 0) {
                        headings.push(headingObj);
                    }

                }
                if (count == 0) {
                    headings.push({label: "Total(" +total+ ")", name: "Total", priority: subMarkObjs.length + 1});
                }
                user.maxMarkObject = maxMarkObject;
                count ++;
                subjectObj.userSubMarkDetails = subjectMarkDetailObjs;
                subjectObj.subjects = subLabel;
                users.push(_.assign(user, subjectObj));

            });
        }
        var data = {headings: _.flatten(headings), users: users};
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};
exports.buildResponse = buildResponse;

exports.getMarklist = function(req, res) {
    try {
        nsaCassandra.Marks.getMarklist(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get Marklist Details ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get Marklist Details', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
    }
};

exports.getMarklistDetailsById = function(req, res) {
    try {
        nsaCassandra.Marks.getMarklistDetailsById(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get Marklist Details ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get Marklist Details', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
    }
};

exports.saveUploadedMarks = function(req, res) {
    async.waterfall(
        [
            constructMarklistObj.bind(null, req),
            constructMarklistDetailObj.bind(),
            insertAuditLog.bind(),
            executeBatch.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debugLog(req, 'Save Marklist Upload', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18003));
            } else {
                events.emit('JsonResponse', req, res, {message: message.nsa18002});
            }
        }
    );
};

exports.updateMarks = function(req, res) {
    async.waterfall([
        getSchoolGradingDetails.bind(null, req, []),
        nsaCassandra.Base.marksbase.updateMarklistDetailObj.bind()
    ], function(err, result) {
        if (err) {
            logger.debugLog(req, 'Save Marklist Upload', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18003));
        } else {
            async.waterfall([
                nsaCassandra.Marks.getMarksDetails.bind(null, req, result),
                buildAssessmentObj.bind(),
                nsaElasticSearch.index.bulkDoc.bind()
            ], function (err, result) {
                if (err) {
                    logger.debugLog(req, 'Upadte Marklist Details', err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18003));
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa18002});
                }
            })
        }
    });
};

function buildAssessmentObj(req, data, callback) {
    nsaCassandra.UserJson.buildAssessmentObj(req, data, function(err, result) {
        callback(err, result);
    });
};
exports.buildAssessmentObj = buildAssessmentObj;

exports.publishUploadedMarks = function(req, res) {
    nsaCassandra.Marks.getMarklistById(req, function (err, result) {
        if(err) {
            logger.debugLog(req, 'Publish Marklist', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18007));
        } else if (!_.isEmpty(result)) {
            async.waterfall([
                updateMarklistStatus.bind(null, req),
                updateMarklistDetailsStatus.bind(),
                insertAuditLog.bind(),
                executeBatch.bind()
            ], function(err, result) {
                if (err) {
                    logger.debugLog(req, 'Publish Marklist', err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18007));
                } else {
                    sendNotification(req, function (err1, data) {
                        if (err1) {
                            logger.debugLog(req, 'Publish Marklist', err1);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa18007));
                        } else {
                            events.emit('JsonResponse', req, res, {message: message.nsa18006});
                        }
                    });
                }
            });
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa18001});
        }
    });
};

function sendNotification(req, callback) {
    async.waterfall([
            getUpdatedUsers.bind(null, req),
            getMarklistTemplate.bind(),
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
exports.sendNotification = sendNotification;

function getUpdatedUsers(req, callback) {
    var data = [];
    data['userNames'] = _.map(req.body, 'userName');
    async.parallel({
        usersByUsername: es.getUsersByLists.bind(null, req, data)
    }, function(err, result) {
        data['users'] = _.map(result.usersByUsername, function(obj) {
            return _.merge(obj, _.find(req.body, {
                userName: obj.userName
            }));
        });
        callback(err, req, data);
    });
};
exports.getUpdatedUsers = getUpdatedUsers;

function getMarklistTemplate(req, users, callback) {
    var data = {action: constant.CREATE_ACTION, userType: constant.STUDENT};
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getMarklistTemplate = getMarklistTemplate;

function getTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.marksbase.getTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getTemplateObj = getTemplateObj;

function buildFeatureNotificationObj(req, users, templateObj, callback) {
    var body = req.body || [];
    req.body.notifyTo = { status: 'Sent' };
    req.body.object_id = req.params.id;
    req.body.notify = body.length > 0 ? body[0].notify : {sms: false, email: false, push: false};
    users['students'] = users.users;
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        notificationObj.isDetailedNotification = true;
        notificationObj.replacementKeys = ['examName', constant.FIRST_NAME, 'subMarks'];
        notificationObj = getSubMarksTemplateString(req, notificationObj);
        callback(err, req, notificationObj);
    })
};
exports.buildFeatureNotificationObj = buildFeatureNotificationObj;

function getSubMarksTemplateString(req, notificationObj) {
    var body = req.body;
    var obj = {};
    _.forEach(body, function (object, key) {
        var maxTotal = 0;
        var subLists = object.subjectMarkDetails;
        var subMarks = [];
        _.forEach(subLists, function (value, key) {
            subMarks.push(value.subject_name + ':' + value.marks_obtained);
            maxTotal = maxTotal + value.max_marks;
        })
        var subTotal = object.totalMarks || 0;
        subMarks.push('Total :' + subTotal + '/' + maxTotal);
        obj[object.primaryPhone] = {examName: object.writtenExamName, subMarks: subMarks.toString()};
    });

    notificationObj.replacementMsgs = obj;
    return notificationObj;
};

function updateMarklistStatus(req, callback) {
    nsaCassandra.Base.marksbase.updateMarklistStatus(req, function(err, data) {
        data.features = {actions : constant.UPDATE, featureTypeId : data.mark_list_id};
        callback(err, req, data);
    })
};
exports.updateMarklistStatus = updateMarklistStatus;

function updateMarklistDetailsStatus(req, data, callback) {
    nsaCassandra.Base.marksbase.updateMarklistDetailsStatus(req, data, function(err, data) {
        callback(err, req, data);
    })
};
exports.updateMarklistDetailsStatus = updateMarklistDetailsStatus;

exports.updateUploadedMarks = function(req, res) {
    async.waterfall(
        [
            marklistUpdateObj.bind(null, req),
            marklistDetailUpdateObj.bind(),
            insertAuditLog.bind(),
            executeBatch.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debugLog(req, 'Save Marklist Upload', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18003));
            } else {
                events.emit('JsonResponse', req, res, {message: message.nsa18002});
            }
        }
    );
};

exports.deleteMarklist = function(req, res) {
    async.waterfall(
        [
            marklistDeleteObj.bind(null, req),
            findDetailsByMarklistId.bind(),
            MarklistDetailDeleteObj.bind(),
            insertAuditLog.bind(),
            executeBatch.bind()
        ],
        function (err, data) {
            if (err) {
                logger.debugLog(req, 'Delete Marklist', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18004));
            } else {
                var detailsIds = _.map(data.marklistObjs, 'mark_list_detail_id');
                es.getMarksDeleteQuery(req, detailsIds, function (err, result) {
                    if (err) {
                        logger.debugLog(req, 'Delete Marklist', err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18004));
                    } else {
                        events.emit('JsonResponse', req, res, {message: message.nsa18005});
                    }
                })
            }
        }
    );
};

exports.getUserMarksDetails = function(req, res) {
    try {
        nsaCassandra.Marks.getUserMarksDetails(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get Marklist Details ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
            } else {
                buildUserMarkObj(result, function (err, data) {
                    if (err) {
                        logger.debugLog(req, 'Get Marklist Details ', err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
                    } else {
                        events.emit('JsonResponse', req, res, data);
                    }
                })
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get Marklist Details', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
    }
};

exports.getMarksStatistics = function(req, res) {
    async.waterfall([
        getSchoolGradeDetails.bind(null, req),
        getTotalMarksStatistics.bind()
    ], function (err, result) {
        if (err) {
            logger.debugLog(req, 'Get Marklist Details ', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
        } else {
            buildMarkStatisticsObj(req, result, function (err, data) {
                if (err) {
                    logger.debugLog(req, 'Get Marklist Details ', err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
                } else {
                    events.emit('JsonResponse', req, res, data);
                }
            })
        }
    })
};

function getSchoolGradeDetails(req, callback) {
    var data = {};
    nsaCassandra.Grades.getSchoolGradeDetails(req, function (err, result) {
        data['grades'] = result;
        callback(err, req, data)
    });
};
exports.getSchoolGradeDetails = getSchoolGradeDetails;

function getTotalMarksStatistics(req, data, callback) {
    es.getTotalMarksStatistics(req, data, function (err, result) {
        data['marksStats'] = result;
        callback(err, data)
    });
};
exports.getTotalMarksStatistics = getTotalMarksStatistics;

function buildMarkStatisticsObj(req, result, callback) {
    var data = {};
    var ranges = [];
    var values = [];
    var rangeObj = [];
    if(!_.isEmpty(result)) {
        var gradeDetails = _.orderBy(result.grades, 'cgpa_value', 'desc');
        var docs = result.marksStats.aggregations.marks_obtained.buckets;
        for(var key in docs) {
            ranges.push(key);
            values.push(docs[key].doc_count);
            rangeObj.push({"key": key, "value": key});
        }
        data = {ranges :ranges, values: values, rangeObj: rangeObj, gradeObj: gradeDetails};
        callback(null, data);
    } else {
        callback(null, result);
    }
};
exports.buildMarkStatisticsObj = buildMarkStatisticsObj;

function getMarksList(req, callback) {
    nsaCassandra.Marks.getMarklistById(req, function (err, result) {
        callback(err, req, result);
    });
};
exports.getMarksList = getMarksList;

exports.getRankDetails = function(req, res) {
    es.getRankDetailObjs(req, function (err, result) {
        if (err) {
            logger.debugLog(req, 'Get Marklist Details ', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
        } else {
            buildRankDetailObjs(result, function (err, data) {
                if (err) {
                    logger.debugLog(req, 'Get Marklist Details ', err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
                } else {
                    events.emit('JsonResponse', req, res, data);
                }
            })
        }
    })
};

function buildRankDetailObjs(data, callback) {
    var result = [];
    var count = 1;
    if(!_.isEmpty(data)) {
        _.forEach(data.hits.hits, function (value, key) {
            var user = value._source;
            var marksObtained = nsaCassandra.Base.baseService.convertToTwoDecimal(user.total_marks_obtained);
            var obj= {};
            obj['user_name'] = user.user_name;
            obj['first_name'] = user.first_name;
            obj['total_marks_obtained'] = marksObtained;
            obj['total_max_marks'] = user.total_max_marks;
            obj['marks_obtained'] = (marksObtained !== null && user.total_max_marks !== null) ? marksObtained + "/" + user.total_max_marks:0;
            obj['total_percentage'] = nsaCassandra.Base.baseService.convertToTwoDecimal((user.total_marks_obtained/user.total_max_marks)*100);
            obj['total_grade_name'] = user.total_grade_name;
            obj['total_cgpa_value'] = nsaCassandra.Base.baseService.convertToTwoDecimal(user.total_cgpa_value);
            obj['rank'] = count;
            result.push(obj);
            count++;
        })
    }
    callback(null, result);
};
exports.buildRankDetailObjs = buildRankDetailObjs;

function buildUserMarkObj(data, callback) {
    if(!_.isEmpty(data)) {
        var subMarkObjs = data.subjectMarkDetails;
        var subjectTotal = 0;
        var total = 0;
        for(var i=0; i<subMarkObjs.length; i++) {
            var marksObtained = nsaCassandra.Base.baseService.convertToTwoDecimal(subMarkObjs[i].marks_obtained);
            subjectTotal += marksObtained;
            total += subMarkObjs[i].max_marks;
        }
        data.subjectTotal = nsaCassandra.Base.baseService.convertToTwoDecimal(subjectTotal);
        data.totalMarks = total;
    }
    callback(null, data);
};
exports.buildUserMarkObj = buildUserMarkObj;

exports.getGradeStatsBySub = function(req, res) {
    async.parallel({
            grades : nsaCassandra.Grades.getSchoolGradeDetails.bind(null, req),
            aggs : es.getMarksStatisticsBySub.bind(null, req)
        }, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get Marklist Details ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
            } else {
                buildGradeStatsObj(result, function (err, data) {
                    if (err) {
                        logger.debugLog(req, 'Get Marklist Details ', err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
                    } else {
                        events.emit('JsonResponse', req, res, data);
                    }
                })
            }
        }
    );
};

function buildGradeStatsObj(result, callback) {
    var data = {};
    var ranges = [];
    var values = [];
    var rangeObj = [];
    var gradeDetails;
    if(!_.isEmpty(result)) {
        gradeDetails = _.orderBy(result.grades, 'cgpa_value', 'desc');
        var aggs = result.aggs.aggregations.nestedDocs.subDetails;
        gradeDetails.forEach(function (grade) {
            var docs = aggs.gradeDetails.buckets;
            var gradeFound = _.find(docs, ["key", grade.grade_name]);
            if(_.isEmpty(gradeFound)) {
                ranges.push(grade.grade_name);
                values.push(0);
                rangeObj.push({"key": grade.grade_name, "value": grade.grade_name});
            } else {
                ranges.push(gradeFound.key);
                values.push(gradeFound.doc_count);
                rangeObj.push({"key": gradeFound.key, "value": gradeFound.key});
            }
        });
        var avgMarkValue = Math.round(aggs.grades_stats.avg);
        var avgGrade = nsaCassandra.Base.baseService.getRangeObj(gradeDetails, avgMarkValue);
        data = { ranges :ranges, values: values, rangeObj: rangeObj, highestScore: nsaCassandra.Base.baseService.convertToTwoDecimal(aggs.grades_stats.max),
            lowestScore:nsaCassandra.Base.baseService.convertToTwoDecimal (aggs.grades_stats.min), avgMark: avgMarkValue, avgGrade: avgGrade.grade_name, gradeObj: gradeDetails
        };
        callback(null, data);
    } else {
        callback(null, result);
    }
};
exports.buildMarkStatisticsObj = buildMarkStatisticsObj;

exports.getRankDetailsBySub = function(req, res) {
    es.getRankDetailBySubObjs(req, function (err, result) {
        if (err) {
            logger.debugLog(req, 'Get Marklist Details ', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
        } else {
            buildSubRankDetailObjs(req, result, function (err, data) {
                if (err) {
                    logger.debugLog(req, 'Get Marklist Details ', err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18001));
                } else {
                    events.emit('JsonResponse', req, res, data);
                }
            })
        }
    })
};

function buildSubRankDetailObjs(req, data, callback) {
    var result = [];
    var count = 1;
    if(!_.isEmpty(data)) {
        _.forEach(data.hits.hits, function (value, key) {
            var user = value._source;
            var subDetails = user.subject_mark_details;
            var subObj = _.find(subDetails, [ 'subject_id', req.params.subId]);
            var obj= {};
            obj['first_name'] = user.first_name;
            obj['sub_marks_obtained'] = nsaCassandra.Base.baseService.convertToTwoDecimal(subObj.marks_obtained);
            obj['sub_max_marks'] = subObj.max_marks;
            obj['grade'] = subObj.grade_name;
            obj['rank'] = count;
            result.push(obj);
            count++;
        })
    }
    callback(null, result);
};
exports.buildRankDetailObjs = buildRankDetailObjs;

function marklistUpdateObj(req, callback) {
    nsaCassandra.Base.marksbase.marklistUpdateObj(req, function(err, data) {
        data.features = {actions : constant.UPDATE, featureTypeId : data.mark_list_id};
        callback(err, req, data);
    })
};
exports.marklistUpdateObj = marklistUpdateObj;

function marklistDetailUpdateObj(req, data, callback) {
    nsaCassandra.Base.marksbase.marklistDetailUpdateObj(req, data, function(err, data) {
        callback(err, req, data);
    })
};
exports.marklistDetailUpdateObj = marklistDetailUpdateObj;

function marklistDeleteObj(req, callback) {
    nsaCassandra.Base.marksbase.marklistDeleteObj(req, function(err, data) {
        data.features = {actions : constant.DELETE, featureTypeId : data.mark_list_id};
        callback(err, req, data);
    })
};
exports.marklistDeleteObj = marklistDeleteObj;

function findDetailsByMarklistId(req, data, callback) {
    nsaCassandra.Marks.getMarklistDetailsById(req, function (err, result) {
        data.marklistObjs = result;
        callback(err, req, data);
    })
};
exports.findDetailsByMarklistId = findDetailsByMarklistId;

function MarklistDetailDeleteObj(req, data, callback) {
    nsaCassandra.Base.marksbase.MarklistDetailDeleteObj(req, data, function(err, data) {
        callback(err, req, data);
    })
};
exports.MarklistDetailDeleteObj = MarklistDetailDeleteObj;

function constructMarklistObj(req, data, callback) {
    nsaCassandra.Base.marksbase.constructMarklistObj(req, data, function(err, data) {
        data.features = {actions : constant.CREATE, featureTypeId : data.mark_list_id};
        callback(err, req, data);
    })
};
exports.constructMarklistObj = constructMarklistObj;

function getSchoolGradingDetails(req, data, callback) {
    nsaCassandra.Grades.getSchoolGradeDetails(req, function (err, result) {
        data['gradeDetails'] = result;
        callback(err, req, data);
    })
};
exports.getSchoolGradingDetails = getSchoolGradingDetails;

function constructMarklistDetailObj(req, data, callback) {
    nsaCassandra.Base.marksbase.constructMarklistDetailObj(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.constructMarklistDetailObj = constructMarklistDetailObj;

function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.insertAuditLog = insertAuditLog;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, data);
    })
};
exports.executeBatch = executeBatch;

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.MARKLIST_DETAILS, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildErrResponse = buildErrResponse;

