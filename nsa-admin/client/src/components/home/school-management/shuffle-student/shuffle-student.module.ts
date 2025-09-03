/**
 * Created by Sai Deepak on 05-Mar-17.
 */
import { NgModule } from '@angular/core';

import { AppSharedModule } from "../../../shared/shared.module";
import { TreeModule, SharedModule} from "primeng/primeng";
import {ShuffleStudentsComponent} from "./shuffle-student.component";
import {AddShuffleStudentComponent} from "./add-shuffle-students/add-shuffle-students.component";
import {ShuffleStudentsRoutingModule} from "./shuffle-student.routing.module";

@NgModule({

    imports: [
        TreeModule, SharedModule, AppSharedModule,ShuffleStudentsRoutingModule
    ],
    exports: [],
    declarations: [AddShuffleStudentComponent, ShuffleStudentsComponent
    ],
    providers: [],
})
export class ShuffleStudentsModule { }