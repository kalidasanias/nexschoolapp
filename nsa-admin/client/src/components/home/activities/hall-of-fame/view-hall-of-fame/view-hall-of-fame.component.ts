/**
 * Created by intellishine on 9/11/2017.
 */
import {Component, OnInit, Input} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";
import {ServiceUrls, Constants} from "../../../../../common/index";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
    selector: 'view-hall-of-fame',
    templateUrl: 'view-hall-of-fame.html'
})

export class ViewHallOfFameComponent implements OnInit {

    hallOfFameDetails: any;
    modalId: any;
    cartegory: any;
    dateOfIssue: any;
    awardName: any;

    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private constants: Constants,
                private serviceUrls: ServiceUrls) {

    }

    ngOnInit() {
        this.baseService.enablePickerDate();
    }

    openOverlay(event:any) {
        this.baseService.openOverlay(event);
    }

    gethallOfFameById(event: any){
        this.modalId = event;
        this.hallOfFameDetails = JSON.parse(event.target.value);
        this.awardName = this.hallOfFameDetails.award_name;
        this.dateOfIssue = this.hallOfFameDetails.date_of_issue;
        this.cartegory = this.hallOfFameDetails.description;
        this.baseService.dataTableDestroy('datatable-view-hall-of-fame');
        this.baseService.enableDataTableAjax(this.serviceUrls.hallOfFameDetails + this.hallOfFameDetails.id, null);
        this.baseService.openOverlay(this.modalId);
    }

    closeOverlay() {
        this.baseService.closeOverlay('#HallofFameView');
    }
}