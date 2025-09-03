/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { SubjectListRoutingModule } from "./subject-list.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { SubjectListComponent } from "../subject-list/subject-list.component";
import { AspectsComponent} from "./aspects/aspects.component";
import { SchoolSubjectsComponent } from "./school-subjects/school-subjects.component";

@NgModule({

    imports: [
        AppSharedModule,
        SubjectListRoutingModule
    ],
    exports: [],
    declarations: [SubjectListComponent,AspectsComponent,SchoolSubjectsComponent],
    providers: [],
})
export class SubjectListModule { }