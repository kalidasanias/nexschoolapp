/**
 * Created by Sai Deepak on 2/22/2017.
 */
import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../../../services/index";

@Component({
    templateUrl: 'leaves-approval.html'
})
export class LeavesApprovalComponent implements OnInit {
    constructor(private baseService: BaseService) { }

    ngOnInit() {
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
    }
}
