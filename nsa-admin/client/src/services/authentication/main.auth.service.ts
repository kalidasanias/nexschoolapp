/**
 * Created by SenthilPeriyasamy on 10/26/2016.
 */
import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Http, Headers } from '@angular/http';

import { BaseService } from '../base/base.service'
import { ServiceUrls, MyRouters, Messages, Constants, contentHeaders } from '../../common/index';

@Injectable()
export class MainAuthService {
    constructor(public router: Router,
                public http: Http,
                private serviceUrl: ServiceUrls,
                private myRouters: MyRouters,
                private route: ActivatedRoute,
                private messages : Messages,
                private constants: Constants,
                private baseService : BaseService) {
    }

    authenticateNow(usercreds:any) {
        this.baseService.enableLoading();
        this.http.post(this.serviceUrl.authUrl, usercreds, {headers: contentHeaders}).subscribe(response => {
                var returnUrl = this.route.snapshot.queryParams['cburl'] || 'home';
                localStorage.setItem(this.constants.tocken, response.json().data.id_token);
                this.baseService.showNotification('Login Success!', this.messages.login_success, this.constants.j_success);
                this.router.navigateByUrl(returnUrl);
                this.baseService.disableLoading();
            },
            error => {
                this.baseService.showNotification('Login Failed!', error.json().message, this.constants.j_danger);
                this.baseService.disableLoading();
            });

    }

    validateSession() {
        this.http.get(this.serviceUrl.authUrl+'/validatesession', this.baseService.getHeader())
            .toPromise().then(result => this.callbackSuccess(result))
            .catch(error => this.callbackError(error));
    }

    callbackSuccess(result: any){
        if (result.json().data.status.code == 401) {
            this.router.navigateByUrl('login');
        } else {
            var academicYear = this.baseService.getAcademicYear();
            this.router.navigateByUrl('home?year=' + academicYear);
        }

    }

    callbackError(result: any) {
        this.router.navigate(['/login']);
    }

    resetPwd(usercreds:any) {

        this.baseService.enableLoading();

        var headers = new Headers();
        var creds = 'email=' + usercreds.email;
        headers.append(this.constants.content_type, this.constants.url_encoded);

        this.http.post(this.serviceUrl.forgotPwdUrl, creds, {headers: headers}).subscribe(response => {
                this.baseService.showNotification('Success!', response.json().msg, this.constants.j_success);
            },
            error => {
                this.baseService.showNotification('Error!', error.json().msg, this.constants.j_danger);
            });

    }

    logout() {
        this.http.post(this.serviceUrl.logoutUrl, {}, this.baseService.getHeader())
            .toPromise().then(result => this.callbackLogout(result, false ))
            .catch(error => this.callbackLogout(error, true));

    }

    callbackLogout(result:any, err:any) {
        if(err) {

        } else {
            localStorage.removeItem(this.constants.tocken);
            localStorage.removeItem(this.constants.syear);
            localStorage.removeItem(this.constants.cyear);
            this.router.navigate([this.myRouters.login]);
            this.baseService.showNotification('Logout Success!', this.messages.logout_success, this.constants.j_success);
        }
    }

}