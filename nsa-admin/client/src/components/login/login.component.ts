import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";

import {MainAuthService} from "../../services/index";
import {BaseService} from "../../services/base/base.service";

@Component({
  templateUrl: 'login.html'

})
export class LoginComponent {
    userForm: any;

    constructor(private baseService: BaseService, private authService: MainAuthService, private formBuilder: FormBuilder) {
      this.userForm = this.formBuilder.group({
          'username': ['', Validators.required],
          'password': ['', [Validators.required]]
      });
        baseService.addBackgroundImage();
    }

    ngOnInit(){
        this.baseService.setTitle('NSA - Login');
    }

    authenticate() {
        if (this.userForm.dirty && this.userForm.valid) {
            this.authService.authenticateNow(this.userForm.value);
        }
    }

}
