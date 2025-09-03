/**
 * Created by senthil-p on 11/05/17.
 */
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../../../services/validation/validation.service";
import {BaseService} from "../../../../services/index";
import {ServiceUrls} from "../../../../common/constants/service.urls";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    selector: 'change-pwd',
    templateUrl:'change-pwd.html'
})

export class ChangePasswordComponent implements OnInit{

    changePasswordForm:FormGroup;

    constructor(private fb: FormBuilder,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private baseService: BaseService){

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Change Password');
        this.createForm();
    }

    createForm() {
        this.changePasswordForm = this.fb.group({
            'oldPassword': [null, [Validators.required]],
            'newPassword': [null, Validators.required],
            'confirmNewPassword': [null, [Validators.required, ValidationService.passwordMatch]]
        });
    }

    changePassword(value: any){
        if(this.changePasswordForm.valid){
            this.commonService.put(this.serviceUrls.changePwdUrl, value).then(
                result => this.callback(result, false),
                error => this.callback(<any>error, true))

        }
    }

    callback(result: any, err: any) {
        if(err) {
            this.changePasswordForm.controls['oldPassword'].setErrors({wrongPassword: false});
        } else {
            this.changePasswordForm.reset();
            this.baseService.showNotification('Success!', result.message, 'bg-success');
        }
    }
}
