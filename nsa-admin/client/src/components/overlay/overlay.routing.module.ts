/**
 * Created by senthil on 6/04/2017.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {OverlayComponent} from "./overlay.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: OverlayComponent}
        ])
    ],
    exports: [RouterModule],
})
export class OverlayRoutingModule { }