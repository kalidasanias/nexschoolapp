/**
 * Created by maggi on 26/05/17.
 */

import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {GenerateReportComponent} from "./generate-report.component";





const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: GenerateReportComponent}
        ])
    ],
    exports: [RouterModule],
})
export class GenerateReportRoutingModule{ }