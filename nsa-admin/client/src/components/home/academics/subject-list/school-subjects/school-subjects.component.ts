import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceUrls} from "../../../../../common/index";
import {Constants} from "../../../../../common/constants/constants";
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";


@Component({
    selector : 'school-subjects',
    templateUrl: 'school-subjects.html'

})
export class SchoolSubjectsComponent implements OnInit{

    @ViewChild('single') single: ElementRef;
    @ViewChild('selectAll') selectAll: ElementRef;
    @ViewChild('single1') single1: ElementRef;

    private selectedOptions: number[];

    modalId:any;
    aspects: any[];
    schoolSubjectForm:any;
    deptId :any[];
    aspectsArr:any[];
    subAspects:any[];
    subCode: any;
    subName:any;
    subDesc:any;
    charsLeft: any = 160;
    btnVal: string
    schoolSubject:any;
    departments: any[];
    status = [{value: true, name: 'Active'}, {value: false , name: 'Inactive'}];
    statusValue = ['name', 'value'];

    constructor(private baseService: BaseService,
                public serviceUrls: ServiceUrls,
                private fb: FormBuilder,
                private commonService: CommonService,
                private constants: Constants) {

    }

    ngOnInit() {
        this.createForm();
        this.getDepartments();
        this.baseService.enableAppJs();
        this.schoolSubject ="";
        this.baseService.enableSelect('#select-status1', this.status, this.statusValue, null);
    }

    createForm() {
        this.schoolSubjectForm = this.fb.group({
            'deptId': [''],
            'subAspects': [''],
            'status':true,
            'subName': ['',Validators.required],
            'subCode':['',Validators.required],
            'subDesc':'',
        });
    }

    openOverlay(event: any) {
        this.getAspects();
        this.resetForm();
        this.btnVal = this.constants.Save;
        this.baseService.openOverlay(event);
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#schoolSubject')
    }

    keyDown() {
        setTimeout(() => {
            this.changed()
        }, 50);
    }

    changed() {
        this.charsLeft = 160 - this.schoolSubjectForm._value.subDesc.length;
    }

    editForm(form:any) {
        this.schoolSubjectForm = this.fb.group({
            'subName': [form.subName,[Validators.required]],
            'subCode': [form.subCode,[Validators.required]],
            'subDesc': form.subDesc
        });
        this.aspectsArr = this.baseService.JsonToArray(form.subAspects, this.constants.generalObj);
        this.baseService.enableMultiSelectAll('.multiselect-Aspects',  this.aspects, this.constants.aspectObj, this.aspectsArr);
        this.baseService.enableSelectWithEmpty('#select-dept',  this.departments, this.constants.departmentObj, form.deptId);
        if(form.status == 'Active') {
            this.baseService.enableSelect('#select-status1', this.status, this.statusValue, 'true');
        } else {
            this.baseService.enableSelect('#select-status1', this.status, this.statusValue, 'false');
        }
    }

    getEditSubject(event:any) {
        this.getAspects();
        this.modalId = event;
        this.commonService.get(this.serviceUrls.getSchoolSubjectById + event.target.value).then(
            result => this.callBack(result)
        );
    }

    callBack(value:any) {
        this.schoolSubject = value;
        this.editForm(value);
        this.btnVal = this.constants.Update;
        this.baseService.openOverlay(this.modalId);
    }

    saveSubject(id:any) {
        var dataFound = this.setValidations();
        if(dataFound){
            if(this.schoolSubjectForm.valid) {
                if(this.schoolSubject.subjectId == undefined) {
                    this.commonService.post(this.serviceUrls.saveSchoolSubject, this.schoolSubjectForm._value).then(
                        result => this.saveSchoolSubjectCallBack(result, id, false),
                        error => this.saveSchoolSubjectCallBack(<any>error, id, true))

                } else {
                    this.commonService.put(this.serviceUrls.updateSchoolSubject + this.schoolSubject.subjectId, this.schoolSubjectForm._value).then(
                        result => this.saveSchoolSubjectCallBack(result, id, false),
                        error => this.saveSchoolSubjectCallBack(<any>error, id, true))

                }
            } else {
                this.baseService.showNotification("Enter subject Details", "", 'bg-danger');
            }
        }
    };

    setValidations():any{
        var dataFound =false;
        this.schoolSubjectForm._value.status = this.baseService.extractOptions(this.single1.nativeElement.selectedOptions)[0].id;
        this.schoolSubjectForm._value.subAspects = this.baseService.extractOptions(this.selectAll.nativeElement.selectedOptions);
         var deptId = this.baseService.extractOptions(this.single.nativeElement.selectedOptions);
        this.schoolSubjectForm._value.deptId = !(deptId[0]) ? deptId[0] : deptId[0].id;

        if(!(this.schoolSubjectForm._value.deptId)){
            this.baseService.showNotification("Please Choose Department","",'bg-danger');
        } else {
            dataFound = true;
        }
        return dataFound;
    }

    saveSchoolSubjectCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#schoolSubject');
            this.baseService.dataTableReload('datatable-listsubjects');
            this.resetForm();
        }
    }

    resetForm() {
        this.createForm();
        this.schoolSubject = "";
        this.baseService.enableSelect('#select-status1', this.status, this.statusValue, null);
        this.baseService.enableSelectWithEmpty('#select-dept', this.departments, this.constants.departmentObj, null);
    }

    getDepartments() {
        this.commonService.get(this.serviceUrls.department).then(
            depts =>  this.callBackDepartments(depts)
        )
    }
    getAspects() {
        this.commonService.get(this.serviceUrls.aspects).then(
            aspects => this.callBackAspects(aspects)
        )
    }
    callBackDepartments(value: any) {
        this.departments = value;
        this.baseService.enableSelectWithEmpty('#select-dept', this.departments, this.constants.departmentObj, null);
    }

    callBackAspects(value: any) {
        this.aspects = value;
        this.baseService.enableMultiSelectAll('.multiselect-Aspects',this.aspects, this.constants.aspectObj, null);
    }


}