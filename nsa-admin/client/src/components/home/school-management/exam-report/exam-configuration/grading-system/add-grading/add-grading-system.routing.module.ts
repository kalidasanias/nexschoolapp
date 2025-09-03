/**
 * Created by senthil on 6/04/2017.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AddGradingSystemComponent} from "./add-grading.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AddGradingSystemComponent}
        ])
    ],
    exports: [RouterModule],
})
export class AddGradingSystemRoutingModule { }