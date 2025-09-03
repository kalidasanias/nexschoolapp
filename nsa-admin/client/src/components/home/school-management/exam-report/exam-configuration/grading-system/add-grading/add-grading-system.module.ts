/**
 * Created by senthil on 6/04/2017.
 */


import {NgModule} from "@angular/core";

import {AddGradingSystemRoutingModule} from "./add-grading-system.routing.module";
import {AppSharedModule} from "../../../../../../shared/shared.module";
import {AddGradingSystemComponent} from "./add-grading.component";

@NgModule({

    imports: [
        AppSharedModule,
        AddGradingSystemRoutingModule
    ],
    exports: [],
    declarations: [AddGradingSystemComponent],
    providers: [],
})
export class AddGradingSystemModule { }