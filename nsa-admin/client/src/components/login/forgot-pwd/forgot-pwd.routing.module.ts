/**
 * Created by senthil-p on 12/05/17.
 */
import { NgModule }       from '@angular/core';
import { RouterModule }   from '@angular/router';

import { ForgotPasswordComponent } from './forgot-pwd.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ForgotPasswordComponent}
        ])
    ],
    exports: [RouterModule],
})
export class ForgotPasswordRoutingModule {}
