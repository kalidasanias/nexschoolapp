import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard }          from '../../services/index';
import {SuccessComponent} from "../home/confirmation/success/success.component";
import * as myGlobals from '../../common/constants/global';
import {FailureComponent} from "../home/confirmation/failure/failure.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'home',
        loadChildren: '../home/home.module#HomeModule',
        data: {breadcrumb: 'Home'}
      },
      {
        path: '',
        redirectTo: '/session',
        pathMatch: 'full'
      },

      {
        path: 'success',
        component: SuccessComponent,
        pathMatch: 'full',
        data: {roles: myGlobals.ALL_USER}
      },
      {
        path: 'failure',
        component: FailureComponent,
        pathMatch: 'full',
        data: {roles: myGlobals.ALL_USER}
      },

      {
        path: 'login',
        redirectTo: '/login',
        pathMatch: 'full',
        data: {roles: myGlobals.ALL_USER}
      },
    ], { useHash: true })
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class AppRoutingModule {}
