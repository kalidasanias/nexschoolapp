
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HallOfFameComponent } from "./hall-of-fame.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: HallOfFameComponent}
        ])
    ],
    exports: [RouterModule],
})
export class HallOfFameRoutingModule { }