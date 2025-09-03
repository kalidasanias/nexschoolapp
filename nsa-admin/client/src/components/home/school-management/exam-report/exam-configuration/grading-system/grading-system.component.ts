/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../../services/index";
import {AddGradingSystemComponent} from "./add-grading/add-grading.component";

@Component({
    templateUrl: 'grading-system.html'
})
export class GradingSystemComponent implements OnInit {

    @ViewChild(AddGradingSystemComponent) addGradingSystemComponent : AddGradingSystemComponent;

    constructor(private baseService: BaseService) { }

    ngOnInit() {
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        /*this.baseService.enableDataTableExample();*/
        //this.baseService.enableSelect();
        /*this.baseService.enableDataTable();*/
    }

    addGrading(event: any) {
        this.addGradingSystemComponent.show(event)
    }


}
