/**
 * Created by senthil on 1/24/2017.
 */
import {NgModule} from "@angular/core";
import {AssignFeeRoutingModule} from "./assign-fee.routing.module";
import {SharedModule, TreeModule} from "primeng/primeng";
import {AddNewFeeComponent, AssignFeeComponent, FeeDetailsComponent} from "../../../index";
import {AppSharedModule} from "../../../shared/shared.module";
import {PublishFeeComponent} from "./publish/publish-fee.component";

@NgModule({
    imports: [
         TreeModule, SharedModule, AppSharedModule,
        AssignFeeRoutingModule
    ],
    exports: [],
    declarations: [AssignFeeComponent, AddNewFeeComponent, FeeDetailsComponent, PublishFeeComponent],
})
export class AssignFeeModule { }