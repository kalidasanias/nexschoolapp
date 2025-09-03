/**
 * Created by maggi on 07/05/17.
 */
import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceUrls} from "../../../../../../../../common/constants/service.urls";
import {BaseService, ValidationService, CommonService} from "../../../../../../../../services/index"

@Component({
    selector: 'add-exam',
    templateUrl: 'add-exam.html'
})
export class AddExamComponent implements OnInit {

    modalId: any;
    examTypeForm: any;
    examType: any;
    buttonVal: string;

    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls,
                private fb: FormBuilder) { }

    ngOnInit() {
        this.examType = null;
        this.createForm();
    }

    show(event: any, bVal: string, exam_id: string) {
        this.buttonVal = bVal;
        if (exam_id !== null) {
            this.getExamType(exam_id);
        }
        this.baseService.openOverlay(event);
    }

    closeOverlay() {
        this.resetForm();
        this.baseService.closeOverlay("#add_exam");
    }

    createForm() {
        this.examTypeForm = this.fb.group({
            'written_exam_name': ['', Validators.compose([Validators.required, ValidationService.selectedspecialcharValidator])],
            'written_exam_code': ['', Validators.required],
            'written_desription': '',
        });
    }
    saveExamType(leave_type_id:any) {
        if (this.examType === null) {
            this.commonService.post(this.serviceUrls.examType, this.examTypeForm._value).then(
                result => this.saveExamTypeCallBack(result.message, false),
                error => this.saveExamTypeCallBack(<any> error, true))
        } else {
            this.commonService.put(this.serviceUrls.examType + this.examType.written_exam_id, this.examTypeForm._value).then(
                result => this.saveExamTypeCallBack(result.message,false),
                error => this.saveExamTypeCallBack(<any> error, true))

        }
    }

    saveExamTypeCallBack(msg:string, error:boolean) {
        if(error){
            this.baseService.showNotification(msg, "", 'bg-danger');
        }else {
            this.baseService.showNotification(msg, "", 'bg-success');
            this.closeOverlay();
            this.baseService.dataTableReload('datatable-exam-type');
        }

    }

    resetForm(){
        this.createForm();
        this.examType= null;
    }

    getExamType(exam_id: any){
        this.commonService.get(this.serviceUrls.examType + exam_id).then(
            examType => this.callBack(examType)
        );
    }

    callBack(currExamType: any) {
        this.examType = currExamType;
        this.editForm(currExamType);
    }

    editForm(form: any) {
        this.examTypeForm.controls.written_exam_name.setValue(form.written_exam_name);
        this.examTypeForm.controls.written_exam_code.setValue(form.written_exam_code);
        this.examTypeForm.controls.written_desription.setValue(form.written_desription);
    }

}