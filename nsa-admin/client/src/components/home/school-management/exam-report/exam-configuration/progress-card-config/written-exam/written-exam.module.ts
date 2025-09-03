/**
 * Created by maggi on 07/05/17.
 */
import { NgModule } from '@angular/core';
import {AppSharedModule} from "../../../../../../shared/shared.module";

import { WrittenExamRoutingModule } from "./written-exam.routing.module";
import { AddExamComponent } from '../../../../../../index'
import { WrittenExamComponent } from '../../../../../../index'

@NgModule({

    imports: [
        AppSharedModule
    ],
    exports: [],
    declarations: [],
    providers: [],
})
export class WrittenExamModule { }