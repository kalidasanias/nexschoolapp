import {ServiceUrls} from "../../../../../../../common/constants/service.urls";
import {Component, OnInit, ViewChild} from "@angular/core";
import {GenerateReportConfigComponent} from "./config/generate-report-config.component";
import {BaseService} from "../../../../../../../services/base/base.service";
/**
 * Created by maggi on 26/05/17.
 */



@Component({
    selector : 'generate-report',
    templateUrl: 'generate-report.html'
})

export class GenerateReportComponent implements OnInit {

     @ViewChild(GenerateReportConfigComponent) generateReportConfig: GenerateReportConfigComponent

    constructor(private baseService: BaseService, private serviceUrls: ServiceUrls) { }

    ngOnInit() {
        this.baseService.setTitle('NSA - Written Exams');
    }

    genReportConfig(event: any) {
        this.generateReportConfig.show(event)
    }

}