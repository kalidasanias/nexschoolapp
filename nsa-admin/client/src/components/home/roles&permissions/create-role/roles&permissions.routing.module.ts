/**
 * Created by senthil-p on 08/06/17.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {RolesAndPermissionsComponent} from "./roles&permissions.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: RolesAndPermissionsComponent}
        ])
    ],
    exports: [RouterModule],
})
export class RolesAndPermissionsRoutingModule { }
