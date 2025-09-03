/**
 * Created by Bharatkumarr  on 27-Mar-17.
 */
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService, TransportService } from '../../../../../services/index';
import {ValidationService} from "../../../../../services/validation/validation.service";
import { Constants, ServiceUrls } from '../../../../../common/index';
import {isNullOrUndefined} from "util";


@Component({
    selector: 'add-vehicle',
    templateUrl: 'add-vehicle.html'
})


export class AddVehicleComponent implements OnInit {

    @ViewChild('vehicle_type') vehicle_type: ElementRef;
    @ViewChild('vehicle_reg_date') vehicle_reg_date: ElementRef;
    @ViewChild('vehicle_fc_date') vehicle_fc_date: ElementRef;
    vehicleForm: any;
    vehicle: any;
    modalId: any;
    buttonVal: string;
    modalTitle: string;
    parent: any;

    constructor(private baseService: BaseService, private fb: FormBuilder,
                private transportService: TransportService,
                private serviceUrls: ServiceUrls, private constants: Constants) {
    }

    ngOnInit() {
        this.createVehicleForm();
        this.vehicle= "";
    }

    openOverlay(event:any, bVal:string, title: string, id: string, parent:any) {
        this.baseService.removeDisabled('#regNo');
        this.buttonVal = bVal;
        this.modalTitle = title;
        this.parent = parent;
        this.baseService.openOverlay(event);
        if (bVal == 'Update') {
            this.baseService.addDisabled('#regNo');
            this.transportService.get(this.serviceUrls.vehicle+id)
                .then(vehicle => this.callBack(vehicle));
        } else {
            if (bVal == 'Save') this.resetForm();
        }

    }
    vehicleType(event:any) {
        this.vehicleForm.controls['vehicle_type'].setValue(this.baseService.extractOptionValue(this.vehicle_type.nativeElement.selectedOptions)[0]);
    }
    registrationDate(event:any){
        this.vehicleForm.controls['vehicle_reg_date'].setValue(this.vehicle_reg_date.nativeElement.value);
    }
    fcDate(event:any) {
        this.vehicleForm.controls['vehicle_fc_date'].setValue(this.vehicle_fc_date.nativeElement.value);
    }

    validateForm() {
        if (this.vehicle_reg_date.nativeElement.value === '' || this.vehicle_fc_date.nativeElement.value === '') {
            return {valid : false};
        }else {
            return null;
        }
    }


    closeOverlay() {
        this.baseService.closeOverlay('#addVehicle');
    }

    createVehicleForm() {
        var vehicleType = [{value: 'Bus', name: 'Bus'},
            {value: 'Mini-Bus' , name: 'Mini-Bus'},
            {value: 'Van' , name: 'Van'},
            {value: 'Mini-Van', name: 'Mini-Van'}];

        this.baseService.enableSelectWithEmpty('#vehicle_type', vehicleType, [ 'name', 'value' ], null);
        this.vehicle_reg_date.nativeElement.value = '';
        this.vehicle_fc_date.nativeElement.value = '';
        this.vehicleForm = this.fb.group({
            'reg_no': ['', Validators.compose([Validators.required, ValidationService.specialcharValidator])],
            'seating_capacity': ['', Validators.compose([Validators.required, ValidationService.numberValidator,ValidationService.minValue(1),ValidationService.maxValue(60)])],
            'vehicle_reg_date': '',
            'vehicle_fc_date': '',
            'vehicle_type':['',Validators.required],
            'is_hired': false,
            'vehicle_owner_name': '',
            'vehicle_owner_address': '',
            'vehicle_owner_city': '',
            'vehicle_owner_state': '',
            'active': true,
            'vehicle_owner_phone': ''
        },
        {
            validator: () => {
                return this.validateForm();
            }
        });
    }

    keyPress(event:any) {
        var charCode = (event.which) ? event.which : event.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57));
    }

    editForm(form: any) {
        var vehicleType = [{value: 'Bus', name: 'Bus'},
            {value: 'Mini-Bus' , name: 'Mini-Bus'},
            {value: 'Van' , name: 'Van'},
            {value: 'Mini-Van', name: 'Mini-Van'}];

        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        this.baseService.enableSelectWithEmpty('#vehicle_type', vehicleType, [ 'name', 'value' ], form.vehicle_type);

        var red_date = new Date(form.vehicle_reg_date);
        this.vehicle_reg_date.nativeElement.value = red_date.getDate() + ' ' + monthNames[red_date.getMonth()] + ', ' + red_date.getFullYear();
        var fc_date = new Date(form.vehicle_fc_date);
        this.vehicle_fc_date.nativeElement.value = fc_date.getDate() + ' ' + monthNames[fc_date.getMonth()] + ', ' + fc_date.getFullYear();

        this.vehicleForm.controls['reg_no'].setValue(form.reg_no);
        this.vehicleForm.controls['seating_capacity'].setValue(form.seating_capacity);
        this.vehicleForm.controls['is_hired'].setValue(form.is_hired);
        this.vehicleForm.controls['vehicle_owner_name'].setValue(form.vehicle_owner_name);
        this.vehicleForm.controls['vehicle_owner_address'].setValue(form.vehicle_owner_address);
        this.vehicleForm.controls['vehicle_owner_city'].setValue(form.vehicle_owner_city);
        this.vehicleForm.controls['vehicle_owner_state'].setValue(form.vehicle_owner_state);
        this.vehicleForm.controls['vehicle_owner_phone'].setValue(form.vehicle_owner_phone);
        this.vehicleForm.controls['active'].setValue(form.active);

        /*this.vehicleForm = this.fb.group({
            'reg_no': [form.reg_no,[Validators.required]],
            'vehicle_type': form.vehicle_type,
            'seating_capacity': [form.seating_capacity, [ValidationService.numberValidator]],
            'vehicle_reg_date': [form.vehicle_reg_date, [Validators.required]],
            'vehicle_fc_date': [form.vehicle_fc_date, [Validators.required]],
            'is_hired': form.is_hired,
            'vehicle_owner_name': form.vehicle_owner_name,
            'vehicle_owner_address': form.vehicle_owner_address,
            'vehicle_owner_city': form.vehicle_owner_city,
            'vehicle_owner_state': form.vehicle_owner_state,
            'vehicle_owner_phone': [form.vehicle_owner_phone,ValidationService.phoneValidator]
        });*/
    }

    saveVehicle(id:any) {
        this.vehicleForm._value.vehicle_reg_date = this.vehicle_reg_date.nativeElement.value;
        this.vehicleForm._value.vehicle_fc_date = this.vehicle_fc_date.nativeElement.value;
        this.vehicleForm.seating_capacity = parseInt(this.vehicleForm.seating_capacity || 0);
        this.vehicleForm._value.vehicle_type = this.baseService.extractOptionValue(this.vehicle_type.nativeElement.selectedOptions)[0];
        if (this.vehicle.reg_no == undefined) {
            this.transportService.save(this.serviceUrls.vehicle, this.vehicleForm).then(
                result => this.saveVehicleCallBack('Vehicle Saved Successfully'),
                error => this.saveVehicleErrCallBack(<any>error))
        } else {
            this.transportService.update(this.serviceUrls.vehicle+this.vehicle.reg_no,  this.vehicleForm).then(
                result => this.saveVehicleCallBack('Vehicle Updated Successfully'),
                error => this.saveVehicleErrCallBack('Vehicle Not Updated'))
        }
    }

    getVehicle(event: any){
        this.modalId = event;
        this.transportService.get(this.serviceUrls.vehicle+event.target.value).then(
            vehicle => this.callBack(vehicle)
        );
    }

    callBack(currVehicle: any) {
        this.vehicle = currVehicle;
        this.editForm(currVehicle);
    }

    saveVehicleCallBack(msg:string) {
        this.baseService.closeOverlay('#addVehicle');
        this.baseService.showNotification(msg, "", 'bg-success');
        this.resetForm();
        this.baseService.dataTableReload('datatable-vehicle');
    }

    saveVehicleErrCallBack(msg:string) {
        this.baseService.showNotification(msg, "", 'bg-danger');
    }

    resetForm(){
        this.createVehicleForm();
        this.vehicle= "";
    }

}
