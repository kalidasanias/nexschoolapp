/**
 * Created by senthil-p on 08/06/17.
 */
import { NgModule } from '@angular/core';
import {AppSharedModule} from "../../../shared/shared.module";
import {RolesAndPermissionsRoutingModule} from "./roles&permissions.routing.module";
import {RolesAndPermissionsComponent} from "./roles&permissions.component";
import {AddRoleComponent} from "./add-roles/add-role.component";
import { AutoCompleteModule } from "primeng/primeng";

@NgModule({
    imports: [
        AppSharedModule,
        RolesAndPermissionsRoutingModule, AutoCompleteModule
    ],
    exports: [],
    declarations: [RolesAndPermissionsComponent, AddRoleComponent],
    providers: [],
})
export class RolesAndPermissionsModule { }