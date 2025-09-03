/**
 * Created by maggi on 26/05/17.
 */
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../../../../../services/base/base.service";
import {Component, OnInit} from "@angular/core";
import {ServiceUrls} from "../../../../../../../../../common/constants/service.urls";


@Component({
    selector : 'add-mark-upload',
    templateUrl: 'add-mark-upload.html'
})

export class AddMarkUploadComponent implements OnInit {
    modalId: any;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private fb: FormBuilder) { }

    ngOnInit() {
        /*this.baseService.enableDataTable(this.serviceUrls.eventType)*/
        //throw new Error("Method not implemented.");
    }

    show(event: any) {
        this.baseService.openOverlay(event);
    }

    closeOverlay() {
        this.baseService.closeOverlay("#add-mark-upload");
    }
}