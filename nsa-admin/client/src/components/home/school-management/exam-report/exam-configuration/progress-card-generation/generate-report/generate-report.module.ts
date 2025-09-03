/**
 * Created by maggi on 26/05/17.
 */


import {AppSharedModule} from "../../../../../../shared/shared.module";
import {NgModule} from "@angular/core";
import {GenerateReportRoutingModule} from "./generate-report.routing.module";


@NgModule({

    imports: [
        AppSharedModule,
        GenerateReportRoutingModule
    ],
    exports: [],
    declarations: [],
    providers: [],
})
export class GenerateReportModule { }