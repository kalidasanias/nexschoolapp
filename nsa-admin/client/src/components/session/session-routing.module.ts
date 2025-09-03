import { NgModule }       from '@angular/core';
import { RouterModule }   from '@angular/router';

import { SessionComponent } from './session.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'session', component: SessionComponent }
    ])
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class SessionRoutingModule {}
