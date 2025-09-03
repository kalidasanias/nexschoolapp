import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../../../../../services/base/base.service";
import {ServiceUrls} from "../../../../../../../../../common/constants/service.urls";

/**
 * Created by maggi on 26/05/17.
 */


@Component({
    selector : 'generate-mark-sheet',
    templateUrl: 'generate-mark-sheet.html'
})

export class GenerateMarkSheetComponent implements OnInit {
    modalId: any;

    //@ViewChild(AddMarkUploadComponent) addMarkUploadComponent: AddMarkUploadComponent


    constructor(private baseService: BaseService, private serviceUrls: ServiceUrls, private fb: FormBuilder) { }

    ngOnInit() {
      //  this.baseService.enableDataTable(this.serviceUrls.eventType);
    }

    show(event: any) {
        this.baseService.openOverlay(event);
    }

    closeOverlay() {
        this.baseService.closeOverlay("#generate-mark-sheet");
    }

    // addMarkUpload(event: any) {
    //     this.addMarkUploadComponent.show(event);
    // }


}