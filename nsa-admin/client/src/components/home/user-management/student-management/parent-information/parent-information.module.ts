/**
 * Created by intellishine on 11/13/2017.
 */


import { NgModule } from '@angular/core';

import { AppSharedModule } from "../../../../shared/shared.module";
import { ParentInformationComponent } from "./parent-information.component";
import { ParentInformationRoutingModule } from "./parent-information.routing.module"
import { TreeModule, SharedModule, AutoCompleteModule} from "primeng/primeng";

@NgModule({
    imports: [
        ParentInformationRoutingModule,TreeModule,SharedModule, AppSharedModule,AutoCompleteModule

    ],
    exports:[],
    declarations:[ParentInformationComponent],
    providers: [],

})

export class ParentInformationModule { }