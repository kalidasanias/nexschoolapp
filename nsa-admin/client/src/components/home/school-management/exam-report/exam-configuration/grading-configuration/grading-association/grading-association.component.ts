/**
 * Created by maggi on 22/05/17.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseService} from '../../../../../../../services/index';
import { ServiceUrls, Constants, Messages } from '../../../../../../../common/index';
import {AddGradingAssociationComponent} from "./add-grading-association/add-grading-association.component";

@Component({
    selector: 'grading-association',
    templateUrl: 'grading-association.html'
})
export class GradingAssociationComponent implements OnInit {

    @ViewChild(AddGradingAssociationComponent)addGradingAssociationComponent: AddGradingAssociationComponent;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls
    ) { }

    ngOnInit() {
    }

    addGradingAspectAssoc(event : any) {
        this.addGradingAssociationComponent.show(event);
    }
}