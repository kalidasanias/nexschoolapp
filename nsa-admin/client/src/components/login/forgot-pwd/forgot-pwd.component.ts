/**
 * Created by senthil-p on 12/05/17.
 */
import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {ValidationService} from "../../../services/validation/validation.service";
import {BaseService} from "../../../services/base/base.service";
import {Router} from "@angular/router";
import {ServiceUrls} from "../../../common/constants/service.urls";
import {CommonService} from "../../../services/common/common.service";

@Component({
    templateUrl: 'forgot-pwd.html'

})
export class ForgotPasswordComponent {
    userForm: any;
    resetForm: any;
    secret: any;
    showResetForm: boolean;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private router: Router,
                private formBuilder: FormBuilder) {
        this.createForm();
    }

    ngOnInit(){
        this.baseService.setTitle('NSA - Reset Password');
    }


    resetPassword() {
        console.log(this.userForm.value.username)
        if(this.resetForm.valid){
            var form = this.resetForm.value
            form.secret = this.secret;
            form.username = this.userForm.value.username
            this.commonService.postWithOutSessionId(this.serviceUrls.resetPwdUrl, form).then(
                result => this.resetPasswordCallback(result, false),
                error => this.resetPasswordCallback(<any>error, true))
        }
    }

    resetPasswordCallback(result: any, err: any) {
        if(err) {
            this.baseService.showNotification('Failure!', result, 'bg-danger');
        } else {
            this.router.navigate(['/login']);
            this.baseService.showNotification('Success!', result.message, 'bg-success');
        }
    }

    sendOTP() {
        if(this.userForm.valid){
            this.commonService.postWithOutSessionId(this.serviceUrls.sendOtpUrl, this.userForm.value).then(
                result => this.otpCallback(result, false),
                error => this.otpCallback(<any>error, true))
        }
    }

    otpCallback(result: any, err: any) {
        if(err) {
            this.baseService.showNotification('Success!', result.message, 'bg-danger');
        } else {
            this.secret = result.secret
            this.showResetForm = true
        }
    }

    createForm() {
        this.userForm = this.formBuilder.group({
            'username': ['', Validators.required],
        });

        this.resetForm = this.formBuilder.group({
            'otp': [null, [Validators.required]],
            'newPassword': [null, Validators.required],
            'confirmNewPassword': [null, [Validators.required, ValidationService.passwordMatch]]
        });
    }

    backToLogin() {
        this.baseService.navigateByRouterPath('login')
    }

}
