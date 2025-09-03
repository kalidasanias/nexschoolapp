/**
 * Created by senthil on 4/4/2017.
 */
import {Component} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {CalendarService} from "../../../../services/calendar/calendar.service";

@Component({
    selector: 'ext-calendar',
    templateUrl: 'ext.calendar.html'
})
export class ExtCalendarComponent {
    hasRoleToEdit: boolean;

    constructor(private baseService: BaseService,
                private calendarService: CalendarService) {}

    ngOnInit() {
        this.hasRoleToEdit = this.baseService.checkUserCanEdit();
    }

    enableCalendar(data: any, view: any, hasRoleToEdit: any) {
        data.hasRoleToEdit = hasRoleToEdit;
        this.calendarService.enableFullCalendar(data, view);
    }

    refresh(data: any) {
        this.calendarService.calendarRefresh(data);
    }

}