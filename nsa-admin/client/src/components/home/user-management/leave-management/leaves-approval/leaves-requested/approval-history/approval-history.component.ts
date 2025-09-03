/**
 * Created by Sai Deepak on 5/24/2017.
 */

import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../../../../../services/index";
import {ServiceUrls} from "../../../../../../../common/index";

@Component({
    selector: 'approval-history',
    templateUrl: 'approval-history.html'
})
export class ApprovalHistroyComponent implements OnInit {
    user: any;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Leaves Approval')
    }

    openOverlay(event: any) {
        this.user = this.baseService.findUser();
        this.baseService.dataTableDestroy('datatable-approval-history');
        this.baseService.enableDataTableAjax(this.serviceUrls.approvalHistory + this.user.user_name, null)
        this.baseService.openOverlay(event);
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#approvalHistory');
    }

}
