/**
 * Created by Cyril on 4/4/2017.
 */
import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceUrls} from "../../../../../common/index";
import {Constants} from "../../../../../common/constants/constants";
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    selector : 'aspects',
    templateUrl: 'aspects.html'
})

export class AspectsComponent {
    subjectAspectsForm: any;
    subjectAspect:any;
    aspectName:any;
    aspectCode: any;
    modalId:any;
    buttonVal: string

    constructor(private baseService: BaseService,
                public serviceUrls: ServiceUrls,
                private constants: Constants,
                private fb: FormBuilder,
                private commonService: CommonService ) {

    }

    createForm() {
        this.subjectAspectsForm = this.fb.group({
            'aspectName': ['', Validators.required],
            'aspectCode': ['', Validators.required],
        });
    }

    ngOnInit() {
        this.createForm();
        this.subjectAspect='';
        this.baseService.enableAppJs();
    }

    aspectShow(id:any){
        this.buttonVal = this.constants.Save;
        this.baseService.openModal(id);
        this.resetForm();
    }

    getAspect(modal:any, value:any) {
        this.modalId = modal;
        this.commonService.get(this.serviceUrls.aspects + value.target.value).then(
            aspect => this.callBack(aspect)
        );
    }

    callBack(value:any) {
        this.subjectAspect = value;
        this.editForm(value);
        this.buttonVal = this.constants.Update;
        this.baseService.openModal(this.modalId);
    }


    editForm(form: any) {
        this.subjectAspectsForm = this.fb.group({
            'aspectName': [form.aspectName,[Validators.required]],
            'aspectCode': [form.aspectCode,[Validators.required]]
        });
    };

    saveAspect(id:any) {
        if (this.subjectAspectsForm.valid) {
             if (this.subjectAspect.aspectId == undefined ){
                 this.baseService.enableBtnLoading(id);

                 this.commonService.post(this.serviceUrls.aspects, this.subjectAspectsForm._value).then(
                     result => this.saveAspectCallBack(result, id, false),
                     error => this.saveAspectCallBack(<any>error, id, true))

             }else {
                 this.commonService.put(this.serviceUrls.aspects + this.subjectAspect.aspectId, this.subjectAspectsForm._value).then(
                     result => this.saveAspectCallBack(result, id, false),
                     error => this.saveAspectCallBack(<any>error, id, true))
             }

        }

    };

    saveAspectCallBack(result:any, id:any, error:boolean){
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeModal('addAspect');
            this.baseService.dataTableReload('datatable-aspects');
            this.resetForm();
        }
        this.baseService.disableBtnLoading(id);
    }

    resetForm() {
        this.createForm();
        this.subjectAspect = "";
    }

    openOverlay(event:any) {
        console.info('aspectComponent==',event.target.value);
        console.info('Event==',event);
        this.baseService.dataTableDestroy('datatable-aspects');
        this.baseService.enableDataSourceDatatable(this.serviceUrls.aspects);
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#aspectOverlay');
    }

    requested_delete(event: any) {
        var value = event.target.value;
        this.commonService.deleteObject(this.serviceUrls.aspects + JSON.parse(value).aspectId, value, 'datatable-aspects');
    }

    requested_warning() {
        this.baseService.showWarning();
    }
}