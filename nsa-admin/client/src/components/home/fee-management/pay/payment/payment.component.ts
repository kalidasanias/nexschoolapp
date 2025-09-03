/**
 * Created by senthil on 2/16/2017.
 */
import {Component, ElementRef, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";

import {BaseService} from "../../../../../services/index";
import {ValidationService} from "../../../../../services/validation/validation.service";
import {Form} from "./payment.form";
import {ServiceUrls} from "../../../../../common/constants/service.urls";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    selector: 'payment',
    templateUrl: 'payment.html'
})
export class PaymentComponent {
    @ViewChild('dob') dob: ElementRef
    @ViewChild('amount') amount: ElementRef

    feeDetails: any;
    userDetails: any;
    paymentForm: any
    form = new Form();
    feeId: any;
    event: any

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                public router: Router) {
        this.createForm(this.form);
    }

    openOverlay() {
        this.baseService.openOverlay(this.event)
    }

    closeOverlay() {
        this.baseService.closeOverlay('#payment');
    }

    createForm(form: any) {
        this.paymentForm = this.fb.group({
            'userId': '',
            'firstName': [form.firstName, Validators.required],
            'lastName': ['', Validators.required],
            'dob': '',
            'addressLine1': ['', Validators.required],
            'addressLine2': [''],
            'state': ['', Validators.required],
            'city': ['', Validators.required],
            'country': ['', Validators.required],
            'pincode': ['', [Validators.required, ValidationService.pincodeValidator, Validators.minLength(6), Validators.maxLength(6)]],
            'emailAddress': ['', [Validators.required, ValidationService.emailValidator]],
            'primaryPhone': ['', [Validators.required, ValidationService.phoneValidator, Validators.minLength(10), Validators.maxLength(10)]]
        });
    }

    pay() {
        this.paymentForm._value['dob'] = this.dob.nativeElement.value
        this.commonService.updateUserContactDetails(this.paymentForm._value);
        this.closeOverlay();
        this.baseService.enableLoading();
        this.router.navigate(['/home/ccavenue/' + this.feeId])
    }

    getPaymentDetailsById(event: any) {
        this.event = event
        var id = event.target.value;
        this.feeId = id;
        this.commonService.get(this.serviceUrls.getFeeAssignmentDetail + id).then(
            result => this.feeDetails = result
        );

        this.getUserContactDetails();
    }

    getUserContactDetails() {
        this.commonService.get(this.serviceUrls.getUserContactDetails).then(
            result => this.setFormValues(result)
        );
    }

    setFormValues(result: any) {
        this.dob.nativeElement.value = result['dob'];
        var emailAddress = result['emailAddress'] !=null ? result['emailAddress'] : '';
        this.paymentForm = this.fb.group({
            'userId': [result['userId'], Validators.required],
            'firstName': [result['firstName'], Validators.required],
            'lastName': [result['lastName'], Validators.required],
            'addressLine1': [result['addressLine1'], Validators.required],
            'addressLine2': [result['addressLine2']],
            'state': [result['state'], Validators.required],
            'city': [result['city'], Validators.required],
            'country': [result['country'], Validators.required],
            'pincode': [result['pincode'], [Validators.required, Validators.pattern('[0-9]{6}'), Validators.minLength(6), Validators.maxLength(6)]],
            'emailAddress': [emailAddress, [Validators.required, ValidationService.emailValidator]],
            'primaryPhone': [result['primaryPhone'], [Validators.required, ValidationService.phoneValidator, Validators.minLength(10), Validators.maxLength(10)]]
        });
        this.openOverlay();
    }


}