/**
 * Created by maggi on 24/05/17.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ProgressCardGenerationComponent} from "./progresscard-generation.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ProgressCardGenerationComponent}
        ])
    ],
    exports: [RouterModule],
})
export class ProgressCardGenrationRoutingModule{ }