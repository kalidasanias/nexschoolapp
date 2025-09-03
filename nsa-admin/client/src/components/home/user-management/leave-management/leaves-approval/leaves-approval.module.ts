/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { AppSharedModule } from "../../../../shared/shared.module";
import { LeavesApprovalComponent } from "./leaves-approval.component";
import { ReportingEmployeeComponent } from "./reporting-employees/reporting-employees.component";
import { LeavesRequestedComponent } from "./leaves-requested/leaves-requested.component";
import { LeavesApprovalRoutingModule } from "./leaves-approval.routing.module";
import { ApprovalHistroyComponent } from "./leaves-requested/approval-history/approval-history.component";
import { RespondLeaveComponent } from "./leaves-requested/respond-leaves/respond-leaves.component";
import { ViewLeaveComponent } from "./reporting-employees/view-leave-details/view-leave-details.component";

@NgModule({

    imports: [
        AppSharedModule,
        LeavesApprovalRoutingModule
    ],
    exports: [],
    declarations: [LeavesApprovalComponent, ReportingEmployeeComponent, LeavesRequestedComponent, ApprovalHistroyComponent, RespondLeaveComponent, ViewLeaveComponent],
    providers: [],
})
export class LeavesApprovalModule { }