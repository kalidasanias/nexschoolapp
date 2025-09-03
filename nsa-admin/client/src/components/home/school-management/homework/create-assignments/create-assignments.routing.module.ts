/**
 * Created by Sai Deepak on 05-Mar-17.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAssignmentsComponent } from "./create-assignments.component"


const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CreateAssignmentsComponent}
        ])
    ],
    exports: [RouterModule],
})
export class CreateAssignmentsRoutingModule { }