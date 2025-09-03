/**
 * Created by maggi on 22/05/17.
 */
import { NgModule } from '@angular/core';

import { AppSharedModule } from "../../../../../../shared/shared.module";
import {GradingAssociationRoutingModule} from "./grading-association.routing.module";


@NgModule({

    imports: [
        AppSharedModule,
        GradingAssociationRoutingModule
    ],
    exports: [],
    declarations: [],
    providers: [],
})
export class GradingAssociationModule { }