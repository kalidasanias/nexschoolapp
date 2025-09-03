/**
 * Created by maggi on 07/05/17.
 */
import { NgModule } from '@angular/core';
import {AppSharedModule} from "../../../../../shared/shared.module"
import {ExamSettingsComponent} from "./exam-settings.component";
import {ExamSettingsRoutingModule} from "./exam-settings.routing.module";
import {WrittenExamComponent} from "./written-exam/written-exam.component";
import {AddExamComponent} from "./written-exam/add-writtenexam/add-exam.component";
import {ExamScheduleComponent} from "./exam-schedule/exam-schedule.component";
import {AddExamScheduleComponent} from "./exam-schedule/add-examination/add-exam-schedule.component";
import {NKDatetimeModule} from "ng2-datetime/ng2-datetime";


@NgModule({

    imports: [
        AppSharedModule,
        NKDatetimeModule,
        ExamSettingsRoutingModule
    ],
    exports: [],
    declarations: [AddExamScheduleComponent,ExamScheduleComponent,AddExamComponent,WrittenExamComponent,ExamSettingsComponent],
    providers: [],
})
export class ExamSettingsModule { }