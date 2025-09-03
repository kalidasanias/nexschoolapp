/**
 * Created by maggi on 22/05/17.
 */

import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../../../../../../services/base/base.service";
import {FormBuilder} from "@angular/forms";



@Component({
    selector: 'add-configuration',
    templateUrl: 'add-configuration.html'
})
export class AddProgressCardSettingComponent implements OnInit {

    modalId: any;

    constructor(private baseService: BaseService, private fb: FormBuilder) { }

    ngOnInit() {
        //throw new Error("Method not implemented.");
    }

    show(event: any) {
        this.baseService.openOverlay(event);
    }

    closeOverlay() {
        this.baseService.closeOverlay("#add_progress_card");
    }


}