var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    timetableService = require('../../services/timetable/timetable.service'),
    eventsService = require('../../services/events/events.service'),
    examsService = require('../../services/exam/exam.service'),
    dateUtils = require('@nsa/nsa-commons').dateUtils,
    dateService = require('../../utils/date.service.js'),
    logger = require('../../common/logging'),
    assignmentService = require('../../services/assignments/assignments.service'),
    moment = require('moment');

var successCode = '#43A047';
var dangerCode = '#D32F2F';
var info = '#00ACC1';

var eventsColor = '#56CECA';
var holidayColor = '#FFC300';
var leaveColor = '#0cd63b';
var examsColor = '#7CD185'

var attendance = [
    {
        title: 'Leave',
        start: '2017-04-02T08:00:00',
    },
    {
        title: 'Leave',
        start: '2017-04-02',
        color: info,
        allDay: true
    },
    {
        title: 'Absent',
        start: '2017-04-03',
        allDay: true,
        editable: false,
        color: dangerCode
    },
    {
        title: 'Present',
        start: '2017-04-04',
        allDay: true,
        color: successCode
    },
    {
        title: 'Present',
        start: '2017-04-05',
        allDay: true,
        color: successCode
    },
    {
        title: 'Present',
        start: '2017-04-06',
        allDay: true,
        color: successCode
    },
    {
        title: 'Present',
        start: '2017-04-08',
        allDay: true,
        color: successCode
    },
    {
        title: 'Present',
        start: '2017-04-07',
        allDay: true,
        color: successCode
    }

];

var slots = [
    {start: '08:00', end: '08:45', label: 'period 1', periodId: "asczasfczszfcsfcsdxzcsdxzc", days: [1,2,3,4,5,6]},
    {start: '08:45', end: '09:30', label: 'period 1', periodId: "asczasfczszfcsfcsdxzcsdxzc"},
    {start: '09:45', end: '10:30', label: 'period 1', periodId: "asczasfczszfcsfcsdxzcsdxzc"},
    {start: '10:30', end: '11:15', label: 'period 1', periodId: "asczasfczszfcsfcsdxzcsdxzc"},
    {start: '11:15', end: '12:00', label: 'period 1', periodId: "asczasfczszfcsfcsdxzcsdxzc"},
    {start: '13:00', end: '13:45', label: 'period 1', periodId: "asczasfczszfcsfcsdxzcsdxzc"},
    {start: '13:45', end: '14:30', label: 'period 1', periodId: "asczasfczszfcsfcsdxzcsdxzc"},


]

var timetable = [
    {
        title: 'peroid 1',
        start: '2017-04-10T08:00:00',
        end: '2017-04-10T08:45:00'
    },
    {
        title: 'peroid 2',
        end: '2017-04-10T09:30:00',
        start: '2017-04-10T08:45:00'
    },
    {
        title: 'mor break',
        start: '2017-04-10T09:30:00',
        end: '2017-04-10T09:45:00'
    },
    {
        title: 'period 3',
        end: '2017-04-10T10:30:00',
        start: '2017-04-10T09:45:00'
    },
    {
        title: 'period 4',
        start: '2017-04-10T10:30:00',
        end: '2017-04-10T11:15:00'
    }
    ,
    {
        title: 'period 5',
        end: '2017-04-10T12:00:00',
        start: '2017-04-10T11:15:00'
    },
    {
        title: 'period 6',
        start: '2017-04-10T13:00:00',
        end: '2017-04-10T13:45:00'
    },
    {
        title: 'period 7',
        end: '2017-04-10T14:30:00',
        start: '2017-04-10T13:45:00'
    }
    ,
    {
        title: 'Lunch Break',
        start: '2017-04-10T12:00:00',
        end: '2017-04-10T13:00:00'
    }

];

var test2 = [
    {
        title: 'OUTING',
        start: '2017-04-04',
        end: '2017-04-05',
        className: 'bg-danger'
    },
    {
        title: 'Meeting',
        start: '2017-04-03T10:30:00',
        end: '2017-04-03T12:30:00'
    }
];

exports.getDashboardInfo = function(req, res) {
    events.emit('JsonResponse', req, res, {name : 'Dashboard'});
};

exports.getDashboardNotifications = function(req, res) {
    events.emit('JsonResponse', req, res, {name : 'Dashboard-Notifications'});
};

exports.getDashboardAttendance = function(req, res) {
    events.emit('JsonResponse', req, res, {eleAttr: '.fullcalendar', slots: slots, events: attendance});
};

exports.getDashboardTimetable = function(req, res) {
    events.emit('JsonResponse', req, res, {eleAttr: '.fullcalendar', slots: slots, events: timetable});
};

exports.getDashboardNotes = function(req, res) {
    events.emit('JsonResponse', req, res, {eleAttr: '.fullcalendar', slots: slots, events: test2});
};

exports.getDashboardExams = function(req, res) {
    events.emit('JsonResponse', req, res, {eleAttr: '.fullcalendar', slots: slots, events: test2});
};

exports.getStudentDashboardDetails = function(req, res){
    try{
        async.parallel({
            events: eventsService.getMonthOfYearUserEvents.bind(null, req),
            holidays: nsaCassandra.Holiday.getSchoolHolidaysByMonth.bind(null, req),
            exams: examsService.getStudentExamsMontly.bind(null, req)
        }, function (err, data){
            if(err) {
                logger.debugLog(req, 'Get Dashboard Events', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa10001));
            } else {
                events.emit('JsonResponse', req, res, buildCalendarObj(req, data));
            }
        })
    }catch (err){
        logger.debugLog(req, 'Get Exam Schedule By ClassAndSection', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa10001));
    }

};

exports.getDashboardEvents = function(req, res) {
    async.parallel({
        events: eventsService.getMonthOfYearUserEvents.bind(null, req),
        holidays: nsaCassandra.Holiday.getSchoolHolidaysByMonth.bind(null, req),
        leavesTaken: nsaCassandra.Leaves.leavesTakenByEmp.bind(null, req),
        exams: examsService.getMonthOfYearUserEventsExams.bind(null, req)
    }, function (err, data){
        if(err) {
            logger.debugLog(req, 'Get Dashboard Events', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa10001));
        } else {
            events.emit('JsonResponse', req, res, buildCalendarObj(req, data));
        }
    });
};

function buildCalendarObj(req, data) {
    var allCalendarObjects = {};
    var examObjs = [];
    var calendarObjs = [];
    try{
        if(!_.isEmpty(data)) {
            var events = data.events;
            var holidays = data.holidays;
            var leavesTaken = data.leavesTaken;
            var exams = data.exams;

            if(Array.isArray(events) && !_.isEmpty(events)) {
                _.forEach(events, function(value, key){
                    var startDate = value.events.start_date;
                    var endDate = value.events.end_date;
                    var startTime = value.events.start_time;
                    var endTime = value.events.end_time;
                    var calendarObj = {};
                    var sDate1 = dateService.getFormattedDateWithDay(startDate)
                    var eDate1 = dateService.getFormattedDateWithDay(endDate)

                    var sTime = dateUtils.convertTo24Hour(startTime.toLowerCase());
                    var eTime = dateUtils.convertTo24Hour(endTime.toLowerCase());
                    var sDate = dateUtils.setTimeToDate(startDate, sTime);
                    var eDate = dateUtils.setTimeToDate(endDate, eTime);
                    calendarObj['title'] = value.events.event_name;
                    var dateTime =  sDate1 + ','  + dateUtils.convertTo12Hour(startTime.toString()) +  ' - ' + eDate1 + ',' + dateUtils.convertTo12Hour(endTime.toString())
                    calendarObj['description'] = {'Event Name' : value.events.event_name, 'Date & Time': dateTime};
                    calendarObj['start'] = sDate;
                    calendarObj['end'] = eDate;
                    calendarObj['event_id'] = value.events.event_id;
                    calendarObj['calendar_id'] = value.id;
                    calendarObj['created_date'] = value.created_date;
                    calendarObj['color'] = eventsColor;
                    calendarObj['startDate'] = dateUtils.getDateFormatted(startDate, "yyyy-mm-dd"); //For IOS Calendar
                    calendarObj['fullDate'] = dateUtils.getDateFormatted(startDate, "mmm d yyyy") + ' ' + dateUtils.convertTo12Hour(startTime.toString())
                    + ' - ' + dateUtils.getDateFormatted(endDate, "mmm d yyyy") + ' ' + dateUtils.convertTo12Hour(endTime.toString()); //For IOS Calendar
                    calendarObjs.push(calendarObj);
                });
            }
            if(Array.isArray(holidays) && !_.isEmpty(holidays)) {
                _.forEach(holidays, function(value, key){
                    var calendarObj = {};
                    calendarObj['title'] = value.holidayName;
                    calendarObj['start'] = dateUtils.setTimeToDate(new Date(value.startDate), '00:00:00');
                    calendarObj['end'] = dateUtils.setTimeToDate(new Date( value.endDate), '23:59:00');
                    calendarObj['color'] = holidayColor;
                    calendarObj['startDate'] = dateUtils.getDateFormatted(value.startDate, "yyyy-mm-dd"); //For IOS Calendar
                    calendarObj['fullDate'] = value.fullDate //For IOS Calendar
                    calendarObjs.push(calendarObj);
                });
            }
            if(Array.isArray(leavesTaken) && !_.isEmpty(leavesTaken)) {
                _.forEach(leavesTaken, function(value, key){
                    //var startDate = dateService.getServerDate(value.fromDate);
                    //var endDate = dateService.getServerDate(value.toDate);
                    var calendarObj = {};
                    calendarObj['title'] = 'Leave approved';
                    calendarObj['start'] = dateUtils.setTimeToDate(new Date(value.fromDate), '00:00:00');
                    calendarObj['end'] = dateUtils.setTimeToDate(new Date( value.toDate), '23:59:00');
                    calendarObj['color'] = leaveColor;
                    calendarObj['startDate'] = dateUtils.getDateFormatted(value.fromDate, "yyyy-mm-dd"); //For IOS Calendar
                    calendarObjs.push(calendarObj);
                });
            }

            if(Array.isArray(exams) && !_.isEmpty(exams)){
                _.forEach(exams, function(value, key){
                    _.forEach(value.exams.subject_details, function(value1, key){
                        var calendarObj = {};
                        var sectionNames = value.exams.sections.map(function(a){ return a.section_name });
                        calendarObj['title'] = value.exams.exam_name;
                        calendarObj['class_id'] = value.class_id;
                        calendarObj['class_name'] = value.exams.class_name;
                        calendarObj['sections'] = JSON.stringify(value.exams.sections);
                        calendarObj['exam_schedule_id'] = value.exams.exam_schedule_id;
                        calendarObj['created_date'] = value.created_date;
                        calendarObj['color'] = examsColor;
                        var startDate = value1.exam_date;
                        var endDate = value1.exam_date;
                        var startTime = dateUtils.getDateFormatted(value1.exam_start_time);
                        var endTime = dateUtils.getDateFormatted(value1.exam_end_time);
                        calendarObj['description'] = {'Exam Name' : value.exams.exam_name, 'Class Name': value.exams.class_name, 'Section Name': sectionNames, 'Start Time': dateUtils.getFormattedDate(startTime.toString()), 'End Time': dateUtils.getFormattedDate(endTime.toString())};
                        calendarObj['subject_name'] = value1.subject_name;

                        var sTime = dateUtils.convertTo24Hour(startTime.toLowerCase());
                        var eTime = dateUtils.convertTo24Hour(endTime.toLowerCase());
                        var sDate = dateUtils.setTimeToDate(startDate, sTime);
                        var eDate = dateUtils.setTimeToDate(endDate, eTime);
                        calendarObj['start'] = sDate;
                        calendarObj['end'] = eDate;
                        calendarObj['startDate'] = dateUtils.getDateFormatted(startDate, "yyyy-mm-dd"); //For IOS Calendar
                        calendarObj['startTime'] =  dateUtils.getDateFormatted(startTime, "h:MM TT") //For IOS Calendar
                        calendarObj['endTime'] = dateUtils.getDateFormatted(endTime, "h:MM TT") //For IOS Calendar
                        examObjs.push(calendarObj);
                    })
                })
            }
            allCalendarObjects['exams'] = examObjs;
            allCalendarObjects['events'] = calendarObjs;
        }
    } catch (err) {
        logger.debugLog(req, 'Get Calendar Details ', err);
        return buildErrResponse(err, message.nsa4821);
    }
    return allCalendarObjects;
};
exports.buildCalendarObj = buildCalendarObj;

exports.getDashboardAssignments = function(req, res) {
    events.emit('JsonResponse', req, res, {eleAttr: '.fullcalendar', slots: slots, events: test2});
};

exports.getDashboardCalendar = function(req, res) {
    events.emit('JsonResponse', req, res, {name : 'Dashboard-Calendar'});
};

exports.getStudentDetails = function (req, res) {
    async.parallel({
            notifications: nsaCassandra.Notifications.getAllUserNotificationLogs.bind(null, req),
            events: nsaCassandra.Events.getUserEvents.bind(null, req),
            notes: nsaCassandra.Timetable.getAttachmentsByCSDate.bind(null, req),
            homework: nsaCassandra.Assignments.getDueAssignmentLists.bind(null, req),
        }, function (err,  data) {
            if(err) {
                logger.debugLog(req, 'Get Student Details', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa10001));
            } else {
                data['message'] = message.nsa205;
                events.emit('JsonResponse', req, res, data);
            }
        }
    );
};

exports.getEmployeeDashboardDetails = function (req, res) {
    async.parallel({
            homework: nsaCassandra.Assignments.getTodayAssignmentListsByUser.bind(null, req),
            notes: nsaCassandra.Timetable.getTodayUploadedNotesByEmpId.bind(null, req),
            timetable: timetableService.getEmpTimetableByDay.bind(null, req),
            leavesAssign: nsaCassandra.LeaveAssign.getLeaveAssignByName.bind(null, req),
            leavesTaken: nsaCassandra.Attendance.getUserLeaveHistory.bind(null, req),
            leavesTakenEmp: nsaCassandra.Leaves.leavesTakenByEmp.bind(null, req)
        }, function (err,  data) {
            if(err) {
                logger.debugLog(req, 'Get Employee Dashboard Details', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa10001));
            } else {
                getRemaingLeaves(data, function(err, result) {
                    if (err) {
                        logger.debugLog(req, 'Get Employee Dashboard Details', err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
                    } else {
                        events.emit('JsonResponse', req, res, result);
                    }
                })
            }
        }
    );
};

function getRemaingLeaves(data, callback) {
    var remObj = [];
    try {
        var totalRemLeavs = 0;
        if(!_.isEmpty(data.leavesAssign)) {
            _.forEach(data.leavesAssign, function(val) {
                var leavCount = 0;
                var totalLeaves =  val.no_of_leaves;
                var leaves = _.filter(data.leavesTakenEmp, {'leaveTypeId' : val.leave_type_id});
                if(!_.isEmpty(leaves)) {
                    _.forEach(leaves, function(leav) {
                        leavCount = leavCount + Number(leav.leavesCount)
                    })
                }
                var remainingLeaves = totalLeaves - leavCount;
                remainingLeaves = remainingLeaves > 0 ? remainingLeaves : 0;
                totalRemLeavs = totalRemLeavs + remainingLeaves;
                val['remainingLeaves'] = remainingLeaves;
                val['leaveTypeName'] = val.leave_type_name;
                remObj.push(val);
            })
        }
        data['totRemLeavs'] = totalRemLeavs;
        callback(null, data);
    } catch (err) {
        logger.debugLog(req, 'Get Employee Dashboard Details', err);
        callback(err, null);
    }
}

exports.getRemaingLeaves = getRemaingLeaves;

//For IOS Start
exports.getStudentDashboardInfo = function (req, res) {
    var params = {startDate: moment().startOf('day'), endDate:moment().endOf('day')};
    async.parallel({
            events: nsaCassandra.Events.getTodayEvents.bind(null, req),
            homework: assignmentService.getTodayAssignments.bind(null, req),
            timetable: timetableService.timetableByClsSecDayDate.bind(null, req),
            exams: examsService.getStudentExamsPerDay.bind(null, req, params)
        }, function (err,  data) {
            if(err) {
                logger.debugLog(req, 'Get Student Details', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa10001));
            } else {
                data['message'] = message.nsa205;
                events.emit('JsonResponse', req, res, convertData(data));
            }
        }
    );
};

function convertData(data) {
    try {
        var objs = {};
        if(data) {
            objs['events'] = data.events ? data.events.length : 0;
            objs['homework'] = data.homework ? data.homework.hits.total : 0;
            objs['exams'] = data.exams ? data.exams.length : 0;
            var timetableObjs = _.map(data.timetable, _.partialRight(_.pick, ['assignee']));
            Object.keys(timetableObjs).forEach(function (key, value) {
                timetableObjs[key] = _.map(timetableObjs[key].assignee.subEmpAssociation, 'subCode');
                delete timetableObjs[key].assignee;
            });
            objs['timetable'] = _.flatten(timetableObjs);
        }
        return objs;
    } catch (err) {
        return err;
    }

}
//For IOS End


function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.DASHBOARD, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
}
exports.buildErrResponse = buildErrResponse;