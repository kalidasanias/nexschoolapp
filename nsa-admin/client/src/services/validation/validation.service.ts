import {AbstractControl, FormControl, ValidatorFn, Validators} from "@angular/forms";
export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            required: 'Required Field',
            pattern: 'Given Value is Invalid to this Field',
            invalidEmailAddress: 'Invalid email address',
            invalidPhoneNumber: 'Invalid phone',
            invalidPincode: 'Invalid Pincode',
            invalidNumber: 'Use numbers only',
            min: 'min value 1 Only',
            max: 'Max value 60 Only',
            number: 'Not a Number',
            passwordMatch: 'Password mismatch',
            partialAmount: "The amount collected cannot be less than 1 and cannot exceed pending amount",
            wrongPassword: 'Wrong Password',
            invalidAlphabet:'Use Alphabets only',
            nospace :'Please Check Your Fields For Spaces',
            invalidPassword: 'Invalid password. Password must be at least 6 characters long, and contain a number.',
            minlength: `Minimum length ${validatorValue.requiredLength}`,
            maxlength: `maximum length ${validatorValue.requiredLength}`,
            alphaNumeric:'Use Alpha Numeric Only',
            selectedspecialchar:' Only the following special characters are allowed & ( ) , - @ : ; / '
        };
        return config[validatorName];
    }

    static emailValidator(control: any) {
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    static passwordValidator(control: any) {
        if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }
    static numberValueValidator(prms = {}, errType: any): ValidatorFn {
        return (control: FormControl): {[key: string]: any} => {
            let val: number = control.value;
            var obj = {}
            obj[errType] = true
            if(isNaN(val) || /\D/.test(val.toString())) {
                return {"number": prms};
            } else if(!isNaN(prms['min']) && !isNaN(prms['max'])) {
                return val < prms['min'] || val > prms['max'] ? obj : null;
            } else if(!isNaN(prms['min'])) {
                return val < prms['min'] ? obj : null;
            } else if(!isNaN(prms['min'])) {
                return val > prms['min'] ? obj : null;
            } else {
                return null;
            }
        };
    }

    static phoneValidator(control: any) {
        var re = new RegExp("^[0-9]{1,10}$");
        // if (control.value.match(/[0-9]+/)) {
        if (re.test(control.value)) {
            return null;
        } else {
            return { 'invalidPhoneNumber': true };
        }
    }

    static maxValue(max: number): ValidatorFn {
        return (control: FormControl): { [key: string]: boolean } | null => {

            let val: number = control.value;

            if (control.pristine || control.pristine) {
                return null;
            }
            if (val <= max) {
                return null;
            }
            return { 'max': true };
        }
    }

    static minValue(min: number): ValidatorFn {
        return (control: FormControl): { [key: string]: boolean } | null => {

            let val: number = control.value;

            if (control.pristine || control.pristine) {
                return null;
            }
            if (val >= min) {
                return null;
            }
            return { 'min': true };
        }
    }

    static alphabetValidator(control:any){
        if(control.value.match(/^([^0-9]*)$/)){
            return null
        }else {
            return { 'invalidAlphabet' : true};
        }
    }

    static numberValidator(control: any) {
        var re = new RegExp("[0-9]+");
        // if (control.value.match(/[0-9]+/)) {
        //match(/^\d+$/)
        if (re.test(control.value)) {
            return null;
        } else {
            return { 'invalidNumber': true };
        }
    }

    static negitiveNumberValidator(control: any){
       //negitive numbers entered showing error this method
        if (control.value.match(/^\d+$/)) {
            return null;
        } else {
            return { 'invalidNumber': true };
        }
    }

    static pincodeValidator(control: any) {
        if (control.value.match(/[0-9]+/)) {
            return null;
        } else {
            return { 'invalidPincode': true };
        }
    }

    static creditCardValidator(control: any) {
        if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
            return null;
        } else {
            return { 'invalidCreditCard': true };
        }
    }

    static passwordMatch(control: any){
        let paswd = control.root.get('newPassword');
        if(paswd && control.value != paswd.value){
            return {
                passwordMatch: false
            };
        }
        return null;
    }

    static nospaceValidator(control: AbstractControl): { [s: string]: boolean } {
        let re = / /;
        if (control.value && control.value.match(re)) {
            return { nospace: true };
        }else {
            return null
        }
    }

    static specialcharValidator(control: any) {
        var re = new RegExp("^[a-zA-Z0-9- ]+$");
        if (re.test(control.value)) {
            return null;
        } else {
            return { 'alphaNumeric': true };
        }
    }

    static selectedspecialcharValidator(control: any) {
        var re = new RegExp("^[a-zA-Z0-9-&(),@:;/ ]+$");
        if (re.test(control.value)) {
            return null;
        } else {
            return { 'selectedspecialchar': true };
        }
    }
}
