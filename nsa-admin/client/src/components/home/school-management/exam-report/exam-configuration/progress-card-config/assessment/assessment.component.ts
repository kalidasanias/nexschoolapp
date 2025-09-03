/**
 * Created by maggi on 22/05/17.
 */

import {Component, OnInit, forwardRef, ViewChild} from '@angular/core';
import { ServiceUrls, Constants, Messages } from '../../../../../../../common/index';
import { BaseService } from '../../../../../../../services/index';
import {AddAssessmentComponent} from "./add-assessment/add-assessment.component";

@Component({
    selector : 'assessment',
    templateUrl: 'assessment.html'
})
export class AssessmentComponent implements OnInit {

    @ViewChild(AddAssessmentComponent) addAssessmentComponent: AddAssessmentComponent

    constructor(private baseService: BaseService, private serviceUrls: ServiceUrls) { }

    ngOnInit() {
        this.baseService.setTitle('nsa-assessment-type');
    }

    addAssessment(event: any) {
        this.addAssessmentComponent.show(event)
    }


}