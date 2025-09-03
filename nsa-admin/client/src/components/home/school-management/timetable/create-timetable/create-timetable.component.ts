/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit,ViewChild} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import { EmpTimetableComponent } from "../create-timetable/emp-timetable/emp-timetable.component"

@Component({
    templateUrl: 'create-timetable.html'
})
export class CreateTimetableComponent implements OnInit {
    @ViewChild (EmpTimetableComponent) empTimetableComponent : EmpTimetableComponent;
    constructor(private baseService: BaseService) { }
    ngOnInit() {
        this.baseService.setTitle('NSA - Timetable')
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
    }
    employeeList(){
        this.empTimetableComponent.employeTab();
    }
}
