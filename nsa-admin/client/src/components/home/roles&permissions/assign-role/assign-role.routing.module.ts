/**
 * Created by deepak on 6/14/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignRoleComponent } from "./assign-role.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AssignRoleComponent}
        ])
    ],
    exports: [RouterModule],
})
export class AssignRoleRoutingModule { }
