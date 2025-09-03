/**
 * Created by maggi on 26/05/17.
 */

import {RouterModule, Routes} from "@angular/router";
import {GenerateReportConfigComponent} from "./generate-report-config.component";
import {NgModule} from "@angular/core";


const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: GenerateReportConfigComponent}
        ])
    ],
    exports: [RouterModule],
})
export class GenerateReportConfigRoutingModule{ }