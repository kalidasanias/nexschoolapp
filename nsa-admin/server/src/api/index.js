/**
 * Created by senthilPeriyasamy on 12/23/2016.
 */
var express = require('express')
    , session = require('express-session')
    , CassandraStore = require("cassandra-store")
    , router = express.Router()
    , ping = require('./ping/ping')
    , upload = require('./upload/upload')
    , s3 = require('./s3/s3file')
    , config = require('./config/config')
    , authentication = require('./authentication/authentication')
    , notification = require('./sms/notifications/notification')
    , templates = require('./sms/templates/templates')
    , user = require('./user/user')
    , school = require('./school/school')
    , members = require('./school/members')
    , department = require('./user-mgmt/department')
    , designation = require('./user-mgmt/designation')
    , leaveType = require('./user-mgmt/leaveType')
    , leaveAssign = require('./user-mgmt/leaveAssign')
    , employee = require('./user-mgmt/employee')
    , student = require('./user-mgmt/student')
    , fee = require('./fee/fee')
    , dashboard = require('./dashboard/dashboard')
    , taxanomy = require('./taxanomy/taxanomy')
    , notifications = require('./notifications/notification')
    , languages = require('./language/language')
    , terms = require('./terms/terms')
    , feature = require('./feature/feature')
    , search = require('./search/search')
    , initFilter = require('../common/filters/InitFilter')
    , subject = require('./subject/subject')
    , scheduler = require('./scheduler/scheduler')
    , assignment = require('./assignments/assignments')
    , feedback = require('./feedback/feedbacks')
    , classes = require('./class/class')
    , sections = require('./section/section')
    , conversation = require('./conversation/conversation')
    , auditLog = require('./auditLog/auditLog')
    , attendance = require('./attendance/attendance')
    , academics = require('./academics/academics')
    , ccavenue = require('./payment/ccavenue/ccavenue')
    , payment = require('./payment/payment')
    , periods = require('./periods/periods')
    , timetable = require('./timetable/timetable')
    , days =require('./days/days')
    , aspects =require('./aspects/aspects')
    , transaction =require('./transaction/transaction')
    , holidays =require('./holidays/holidays')
    , vehicle = require('./transport/vehicle')
    , course = require('./course/course')
    , driver = require('./transport/driver')
    , route = require('./transport/route')
    , vehicleAllocation = require('./transport/vehicleAllocation')
    , events = require('./events/events')
    , leaves = require('./leaves/leaves')
    , track = require('./transport/livetracking')
    , gallery = require('./gallery/gallery')
    , roles = require('./roles/roles')
    , exam = require('./exam/exam')
    , marks = require('./marks/marks')
    , onboard = require('./onboard/onboard')
    , grades = require('./grades/grades')
    , voice = require('./voice/voice')
    , hallOfFame = require('./hall-of-fame/hallOfFame')
    , promotions = require('./promotions/promotions')
    , utils = require('./utils/utils');


var apiVersionOne = '/rest/api/v1/nsa/';

router.all(apiVersionOne + '*', initFilter.initValidation);


router.use(apiVersionOne + 'ping', ping);
router.use(apiVersionOne + 'upload', upload);
router.use(apiVersionOne + 's3', s3);
router.use(apiVersionOne + 'config', config);
router.use(apiVersionOne + 'auth', authentication);
router.use(apiVersionOne + 'sms', notification);
router.use(apiVersionOne + 'onboard', onboard);
router.use(apiVersionOne + 'sms', templates);
router.use(apiVersionOne + 'user', user);
router.use(apiVersionOne + 'department', department);
router.use(apiVersionOne + 'designation', designation);
router.use(apiVersionOne + 'leavetype', leaveType);
router.use(apiVersionOne + 'leaveassign', leaveAssign);
router.use(apiVersionOne + 'employee', employee);
router.use(apiVersionOne + 'student', student);
router.use(apiVersionOne + 'fee', fee);
router.use(apiVersionOne + 'dashboard', dashboard);
router.use(apiVersionOne + 'taxanomy', taxanomy);
router.use(apiVersionOne + 'languages', languages);
router.use(apiVersionOne + 'terms', terms);
router.use(apiVersionOne + 'feature', feature);
router.use(apiVersionOne + 'es', search);
router.use(apiVersionOne + 'subject', subject);
router.use(apiVersionOne + 'scheduler', scheduler);
router.use(apiVersionOne + 'assignment', assignment);
router.use(apiVersionOne + 'feedback', feedback);
router.use(apiVersionOne + 'notification', notifications);
router.use(apiVersionOne + 'classes', classes);
router.use(apiVersionOne + 'sections', sections);
router.use(apiVersionOne + 'conversation', conversation);
router.use(apiVersionOne + 'auditLog', auditLog);
router.use(apiVersionOne + 'attendance', attendance);
router.use(apiVersionOne + 'academics', academics);
router.use(apiVersionOne + 'ccavenue', ccavenue);
router.use(apiVersionOne + 'payment', payment);
router.use(apiVersionOne + 'periods', periods);
router.use(apiVersionOne + 'timetable', timetable);
router.use(apiVersionOne + 'days', days);
router.use(apiVersionOne + 'aspects', aspects);
router.use(apiVersionOne + 'holidays', holidays);
router.use(apiVersionOne + 'transaction', transaction);
router.use(apiVersionOne + 'vehicle', vehicle);
router.use(apiVersionOne + 'driver', driver);
router.use(apiVersionOne + 'route', route);
router.use(apiVersionOne + 'vehicleallocation', vehicleAllocation);
router.use(apiVersionOne + 'events', events);
router.use(apiVersionOne + 'course', course);
router.use(apiVersionOne + 'leaves', leaves);
router.use(apiVersionOne + 'tracking', track);
router.use(apiVersionOne + 'school', school);
router.use(apiVersionOne + 'members', members);
router.use(apiVersionOne + 'roles', roles);
router.use(apiVersionOne + 'gallery', gallery);
router.use(apiVersionOne + 'exam', exam);
router.use(apiVersionOne + 'marks', marks);
router.use(apiVersionOne + 'grades', grades);
router.use(apiVersionOne + 'voice', voice);
router.use(apiVersionOne + 'halloffame', hallOfFame);
router.use(apiVersionOne + 'utils', utils);
router.use(apiVersionOne + 'promotions', promotions);

module.exports = router;