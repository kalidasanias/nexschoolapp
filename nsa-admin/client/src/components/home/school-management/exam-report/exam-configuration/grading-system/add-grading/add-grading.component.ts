/**
 * Created by Cyril on 2/22/2017.
 */
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceUrls, Messages } from '../../../../../../../common/index';
import { Constants} from '../../../../../../../common/constants/constants';
import { BaseService } from '../../../../../../../services/index';

@Component({
    selector: 'add-grading',
    templateUrl: 'add-grading.html'
})
export class AddGradingSystemComponent implements OnInit {
    modalId: any;

    constructor(private baseService: BaseService, public serviceUrls: ServiceUrls,
                private fb: FormBuilder ) {}

    ngOnInit() {
        //this.createForm();
        this.baseService.enableAppJs();
    }

    show(event: any) {
        this.baseService.openOverlay(event);
    }

    closeOverlay() {
        this.baseService.closeOverlay("#addGrading");
    }
}
