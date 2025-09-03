/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseManagementComponent} from "./course-management.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CourseManagementComponent}
        ])
    ],
    exports: [RouterModule],
})
export class CourseManagementRoutingModule { }