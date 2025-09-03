/**
 * Created by Cyril on 2/22/2017.
 */
import { NgModule } from '@angular/core';
import { HolidayRoutingModule} from "./holiday.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { HolidayComponent } from "../holiday/holiday.component";
import { AddSchoolHolidayTypeComponent } from "../holiday/add-school-holidays/add-school-holidays.component"
import { AddWeekOffComponent } from "./add-week-off/add-week-off.component";

@NgModule({

    imports: [
        AppSharedModule,
        HolidayRoutingModule
    ],
    exports: [],
    declarations: [HolidayComponent,AddSchoolHolidayTypeComponent, AddWeekOffComponent],
    providers: [],
})
export class HolidayModule { }