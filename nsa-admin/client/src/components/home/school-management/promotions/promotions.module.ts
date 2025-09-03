/**
 * Created by Sai Deepak on 05-Mar-17.
 */
import { NgModule } from '@angular/core';

import { AppSharedModule } from "../../../shared/shared.module";
import { TreeModule, SharedModule} from "primeng/primeng";
import {PromotionsComponent} from "./promotions.component";
import {PromotionsRoutingModule} from "./promotions.routing.module";
import {PromoteStudentComponent} from "./promote-students/promote-students.component";
import {ViewPromotedStudentsComponent} from "./view-promoted-students/view-promoted-students.component";
import {DepromotedStudentsComponent} from "./depromoted-students/depromote-students.component";
import {PromoteStudentReportComponent} from "./promote-student-report/promote-student-report.component";

@NgModule({

    imports: [
        TreeModule, SharedModule, AppSharedModule,
        PromotionsRoutingModule
    ],
    exports: [],
    declarations: [PromotionsComponent, PromoteStudentComponent, ViewPromotedStudentsComponent,DepromotedStudentsComponent, PromoteStudentReportComponent
    ],
    providers: [],
})
export class PromotionsModule { }