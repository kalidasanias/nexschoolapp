/**
 * Created by Cyril on 2/22/2017.
 */
import { NgModule } from '@angular/core';
import { ExamScheduleRoutingModule } from "./exam-schedule.routing.module";
import { AppSharedModule } from "../../../../../../shared/shared.module";
import { ExamScheduleComponent } from "./exam-schedule.component";
import {AddExamScheduleComponent} from "./add-examination/add-exam-schedule.component";

@NgModule({

    imports: [
        AppSharedModule,
        ExamScheduleRoutingModule
    ],
    exports: [],
    declarations: [ExamScheduleComponent, AddExamScheduleComponent],
    providers: [],
})
export class ExamScheduleModule { }