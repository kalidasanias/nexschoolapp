/**
 * Created by intellishine on 9/11/2017.
 */
import { NgModule } from '@angular/core';
import { AddHallOfFameComponent } from "./add-hall-of-fame/add-hall-of-fame.component";
import { AppSharedModule } from "../../../shared/shared.module";
import { PublishHallOfFameComponent } from "./publish-hall-of-fame/publish-hall-of-fame.component";
import { ViewHallOfFameComponent } from "./view-hall-of-fame/view-hall-of-fame.component";
import {HallOfFameComponent} from "./hall-of-fame.component";
import { TreeModule, SharedModule, AutoCompleteModule} from "primeng/primeng";
import {HallOfFameRoutingModule} from "./hall-of-fame.routing.module"

@NgModule({

    imports: [
        SharedModule, AppSharedModule,AutoCompleteModule,
        HallOfFameRoutingModule
    ],
    exports: [],
    declarations: [HallOfFameComponent, AddHallOfFameComponent, ViewHallOfFameComponent, PublishHallOfFameComponent],
    providers: [],
})
export class HallOfFameModule { }