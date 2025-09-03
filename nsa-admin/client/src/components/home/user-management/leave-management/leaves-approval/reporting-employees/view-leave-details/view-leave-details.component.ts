/**
 * Created by Sai Deepak on 5/24/2017.
 */

import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../../../../../services/index";
import {ServiceUrls} from "../../../../../../../common/index";
import {CommonService} from "../../../../../../../services/common/common.service";

@Component({
    selector: 'view-leave',
    templateUrl: 'view-leave-details.html'
})
export class ViewLeaveComponent implements OnInit {

    remainLeavs: any;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService) {

    }

    ngOnInit() {
    }

    openOverlay(event: any) {
        this.baseService.openOverlay(event);
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#viewHistory');
    }

    getLeaveHistoryByUser(event: any) {
        var obj = JSON.parse(event.target.value);
        this.baseService.dataTableDestroy('datatable-respond-leaves');
        this.baseService.enableDataSourceDatatable(this.serviceUrls.leavesTaken + obj.empId);

        this.commonService.get(this.serviceUrls.remainigleaves + obj.empId).then(
            remainLeav => this.remainLeavs = remainLeav
        )

        this.baseService.openOverlay(event);
    }
}