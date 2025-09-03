/**
 * Created by maggi on 19/05/17.
 */
import { NgModule } from '@angular/core';
import {AppSharedModule} from "../../../../../shared/shared.module";

import { GradingConfigurationRoutingModule } from "./grading-configuration.routing.module";

import { GradingConfigurationComponent } from '../../../../../index'
import {GradingAspectComponent} from "./grading-aspect/grading-aspect.component";
import {AddGradingAspectComponent} from "./grading-aspect/add-grading-aspect/add-grading.component";
import {GradingAssociationComponent} from "./grading-association/grading-association.component";
import {AddGradingAssociationComponent} from "./grading-association/add-grading-association/add-grading-association.component";

@NgModule({

    imports: [
        AppSharedModule,
        GradingConfigurationRoutingModule
    ],
    exports: [],
    declarations: [GradingConfigurationComponent, GradingAspectComponent, AddGradingAspectComponent, GradingAssociationComponent, AddGradingAssociationComponent ],
    providers: [],
})
export class GradingConfigurationModule { }