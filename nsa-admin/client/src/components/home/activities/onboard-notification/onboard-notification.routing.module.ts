/**
 * Created by intellishine on 8/18/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnboardNotificationComponent } from './onboard-notification.component';

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: OnboardNotificationComponent}
        ])
    ],
    exports: [RouterModule],
})

export class OnboardNotificationRoutingModule {}