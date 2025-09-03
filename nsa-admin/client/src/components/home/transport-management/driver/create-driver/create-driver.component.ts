/**
 * Created by bharatkumarr on 25/04/17.
 */

import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService, TransportService } from '../../../../../services/index';
import { Constants, ServiceUrls } from '../../../../../common/index';
import {isNullOrUndefined} from "util";
import {ValidationService} from "../../../../../services/validation/validation.service";


@Component({
    selector: 'create-driver',
    templateUrl: 'create-driver.html'
})


export class CreateDriverComponent implements OnInit {

    @ViewChild('driver_type') driver_type: ElementRef;
    @ViewChild('driver_dl_validity') driver_dl_validity: ElementRef;
    @ViewChild('driver_dl_type') driver_dl_type: ElementRef;
    driverForm: any;
    driver: any;
    modalId: any;
    buttonVal: string;
    modalTitle: string;
    parent: any;
    driverType: any[];
    dlType: any[];

    constructor(private baseService: BaseService, private fb: FormBuilder,
                private transportService: TransportService,
                private serviceUrls: ServiceUrls, private constants: Constants) {
    }

    ngOnInit() {
        this.createDriverForm();
        this.driver= "";
    }

    openOverlay(event:any, bVal:string, title: string, id: string, parent:any) {
        this.buttonVal = bVal;
        this.modalTitle = title;
        this.parent = parent;
        this.baseService.openOverlay(event);

        if (bVal == 'Update') {
            this.transportService.get(this.serviceUrls.driver+id)
                .then(driver => this.callBack(driver));
        } else {
            if (bVal == 'Save') this.resetForm();
        }

    }

    updateDl(event:any) {
        var dl = this.baseService.extractOptionValue(this.driver_dl_type.nativeElement.selectedOptions)[0];
        this.driverForm.controls['driver_dl_type'].setValue(dl);
    }

    updateDate(event:any) {
        this.driverForm.controls['driver_dl_validity'].setValue(this.driver_dl_validity.nativeElement.value);
    }

    validateForm() {
        var dl = this.baseService.extractOptionValue(this.driver_dl_type.nativeElement.selectedOptions)[0];
        if (this.driver_dl_validity.nativeElement.value.trim() === '' || dl === '' || dl === undefined) {
            return {valid : false};
        } else {
            return null;
        }

    }

    closeOverlay() {
        this.baseService.closeOverlay('#addDriver');
    }

    createDriverForm() {
        this.driverType = [{value: 'School Employee', name: 'School Employee'},
            {value: 'Acting Driver' , name: 'Acting Driver'}];
        this.dlType = [{value: 'LMV', name: 'LMV'},
            {value: 'HMV' , name: 'HMV'}];

        this.baseService.enableSelectWithEmpty('#driver_type', this.driverType, [ 'name', 'value' ], null);
        this.baseService.enableSelectWithEmpty('#driver_dl_type', this.dlType, [ 'name', 'value' ], null);
        this.driver_dl_validity.nativeElement.value = '';

        this.driverForm = this.fb.group({
                'driver_name': ['', Validators.required],
                'driver_address': '',
                'driver_city': '',
                'driver_state': '',
                'driver_phone': ['', [Validators.required, ValidationService.phoneValidator, Validators.minLength(10), Validators.maxLength(10)]],
                'driver_type': '',
                'driver_dl_number': ['', Validators.required],
                'driver_dl_type': '',
                'driver_dl_validity': ''
            },
            {
                validator: () => {
                    return this.validateForm();
                }
            });
    }

    editForm(form: any) {

        this.baseService.enableSelect('#driver_type', this.driverType, [ 'name', 'value' ], form.driver_type);
        this.baseService.enableSelect('#driver_dl_type', this.dlType, [ 'name', 'value' ], form.driver_dl_type);

        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        if (form.driver_dl_validity != undefined) {
            var red_date = new Date(form.driver_dl_validity);
            this.driver_dl_validity.nativeElement.value = red_date.getDate() + ' ' + monthNames[red_date.getMonth()] + ', ' + red_date.getFullYear();
        }

        this.driverForm.controls['driver_name'].setValue(form.driver_name);
        this.driverForm.controls['driver_address'].setValue(form.driver_address);
        this.driverForm.controls['driver_city'].setValue(form.driver_city);
        this.driverForm.controls['driver_state'].setValue(form.driver_state);
        this.driverForm.controls['driver_phone'].setValue(form.driver_phone);
        this.driverForm.controls['driver_dl_number'].setValue(form.driver_dl_number);
    }

    saveDriver(id:any) {
        this.driverForm._value.driver_dl_validity = this.driver_dl_validity.nativeElement.value;
        this.driverForm._value.driver_dl_type = this.baseService.extractOptionValue(this.driver_dl_type.nativeElement.selectedOptions)[0];
        this.driverForm._value.driver_type = this.baseService.extractOptionValue(this.driver_type.nativeElement.selectedOptions)[0];

        if (this.driver.id == undefined) {
            this.transportService.save(this.serviceUrls.driver, this.driverForm).then(
                result => this.saveDriverCallBack('Driver Saved Successfully'),
                error => this.saveDriverErrCallBack('Driver Not Saved'))
        } else {
            this.transportService.update(this.serviceUrls.driver+this.driver.id,  this.driverForm).then(
                result => this.saveDriverCallBack('Driver Details Updated Successfully'),
                error => this.saveDriverErrCallBack('Driver Not Updated'))
        }
    }

    getDriver(event: any){
        this.modalId = event;
        this.transportService.get(this.serviceUrls.driver+event.target.value).then(
            driver => this.callBack(driver)
        );
    }

    callBack(currDriver: any) {
        this.driver = currDriver;
        this.editForm(currDriver);
    }

    saveDriverCallBack(msg:string) {
        this.baseService.closeOverlay('#addDriver');
        this.baseService.showNotification(msg, "", 'bg-success');
        // this.resetForm();
        this.baseService.dataTableReload('datatable-drivers');
    }

    saveDriverErrCallBack(msg:string) {
        this.baseService.showNotification(msg, "", 'bg-danger');
    }

    resetForm(){
        this.createDriverForm();
        this.driver= "";
    }

}
