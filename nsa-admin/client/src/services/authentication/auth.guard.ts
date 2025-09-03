/**
 * Created by SenthilPeriyasamy on 10/26/2016.
 */
import { Injectable }       from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild,
    NavigationExtras,
    CanLoad, Route
}                           from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import {BaseService} from "../base/base.service";
import {Constants} from "../../common/constants/constants";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private router: Router, private baseService: BaseService, private constants: Constants) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        let roles = route.data["roles"] as Array<string>;
        return this.check(url, roles);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        return this.checkLogin();
    }

    checkLogin(): boolean {
        if (tokenNotExpired()) {
            return true;
        }
        this.router.navigate(['/login']);
        this.baseService.showNotification('Logout Success!', 'Invalid Session, Please Login to Continue', this.constants.j_success);
        return false;
    }

    check(url: any, roles: any): boolean {
        var hasAnyRole = this.baseService.hasAnyRole(roles);
        if (tokenNotExpired() && hasAnyRole) {
            return true;
        }
        if(!hasAnyRole) {
            this.router.navigateByUrl(this.constants.unAuthorizedUrl)
            return false;
        }
        this.router.navigate(['/login'], { queryParams: { cburl: url }});
        return false;
    }
}
