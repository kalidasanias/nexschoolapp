
var express = require('express')
    ,router = express.Router()
    ,holidays = require('../../services/holidays/holidays.service');

console.log("holidays .js its commming")

router.get('/types/', holidays.getHolidaysTypes);
 router.get('/types/:id', holidays.getHolidayTypeById);
 router.post('/types/',  holidays.saveHolidayType);
 router.put('/types/:id',  holidays.updateHolidayType);
 router.delete('/types/:id', holidays.deleteHolidayType);

//school Holidays
router.get('/school/', holidays.getAllSchoolHolidays);
router.get('/school/:id', holidays.getSchoolHolidayById);
router.post('/school/',  holidays.saveSchoolHoliday);
router.put('/school/:id',  holidays.updateSchoolHoliday);
router.delete('/school/:id', holidays.deleteSchoolHoliday);

router.get('/school/week/off', holidays.getSchoolWeekOff);
router.post('/school/week/off',  holidays.saveSchoolWeekOff);
router.put('/school/week/off/:id',  holidays.updateSchoolWeekOff);

//For IOS Start
router.get('/', holidays.getSchoolHolidays); //For Holidays timeline
router.get('/school/month/year', holidays.getSchoolHolidaysByMonthOfYear); //For Holidays timeline based on month and year
//For IOS End


module.exports = router;