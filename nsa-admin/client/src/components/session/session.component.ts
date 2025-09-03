import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Http } from "@angular/http";
import { MainAuthService } from "../../services/index";

declare function enableLoading(): void;
@Component({
    template: `
    <router-outlet></router-outlet>
  `
})

export class SessionComponent implements OnInit {
    constructor(private router: Router, private http: Http, public authService: MainAuthService) {}
    ngOnInit() {
        this.authService.validateSession();
    }

}