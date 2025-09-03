/**
 * Created by intellishine on 9/11/2017.
 */
import {Component, OnInit, Input,ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {CommonService} from "../../../../services/common/common.service";
import {ServiceUrls, Constants} from "../../../../common/index";
import {FormBuilder, Validators} from "@angular/forms";
import {AddHallOfFameComponent} from "./add-hall-of-fame/add-hall-of-fame.component";
import {ViewHallOfFameComponent} from "./view-hall-of-fame/view-hall-of-fame.component";
import {PublishHallOfFameComponent} from "./publish-hall-of-fame/publish-hall-of-fame.component"

@Component({
    templateUrl: 'hall-of-fame.html'
})

export class HallOfFameComponent implements OnInit {

    @ViewChild(AddHallOfFameComponent) addHallOfFameComponent: AddHallOfFameComponent
    @ViewChild(ViewHallOfFameComponent) viewHallOfFameComponent: ViewHallOfFameComponent
    @ViewChild(PublishHallOfFameComponent) publishHallOfFameComponent: PublishHallOfFameComponent

    enable: boolean = false;
    btnVal: string;

    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls,
                private constants: Constants) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Hall Of Fame')
        this.baseService.enablePickerDate();
        this.baseService.enableAppJs();
        this.baseService.enableDataTable(this.serviceUrls.hallOfFame);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.HALLOFFAME_PERMISSIONS)
    }

    requested_delete(event: any) {
        var value = event.target.value;
        if(value){
            this.commonService.deleteObj(this.serviceUrls.hallOfFame +  JSON.parse(value).id, 'datatable-hall-of-fame');
        }
    }
    requested_warning() {
        this.baseService.showWarning();
    }

    addHallOfFame(event: any) {
        this.addHallOfFameComponent.openOverlay(event);
    }

    publishHallOfFame(event: any){
        this.publishHallOfFameComponent.getHallOfFame(event);
    }

    viewHallOfFame(event: any){
        this.viewHallOfFameComponent.gethallOfFameById(event);
    }

    getEditHallOfFame(event: any){
        this.addHallOfFameComponent.getEditHallOfFames(event);
    }
}