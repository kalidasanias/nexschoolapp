/**
 * Created by Cyril on 2/22/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesignationComponent} from "./designation.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: DesignationComponent}
        ])
    ],
    exports: [RouterModule],
})
export class DesignationRoutingModule { }