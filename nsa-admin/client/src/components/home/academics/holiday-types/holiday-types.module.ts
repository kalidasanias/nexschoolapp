/**
 * Created by Cyril on 2/22/2017.
 */
import { NgModule } from '@angular/core';
import { HolidayTypesRoutingModule} from "./holiday-types.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { HolidayTypesComponent } from "../holiday-types/holiday-types.component";
import { AddHolidayTypeComponent } from "../holiday-types/add-holiday-type/add-holiday-type.component"

@NgModule({

    imports: [
        AppSharedModule,
        HolidayTypesRoutingModule
    ],
    exports: [],
    declarations: [HolidayTypesComponent,AddHolidayTypeComponent],
    providers: [],
})
export class HolidayTypesModule { }