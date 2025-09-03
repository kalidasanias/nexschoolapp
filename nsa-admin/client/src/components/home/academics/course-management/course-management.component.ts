/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {ServiceUrls} from "../../../../common/index";


@Component({
    templateUrl: 'course-management.html'
})
export class CourseManagementComponent implements OnInit {
    constructor(private baseService: BaseService,private serviceUrls:ServiceUrls) { }

    ngOnInit() {
        this.baseService.enableAppJs();
        this.baseService.enableDataTable(this.serviceUrls.getAllCourses);
    }
}


