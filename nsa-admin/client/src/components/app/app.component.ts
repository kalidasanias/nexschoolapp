import { Component, OnInit } from '@angular/core';
import {BaseService} from "../../services/base/base.service";
import {Router} from "@angular/router";
import {Constants} from "../../common/constants/constants";

declare function enableLoading(): void;
@Component({
  selector: 'my-app',
  template: `
      <input id= "logoutId" type="hidden" (click)="logout()">
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  constructor(private baseService: BaseService, private router: Router, private constants: Constants){
    baseService.addBackgroundImage();
  }
  ngOnInit() {

  }

  logout() {
    this.router.navigateByUrl('login');

  }
}
