import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {DashboardNotificationsComponent} from "./notifications.component";

const routes: Routes = [
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardNotificationsRoutingModule { }