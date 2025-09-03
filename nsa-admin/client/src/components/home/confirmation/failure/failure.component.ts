/**
 * Created by senthil on 3/25/2017.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'failure',
    templateUrl: 'failure.html'
})
export class FailureComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute) {

    }
    errorCode: any = 404
    errorMsg: any = 'Oops, an error has occurred. Forbidden!'
    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.errorCode = params['errorCode'];
            this.errorMsg = params['errorMsg'];
            console.log(this.errorCode);
        });
    }
}