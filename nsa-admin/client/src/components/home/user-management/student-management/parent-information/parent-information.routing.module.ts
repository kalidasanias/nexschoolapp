/**
 * Created by intellishine on 11/13/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParentInformationComponent} from "./parent-information.component";

const routes: Routes = [
];

@NgModule({
    imports:[
        RouterModule.forChild([
            {path: '', component: ParentInformationComponent }
        ])
    ],

})
export class ParentInformationRoutingModule { }