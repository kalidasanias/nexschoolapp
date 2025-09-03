/**
 * Created by maggi on 22/05/17.
 */

import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {AssessmentComponent} from "./assessment.component";


@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AssessmentComponent}
        ])
    ],
    exports: [RouterModule],
})
export class AssessmentRoutingModule{ }