/**
 * Created by SenthilPeriyasamy on 10/26/2016.
 */
import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";

import {MainAuthService} from "../../../services/index";
import {BaseService} from "../../../services/base/base.service";
import {CommonService} from "../../../services/common/common.service";
import {ServiceUrls} from "../../../common/constants/service.urls";
declare var $ :any;
declare var _: any;

@Component({
    selector: 'top-nav',
    templateUrl: 'top-nav.html'
})
export class TopNavComponent implements OnInit {
    user: any;
    schoolDetails: any;
    schoolName: any;
    academicYears: any;
    currentyear : any;
    selecYear: any;
    constructor(private router: Router,
                private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private authService : MainAuthService,
                private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {

    }

    ngOnInit() {
        this.user = this.baseService.findUser();
        this.getSchoolDetails();
        this.getAcademicYears();
    }

    selectYear(event: any) {
        this.baseService.setAcademicYear(event.target.value);
        window.location.reload();
    }

    getSchoolDetails(){
        this.commonService.get(this.serviceUrls.getSchoolDetails).then(schoolDetails => this.callback(schoolDetails));
    }

    callback(details: any){
        this.schoolName = details.school_name;
        if(details.logo){
            var url = this.baseService.getBaseUrlWithoutSchool();
            this.schoolDetails = url + details.logo;
        }
    }

    getAcademicYears() {
        this.commonService.get(this.serviceUrls.getAcademicYears).then(
            classes => this.callBackYears(classes)
        )
    }

    callBackYears(data: any) {
        this.academicYears = data;
        this.currentyear = data[data.length -1].academicYear;
        if(localStorage.getItem("syear") != null) {
            setTimeout(function () {
                $("div.ids select").val(localStorage.getItem("syear"));
            },100)
        } else {
            this.baseService.setAcademicYear(this.currentyear);
        }



    }

    logout() {
        this.authService.logout();
    }
}