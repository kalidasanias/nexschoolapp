/**
 * Created by maggi on 07/05/17.
 */
import { NgModule } from '@angular/core';
import {AppSharedModule} from "../../../../../shared/shared.module"
import {ProgressCardConfigComponent} from "./progress-card-config.component";
import {ProgressCardConfigRoutingModule} from "./progress-card-config.routing.module";
import {WrittenExamComponent} from "./written-exam/written-exam.component";
import {AddExamComponent} from "./written-exam/add-writtenexam/add-exam.component";
import {AddAssessmentComponent} from "./assessment/add-assessment/add-assessment.component";
import {AssessmentComponent} from "./assessment/assessment.component";
import {AddProgressCardSettingComponent} from "./configuration/add-configuration/add-configuration.component";
import {ProgressCardSettingComponent} from "./configuration/configuration.component";


@NgModule({

    imports: [
        AppSharedModule,
        ProgressCardConfigRoutingModule
    ],
    exports: [],
    declarations: [AddProgressCardSettingComponent,ProgressCardSettingComponent, AddAssessmentComponent,AssessmentComponent, AddExamComponent,WrittenExamComponent,ProgressCardConfigComponent],
    providers: [],
})
export class ProgressCardModule { }