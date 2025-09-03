/**
 * Created by bharatkumarr on 05/02/18.
 */

var path = require('path'),
    fs = require('fs'),
    java = require('java'),
    _ = require('lodash');


process.on('message', function(data) {
    try {

        // console.info('data....',data);
        // console.info('data.classConfig.schoolPeriods....',data.classConfig.schoolPeriods);
        var java = require('java');

        // java.classpath.push("/Users/bharatkumarr/root/Projects/nsa/helix/nexschoolapp/trunk/nsa-admin/server/src/services/timetable/timetable.jar");
        java.classpath.push(__dirname + '/timetable.jar');
        var timeTable = java.newInstanceSync("com.ga.Timetable");
        var timeslotId = 1, teacherId = 1;
        timeTable.addRoomSync(1, "A1", 40);

        var allTimeslot = {}, activePeriods = _.filter(data.classConfig.schoolPeriods, function(o) { return !o.is_break; });

        _.each(data.classConfig.working_days, function (day) {
            allTimeslot[day] = allTimeslot[day] ? allTimeslot[day] : {};
            _.each(activePeriods, function (period) {
                var timeslot = '{ "day_id": ' + day + ', "period_id": ' + period.period_id + '}';
                allTimeslot[day][period.period_id] = timeslotId;
                timeTable.addTimeslotSync(timeslotId, timeslot);
                timeslotId++;
            });
        });

        timeTable.setNumOfDaysSync(data.classConfig.working_days.length);
        timeTable.setNumOfPeriodsPerDaySync(activePeriods.length);
        timeTable.setMaxNumPeriodsSync(activePeriods.length);

        var HashMap = java.import('java.util.HashMap');
        var group = new HashMap();

        _.each(data.allocatedTeachers, function (teacher) {
            var ArrayList = java.import('java.util.ArrayList');
            var busyTimeslots = new ArrayList();
            _.each(data.teacherTimetable[teacher.emp_id] , function (busyTimetable) {
                if (allTimeslot[busyTimetable.day_id]) {
                    var busyTimeslotId = allTimeslot[busyTimetable.day_id][busyTimetable.period_id];
                    busyTimeslots.addSync(busyTimeslotId);
                }
            });

            if (busyTimeslots.sizeSync() > 0) {
                timeTable.addProfessorSync(teacherId, teacher.emp_id, busyTimeslots);
            } else {
                timeTable.addProfessorSync(teacherId, teacher.emp_id);
            }

            timeTable.addModuleSync(teacherId, teacher.subject_name, teacher.subject_id, java.newArray("int", [teacherId]));
            group.putSync(teacherId, +teacher.max_periods);
            teacherId++;
        });


        timeTable.addGroupSync(1, 40, group);

        var timeTableGA = java.newInstanceSync("com.ga.TimetableGA");
        var arrayClasses = timeTableGA.generateTimetableSync(timeTable);
        var queryArr = [], respData = {};

        if (timeTable.getFinalFitnessSync() === 1.0) {
            for (var i = 0; i < arrayClasses.sizeSync(); i++) {
                var classObj = arrayClasses.getSync(i);
                if (classObj.getModuleIdSync() != -1) {
                    var subjectId = timeTable.getModuleSync(classObj.getModuleIdSync()).getModuleNameSync(),
                        teacherId = timeTable.getProfessorSync(classObj.getProfessorIdSync()).getProfessorNameSync(),
                        timeslot = JSON.parse(timeTable.getTimeslotSync(classObj.getTimeslotIdSync()).getTimeslotSync());

                    var timeTableJson = {};
                    timeTableJson.subjectId = subjectId;
                    timeTableJson.teacherId = teacherId;
                    timeTableJson.period_id = timeslot.period_id;
                    timeTableJson.day_id = timeslot.day_id;
                    queryArr.push(timeTableJson);
                }
            }
            respData.periods = queryArr;
        } else {
            var msg = "Please try again to generate fitness timetable and current period clashes " + timeTable.getClashesSync();
            respData.err = {message: msg};
        }
        process.send(respData);

    } catch (err) {
        // console.info('err...',err);
        var respData = {};
        respData.err = err;
        process.send(respData);

    }



});