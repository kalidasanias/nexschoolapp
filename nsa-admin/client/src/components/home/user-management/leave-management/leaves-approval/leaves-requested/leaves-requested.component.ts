/**
 * Created by Sai Deepak on 5/24/2017.
 */

import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../../services/index";
import {Constants,ServiceUrls} from "../../../../../../common/index";
import {ApprovalHistroyComponent} from "./approval-history/approval-history.component";
import {RespondLeaveComponent} from "./respond-leaves/respond-leaves.component";

@Component({
    selector: 'leave-request',
    templateUrl: 'leaves-requested.html'
})
export class LeavesRequestedComponent implements OnInit {

    @ViewChild(ApprovalHistroyComponent) approvalHistroyComponent: ApprovalHistroyComponent
    @ViewChild(RespondLeaveComponent) respondLeaveComponent: RespondLeaveComponent

    constructor(private baseService:BaseService,
                private constants: Constants,
                private serviceUrls: ServiceUrls) {
    }
    user: any;
    enable : boolean = false;

    ngOnInit() {
        this.user = this.baseService.findUser();
        this.baseService.dataTableDestroy('datatable-requested-leaves')
        this.baseService.enableDataSourceScholar(this.serviceUrls.requestedLeaves + this.user.user_name);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.LEAVE_ASSIGN_PERMISSIONS)
    }

    viewApproval(event: any) {
        this.approvalHistroyComponent.openOverlay(event);
    }

    respondLeaves(event: any) {
        this.respondLeaveComponent.getLeaveDetailByUser(event, event.target.value);
    }
}
