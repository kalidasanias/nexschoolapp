/**
 * Created by senthil-p on 11/05/17.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangePasswordComponent } from "./change-pwd.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ChangePasswordComponent}
        ])
    ],
    exports: [RouterModule],
})
export class ChangePasswordRoutingModule { }