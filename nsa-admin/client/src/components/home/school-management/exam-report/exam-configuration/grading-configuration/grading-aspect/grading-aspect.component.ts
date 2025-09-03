/**
 * Created by maggi on 22/05/17.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseService} from '../../../../../../../services/index';
import { ServiceUrls, Constants, Messages } from '../../../../../../../common/index';
import {AddGradingAspectComponent} from "./add-grading-aspect/add-grading.component";

@Component({
    selector: 'grading-aspect',
    templateUrl: 'grading-aspect.html'
})
export class GradingAspectComponent implements OnInit {

    @ViewChild(AddGradingAspectComponent)addGradingAspectComponent: AddGradingAspectComponent;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls
    ) { }

    ngOnInit() {
    }

    addGradingAspect(event : any) {
        this.addGradingAspectComponent.show(event);
    }
}
