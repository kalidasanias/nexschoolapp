import { NgModule }       from '@angular/core';
import { RouterModule }   from '@angular/router';

import { LoginComponent } from './login.component';
import * as myGlobals from '../../common/constants/global';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'login', component: LoginComponent, data: {roles: myGlobals.ALL_USER} },
      { path: 'login/forgot-pwd', loadChildren: './forgot-pwd/forgot-pwd.module#ForgotPasswordModule', data: {roles: myGlobals.ALL_USER} },
    ])
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class LoginRoutingModule {}
