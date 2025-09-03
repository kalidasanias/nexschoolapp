/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { CourseManagementRoutingModule } from "./course-management.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { CourseManagementComponent } from "../course-management/course-management.component";

@NgModule({

    imports: [
        AppSharedModule,
        CourseManagementRoutingModule
    ],
    exports: [],
    declarations: [CourseManagementComponent],
    providers: [],
})
export class CourseManagementModule { }