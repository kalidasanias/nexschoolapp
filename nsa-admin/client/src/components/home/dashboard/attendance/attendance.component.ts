/**
 * Created by Senthilkumar on 03/31/2017.
 */
import {Component} from "@angular/core";
import {BaseService} from "../../../../services/index";

@Component({
    selector: 'dashboard-attendance',
    templateUrl: 'attendance.html'
})
export class DashboardAttendanceComponent {

    constructor(private baseService: BaseService) {

    }
    ngOnInit() {
    }

}