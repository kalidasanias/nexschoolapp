import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../../../../services/base/base.service";
import {AddMarkUploadComponent} from "../../mark-upload/mark-upload-config/add-mark-upload/add-mark-upload.component";
import {Component, OnInit, ViewChild} from "@angular/core";
import {GenerateMarkSheetComponent} from "./generate-mark-sheet/generate-mark-sheet.component";
/**
 * Created by maggi on 26/05/17.
 */

@Component({
    selector : 'generate-report-config',
    templateUrl: 'generate-report-config.html'
})

export class GenerateReportConfigComponent implements OnInit {
    modalId: any;

    @ViewChild(GenerateMarkSheetComponent) generateMarkSheetComponent: GenerateMarkSheetComponent


    constructor(private baseService: BaseService, private fb: FormBuilder) { }

    ngOnInit() {
        //throw new Error("Method not implemented.");
    }

    show(event: any) {
        this.baseService.openOverlay(event);
    }

    closeOverlay() {
        this.baseService.closeOverlay("#generate-report-config");
    }

    genProgressCard(event: any) {
        this.generateMarkSheetComponent.show(event);
    }


}