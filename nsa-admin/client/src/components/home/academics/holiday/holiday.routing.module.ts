/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HolidayComponent} from "./holiday.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: HolidayComponent}
        ])
    ],
    exports: [RouterModule],
})
export class HolidayRoutingModule { }