/**
 * Created by Cyril on 2/22/2017.
 */
import { NgModule } from '@angular/core';
import { ClassesRoutingModule } from "./classes.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { ClassesComponent } from "../classes/classes.component";

@NgModule({

    imports: [
        AppSharedModule,
        ClassesRoutingModule
    ],
    exports: [],
    declarations: [ClassesComponent],
    providers: [],
})
export class ClassesModule { }