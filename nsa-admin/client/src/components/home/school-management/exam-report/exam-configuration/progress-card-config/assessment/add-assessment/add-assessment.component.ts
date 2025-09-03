/**
 * Created by maggi on 07/05/17.
 */

import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../../../../services/base/base.service";
import {Component, OnInit} from "@angular/core";


@Component({
    selector: 'add-assessment',
    templateUrl: 'add-assessment.html'
})
export class AddAssessmentComponent implements OnInit {

    modalId: any;

    constructor(private baseService: BaseService, private fb: FormBuilder) { }

    ngOnInit() {
        //throw new Error("Method not implemented.");
    }

    show(event: any) {
        this.baseService.openOverlay(event);
    }

    closeOverlay() {
        this.baseService.closeOverlay("#add_assessment");
    }


}