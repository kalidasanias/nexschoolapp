/**
 * Created by admin on 22/04/17.
 */
import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { ServiceUrls, Constants, Messages, MyRouters } from '../../common/index';

declare var calendar: any;

@Injectable()
export class  CalendarService {

    constructor (
        public http: Http,
        public serviceUrl: ServiceUrls,
        public constants: Constants,
        public messages: Messages) {
    }

    enableFullCalendar(data: any, view: any) {
        calendar.enableFullCalendar(data, view);
    }

    calendarRefresh(data: any) {
        calendar.calendarRefresh(data)
    }

    showEventPopup(event: any, data: any) {
        calendar.showEventPopup(event, data)
    }

    renderEvent(event: any) {
        calendar.renderEvent(event)
    }

    removeEvent(eventId: any) {
        calendar.removeEvent(eventId)
    }

    updateEvent(event: any) {
        calendar.updateEvent(event)
    }

}