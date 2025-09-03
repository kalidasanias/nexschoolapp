import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {Constants, ServiceUrls} from "../../../../../common/index";
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";
declare var jQuery: any;

@Component({
    selector : 'add-holiday-type',
    templateUrl: 'add-holiday-type.html'
})

export class AddHolidayTypeComponent implements OnInit{
    addHolidaytypeForm:any;
    addHolidaytype:any;
    holidayType:any;
    modalId:any;
    charsLeft: any = 160;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                public serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants: Constants) { }

    createForm() {
        this.addHolidaytypeForm = this.fb.group({
            'holidayType': ['', Validators.required],
            'description': '',
        });
    }

    ngOnInit() {
        this.createForm();
        this.addHolidaytype='';
    }

    openOverlay(event: any) {
        this.baseService.openOverlay(event);
        jQuery('#saveHolidayType').html('Save');
        this.resetForm();
    }

    keyDown() {
        setTimeout(() => {
            this.changed()
        }, 50);
    }

    changed() {
        this.charsLeft = 160 - this.addHolidaytypeForm._value.description.length;
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#addholidaytype');
    }

    getholidayType(event:any) {
        this.modalId = event;
        this.commonService.get(this.serviceUrls.holidays + event.target.value).then(
            result => this.callBack(result)
        );
    }

    callBack(value:any) {
        this.addHolidaytype = value;
        this.editForm(value);
        jQuery('#saveHolidayType').html('Update');
        this.baseService.openOverlay(this.modalId);
    }

    editForm(form:any) {
        this.addHolidaytypeForm = this.fb.group({
            'holidayType': form.holidayType,
            'description': form.description,
        });
    };

    saveHolidayType(id:any) {
        if (this.addHolidaytypeForm.valid) {
           if (this.addHolidaytype.holidayTypeId == undefined ){
               this.baseService.enableBtnLoading(id);
               this.commonService.post(this.serviceUrls.holidays, this.addHolidaytypeForm._value).then(
                   result => this.saveHolidayTypeCallBack(result, id, false),
                   error => this.saveHolidayTypeCallBack(<any>error, id, true))

            }else {
               this.commonService.put(this.serviceUrls.holidays + this.addHolidaytype.holidayTypeId, this.addHolidaytypeForm._value).then(
                   result => this.saveHolidayTypeCallBack(result, id, false),
                   error => this.saveHolidayTypeCallBack(<any>error, id, true))

            }
        }
    };

    saveHolidayTypeCallBack(result:any, id:any, error:boolean){
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#addholidaytype');
            this.baseService.dataTableReload('datatable-holidaytypes');
            this.resetForm();
        }
        this.baseService.disableBtnLoading(id)
    }

    resetForm() {
        this.createForm();
        this.addHolidaytype = "";
    }


}