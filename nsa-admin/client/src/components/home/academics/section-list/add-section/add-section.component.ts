import {FormBuilder, Validators} from "@angular/forms";
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {BaseService, ValidationService, CommonService} from "../../../../../../src/services/index";
import {Constants} from "../../../../../common/index";
import {ServiceUrls} from "../../../../../common/constants/service.urls";

@Component({
    selector: 'add-section',
    templateUrl: 'add-section.html'

})

export class AddSectionComponent implements OnInit {
    @ViewChild('single') single: ElementRef;

    addSectionForm:any
    modalId:any
    section:any
    btnVal: string
    status = [{value: true, name: 'Active'}, {value: false, name: 'Inactive'}];
    statusValue = ['name', 'value'];

    constructor(private baseService: BaseService,
                private formBuilder: FormBuilder,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants: Constants) {
    }

    ngOnInit() {
        this.section = "";
        this.createForm();
        this.baseService.enableSelect('#select-status', this.status, this.statusValue, null);
    }

    /*model open code here*/
    openOverlay(event:any) {
        this.btnVal = this.constants.Save;
        this.baseService.removeDisabled('#secName');
        this.baseService.removeDisabled('#secCode');
        this.resetForm();
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#addSection');
    }

    /* edit code here */
    editForm(form:any) {
        this.addSectionForm = this.formBuilder.group({
            'sectionName': [form.sectionName, Validators.compose([Validators.required, ValidationService.specialcharValidator]),],
            'sectionCode': [form.sectionCode, Validators.compose([Validators.required, ValidationService.specialcharValidator]),],

        });
        if(form.status == 'Active') {
            this.baseService.enableSelect('#select-status', this.status, this.statusValue, 'true');
        } else {
            this.baseService.enableSelect('#select-status', this.status, this.statusValue, 'false');
        }
    }

    getEditSection(event:any) {
        this.modalId = event;
        this.commonService.get(this.serviceUrls.section + '/' + event.target.value).then(
            result => this.callBack(result)
        );
    }

    callBack(value:any) {
        this.section = value;
        this.editForm(value);
        this.baseService.addDisabled('#secName');
        this.baseService.addDisabled('#secCode');
        this.btnVal = this.constants.Update;
        this.baseService.openOverlay(this.modalId);
    }

    /*save form */
    createForm() {
        this.addSectionForm = this.formBuilder.group({
            'sectionName': ['', Validators.compose([Validators.required, ValidationService.specialcharValidator]),],
            'sectionCode': ['', Validators.compose([Validators.required, ValidationService.specialcharValidator]),],
            'status': true
        });
    }

    saveAddSection(id:any) {
        this.addSectionForm._value.status = this.baseService.extractOptions(this.single.nativeElement.selectedOptions)[0].id;
        this.addSectionForm._value.sectionName = this.baseService.capitalizeFirstLetter(this.addSectionForm._value.sectionName);
        this.addSectionForm._value.sectionCode = this.baseService.capitalizeFirstLetter(this.addSectionForm._value.sectionCode);
        if (this.addSectionForm.valid) {
            if (this.section.length < 1) {
                this.commonService.post(this.serviceUrls.section, this.addSectionForm._value).then(
                    result=>this.saveSectionCallBack(result, id, false),
                    error=>this.saveSectionCallBack(<any>error, id, true)
                )

            } else {
                this.commonService.put(this.serviceUrls.section + this.section.sectionId, this.addSectionForm._value).then(
                    result=>this.saveSectionCallBack(result, id, false),
                    error=>this.saveSectionCallBack(<any>error, id, true)
                )
            }
        }
    }

    saveSectionCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger')
        } else {
            /* this result message come from server */
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#addSection');
            this.baseService.dataTableReload('datatable-sectionList');
            this.resetForm();
        }
    }

    resetForm() {
        this.baseService.enableSelect('#select-status', this.status, this.constants.statusValue, null);
        this.createForm();
        this.section = "";
    }
}

