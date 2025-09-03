/**
 * Created by senthil on 3/25/2017.
 */
import {NgModule} from "@angular/core";
import {AppSharedModule} from "../../../shared/shared.module";
import {SuccessComponent} from "./success.component";
import {SuccessRoutingModule} from "./success.routing.module";

@NgModule({
    imports: [
        SuccessRoutingModule,
        AppSharedModule
    ],
    exports: [],
    declarations: [SuccessComponent],
})
export class SuccessModule { }