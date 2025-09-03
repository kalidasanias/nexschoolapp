/**
 * Created by admin on 13/04/17.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../../../services/index";
import {ServiceUrls, Constants} from "../../../../../../../common/index";
import {ExtCalendarComponent} from "../../../../../common/calendar/ext.calendar.component";
import {DateService} from "../../../../../../../services/common/date.service";
import {CommonService} from "../../../../../../../services/common/common.service";

@Component({
    selector: 'view-emp-timetable',
    templateUrl: 'view-emp-timetable.html'
})
export class ViewEmpTimetableComponent implements OnInit {
    employees: any;
    timetable: any = {};
    empUserName: any;
    events: any = [
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

    ]


    @ViewChild(ExtCalendarComponent) extCalendar: ExtCalendarComponent

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls, private constants: Constants,
                private commonService: CommonService,
                private dateService: DateService) {

    }

    ngOnInit() {

    }

    openOverlay(event:any) {
        this.baseService.openOverlay(event);
    }

    viewEmpTimetable(event: any) {
        var obj = JSON.parse(event.target.value);
        this.empUserName = obj.user_name
        this.commonService.get(this.serviceUrls.empTimetableSlots).then(result => this.callBackEmpTimetableSlots(result))
        this.openOverlay(event);
    }

    callBackEmpTimetableSlots(data: any) {
        this.timetable.eleAttr = '.fullcalendar';
        this.timetable.weekEle = '#empWeekData';
        this.timetable.slots = data;
        this.timetable.events = this.events
        this.renderCalendar(this.timetable, 'week');
        this.refreshCalendar(this.timetable)
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#view-emp-timetable');
    }

    renderCalendar(data: any, view: any) {
        this.extCalendar.enableCalendar(data, view, true);
    }

    refreshCalendar(data: any) {
        this.extCalendar.refresh(data)
    }

    getWeekData(event: any) {
        var date = new Date(event.target.value);
        date.setDate(date.getDate() + 1);
        var weekNumber = this.dateService.getWeekNumber(date);
        this.commonService.get(this.serviceUrls.EmpTimetable + this.empUserName + '?weekNo=' + weekNumber[1]).then(result => this.callbackWeekData(result))
    }

    callbackWeekData(data: any) {
        this.timetable.events = data;
        this.refreshCalendar(this.timetable)
    }
}
