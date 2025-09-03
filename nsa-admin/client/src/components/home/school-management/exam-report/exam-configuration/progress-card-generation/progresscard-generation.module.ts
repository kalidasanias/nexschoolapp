/**
 * Created by maggi on 24/05/17.
 */
import {NgModule} from "@angular/core";
import {AppSharedModule} from "../../../../../shared/shared.module";
import {ProgressCardGenrationRoutingModule} from "./progresscard-generation.routing.module";
import {ProgressCardGenerationComponent} from "./progresscard-generation.component";
import {MarkUploadComponent} from "./mark-upload/mark-upload.component";
import {ProgressCardStatistics} from "./mark-upload/progress-card-statistics/progress-card-statistics.component";
import {MarkUploadConfigComponent} from "./mark-upload/mark-upload-config/mark-upload-config.component";
import {AddMarkUploadComponent} from "./mark-upload/mark-upload-config/add-mark-upload/add-mark-upload.component";
import {GenerateReportConfigComponent} from "./generate-report/config/generate-report-config.component";
import {GenerateReportComponent} from "./generate-report/generate-report.component";
import {GenerateMarkSheetComponent} from "./generate-report/config/generate-mark-sheet/generate-mark-sheet.component";
import {MarklistUploadComponent} from "./mark-upload/marklist-upload/marklist-upload.component";
import {PrintProgressCardComponent} from "./mark-upload/print-progress-card/print-progress-card.component";

@NgModule({

    imports: [
        AppSharedModule,
        ProgressCardGenrationRoutingModule
    ],
    exports: [],
    declarations: [GenerateMarkSheetComponent,GenerateReportConfigComponent,GenerateReportComponent,AddMarkUploadComponent,MarkUploadConfigComponent,ProgressCardStatistics,MarkUploadComponent,ProgressCardGenerationComponent, MarklistUploadComponent, PrintProgressCardComponent],
    providers: [],
})

export class ProgressCardGenerationModule { }
