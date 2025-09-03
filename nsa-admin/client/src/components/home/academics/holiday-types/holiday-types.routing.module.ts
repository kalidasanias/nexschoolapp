/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HolidayTypesComponent} from "./holiday-types.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: HolidayTypesComponent}
        ])
    ],
    exports: [RouterModule],
})
export class HolidayTypesRoutingModule { }