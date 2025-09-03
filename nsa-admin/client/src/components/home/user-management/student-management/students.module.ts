/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { StudentsRoutingModule } from "./students.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { StudentsComponent } from "./students.component";
import {AddStudentComponent} from "./add-students/add-student.component";
import {StudentReportComponent} from "./student-report/student-report.component";

@NgModule({

    imports: [
        AppSharedModule,
        StudentsRoutingModule
    ],
    exports: [],
    declarations: [StudentsComponent, AddStudentComponent, StudentReportComponent],
    providers: [],
})
export class StudentsModule { }