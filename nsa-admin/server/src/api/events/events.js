/**
 * Created by Kiranmai A on 4/24/2017.
 */

var express = require('express'),
    router = express.Router(),
    events = require('../../services/events/events.service');

router.get('/types', events.getEventTypes);
router.get('/types/:typeId', events.getEventType);
router.post('/types', events.saveEventType);
router.put('/types/:typeId', events.updateEventType);
router.delete('/types/:typeId', events.deleteEventType);

router.get('/activity', events.getAllActivityTypes);
router.get('/activity/:id', events.getActivityType);
router.post('/activity', events.saveActivityType);
router.put('/activity/:id', events.updateActivityType);
router.delete('/activity/:id', events.deleteActivityType);


router.get('/venues', events.getEventVenues);
router.get('/venues/:venueId', events.getEventVenue);
router.post('/venues', events.saveEventVenue);
router.put('/venues/:venueId', events.updateEventVenue);
router.delete('/venues/:venueId', events.deleteEventVenue);

router.post('/', events.saveEvent);
router.put('/details/:id', events.updateEventDetails);
router.put('/attachments/:id', events.updateAttachments);
router.delete('/attachments/:id', events.deleteAttachments);
router.delete('/:id', events.deleteEvent);

router.get('/all/:userId/activity/:activityId', events.getAllEventsByActivity);
router.get('/all/:userId', events.getAllEvents);
router.get('/details/:id', events.getEveDetailsByEveId);
router.get('/month/year', events.getEventsByMonthOfYear);
router.get('/user/:userId', events.getUserEvents);
router.get('/today', events.getTodayEvents);
router.get('/latest', events.getAllLatestEvents);
router.get('/past', events.getAllPastEvents);
router.get('/:date', events.getDateEvents);
router.get('/user/class/:id', events.getAllUserClassEvents);

//For IOS Start
router.get('/', events.getEvents); //For IOS All Events timeline
router.get('/past/user', events.getPastEvents); //For IOS Past Events timeline
router.get('/user/details/:eventId/:userId', events.getUserEventsByEventId); //For IOS event details
//For IOS End

module.exports = router;