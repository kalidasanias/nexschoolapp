/**
 * Created by senthil on 1/24/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationComponent } from "./notification.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild(<Routes>[
            {path: '', component: NotificationComponent}
        ])
    ],
    exports: [RouterModule],
})
export class NotificationRoutingModule { }