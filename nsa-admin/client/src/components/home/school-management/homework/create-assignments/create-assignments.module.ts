/**
 * Created by Sai Deepak on 05-Mar-17.
 */
import { NgModule } from '@angular/core';

import { CreateAssignmentsRoutingModule } from "./create-assignments.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { CreateAssignmentsComponent, AddAssignmentComponent, ViewAssignmentComponent } from '../../../../index';
import { TreeModule, SharedModule} from "primeng/primeng";

@NgModule({

    imports: [
        TreeModule, SharedModule, AppSharedModule,
        CreateAssignmentsRoutingModule
    ],
    exports: [],
    declarations: [CreateAssignmentsComponent, AddAssignmentComponent, ViewAssignmentComponent],
    providers: [],
})
export class CreateAssignmentsModule { }