/**
 * Created by maggi on 07/05/17.
 */
import {Component, OnInit, forwardRef, ViewChild} from '@angular/core';
import { ServiceUrls, Constants, Messages } from '../../../../../../../common/index';
import { BaseService } from '../../../../../../../services/index';
import {AddProgressCardSettingComponent} from "./add-configuration/add-configuration.component";

@Component({
    selector : 'card_setting',
    templateUrl: 'configuration.html'
})

export class ProgressCardSettingComponent implements OnInit {

    @ViewChild(AddProgressCardSettingComponent) addProgressCardSettingComponent: AddProgressCardSettingComponent

    constructor(private baseService: BaseService, private serviceUrls: ServiceUrls) { }


    ngOnInit() {
        this.baseService.setTitle('NSA - Written Exams');
    }

    addProgressCard(event: any) {
        this.addProgressCardSettingComponent.show(event)
    }

}
