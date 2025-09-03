import {AppSharedModule} from "../../../../../../../shared/shared.module";
import {NgModule} from "@angular/core";
import {GenerateReportConfigRoutingModule} from "./generate-report-config.routing.module";
/**
 * Created by maggi on 26/05/17.
 */



@NgModule({

    imports: [
        AppSharedModule,
        GenerateReportConfigRoutingModule
    ],
    exports: [],
    declarations: [],
    providers: [],
})
export class GenerateReportConfigModule { }