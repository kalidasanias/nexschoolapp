/**
 * Created by senthil on 5/24/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../../services/index";
import {ServiceUrls} from "../../../../../../common/index";
import {ViewLeaveComponent} from "./view-leave-details/view-leave-details.component";

@Component({
    selector: 'reporting-employee',
    templateUrl: 'reporting-employees.html'
})
export class ReportingEmployeeComponent implements OnInit {

    @ViewChild(ViewLeaveComponent) viewLeaveComponent: ViewLeaveComponent;

    constructor(private baseService:BaseService, private serviceUrls: ServiceUrls) {
    }
    user: any;

    ngOnInit() {
        this.user = this.baseService.findUser();
        this.baseService.dataTableDestroy('datatable-reporting-leaves')
        this.baseService.enableDataTable(this.serviceUrls.employeeList + this.user.user_name)
    }

    viewDetails(event: any) {
        this.viewLeaveComponent.getLeaveHistoryByUser(event);
    }

}

