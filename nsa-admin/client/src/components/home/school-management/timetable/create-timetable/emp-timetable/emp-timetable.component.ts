/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../../services/index";
import {ServiceUrls} from "../../../../../../common/index";
import {ViewEmpTimetableComponent} from "./emp-timetable-view/view-emp-timetable.component";

@Component({
    selector: 'emp-timetable',
    templateUrl: 'emp-timetable.html'
})
export class EmpTimetableComponent implements OnInit {
    employees: any

    @ViewChild(ViewEmpTimetableComponent)viewEmpTimetable: ViewEmpTimetableComponent;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls) {

    }

    ngOnInit() {
        this.baseService.enableDataTableAjax(this.serviceUrls.employeeTimetable, null)
    }

    employeTab(){
        this.baseService.dataTableReload('employee-timetable');
    }

    viewTimetable(event: any) {
        this.viewEmpTimetable.viewEmpTimetable(event)
    }
}
