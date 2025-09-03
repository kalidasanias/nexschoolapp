/**
 * Created by maggi on 22/05/17.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService } from '../../../../../../../../services/index';

@Component({
    selector: 'add-grading-aspect',
    templateUrl: 'add-grading-aspect.html'
})
export class AddGradingAspectComponent implements OnInit {

    modalId: any;

    constructor(private baseService: BaseService, private fb: FormBuilder) { }

    ngOnInit() {
        //throw new Error("Method not implemented.");
    }

    show(event: any) {
        this.baseService.openOverlay(event);
    }

    closeOverlay() {
        this.baseService.closeOverlay("#add_grading");
    }



}