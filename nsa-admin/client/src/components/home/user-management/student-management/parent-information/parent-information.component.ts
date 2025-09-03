/**
 * Created by intellishine on 11/13/2017.
 */

import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {ValidationService} from "../../../../../services/validation/validation.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Constants, Messages, ServiceUrls} from "../../../../../common/index";
import {CommonService} from "../../../../../services/common/common.service";
declare var $ : any;
declare var _: any;

@Component({
    templateUrl: 'parent-information.html'
})

export class ParentInformationComponent implements OnInit{

    parentInfomation: any;
    addMobileNumberForm: any;
    studentClassInfo: {};
    addStudentInfo: {};
    AddWardForm: any;
    texts: string[];
    results: string[];

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private fb: FormBuilder,
                private constants: Constants,
                private messages: Messages) { }
    ngOnInit() {
        this.baseService.setTitle('NSA - Parent Information');
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.addMobileForm();
        this.addWardForm();
        this.baseService.enableDataTable(this.serviceUrls.parentInfo);
    }

    addMobileForm(){
        this.addMobileNumberForm= this.fb.group({
            'NewNumber': ['',[Validators.required, ValidationService.phoneValidator, Validators.minLength(10), Validators.maxLength(10)]]
        })
    }

    addWardForm(){
        this.AddWardForm= this.fb.group({
            'NewWard': []
        })
    }

    search(event: any) {
        this.commonService.get(this.serviceUrls.searchStudent+'student/' + event.query).then(
            texts => this.results = texts
        )
    }
    unSelectWard(event: any){
        if(event.query.length == 1){
            this.addStudentInfo = undefined;
            this.studentClassInfo = undefined;
        }
    }

    studentInfo(event: any){
        var findUser = _.find(this.parentInfomation.childs, {'user_name': event.userName});
        if(!findUser){
            this.addStudentInfo ={}, this.studentClassInfo ={};
            this.addStudentInfo = event;
            this.studentClassInfo = event.classes[0];
        }else {
            this.texts =[]
        }
    }

    getParentInfo(event: any){
        this.parentInfomation = JSON.parse(event.target.value);
        this.commonService.post(this.serviceUrls.parent + 'es/users', this.parentInfomation).then(
            result => this.userClassificationCb(result, event)
        )
    }
    userClassificationCb(result: any, event: any){
        if(!_.isEmpty(result)){
            _.forEach(this.parentInfomation.childs, function(val: any){
                var promotedUser = _.find(result, {"userName": val.user_name});
                if(promotedUser){
                 val.class_id = promotedUser.classes[0].class_id;
                 val.class_name = promotedUser.classes[0].class_name;
                 val.section_id = promotedUser.classes[0].section_id;
                 val.section_name = promotedUser.classes[0].section_name;
                }
            })
        }
        this.baseService.openOverlay(event);
    }

    closeOverlay() {
        this.baseService.closeOverlay('#showParentInfo');
    }

    getChangeMobileNumberModel(id:any){
        this.resetForm();
        this.baseService.openModal(id);
    }
    associateNewWard(id: any){
        this.addStudentInfo =undefined;
        this.studentClassInfo =undefined;

        this.addWardForm();
        this.baseService.openModal(id);
    }

    request_warning(event: any) {
        this.baseService.showWarningWithButtonsText(this.constants.parentChangeNumber, "Yes!", 'No!' ,'warning');
    }

    confirmChange(id: any) {
        this.parentInfomation.NewNumber = this.addMobileNumberForm._value.NewNumber;
        this.baseService.enableBtnLoading(id);
        this.commonService.post(this.serviceUrls.parent + 'changeNumber', this.parentInfomation).then(
         result => this.saveNumberCallBack(result, id, false),
         error => this.saveNumberCallBack(<any>error, id, true))

    }

    saveNumber(){
        var result = {primary_phone : this.addMobileNumberForm._value.NewNumber};
        this.commonService.put(this.serviceUrls.parent + 'findNumber/', result).then(
            res => this.validContactCallback(res, false),
            error => this.validContactCallback(error, true)
        )
    }

    validContactCallback(res: any, error: boolean){
        if(!_.isEmpty(res)){
            this.baseService.showNotification(this.constants.NumberExistingErr, '' ,'bg-danger');
        }else {
            $("#deleteButton").click();
        }
    }


    saveNumberCallBack(result:any, id: any, error: boolean){
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.parentInfomation.user_name = this.addMobileNumberForm._value.NewNumber;
            this.parentInfomation.childs = result.childs;
            this.parentInfomation.id = result.id;
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeModal('changeNumber');
            var thisObj = this;
            setTimeout(function (){
                thisObj.baseService.dataTableReload('datatable-parentInformation');
            }, 1000)
        }
        this.baseService.disableBtnLoading(id);
    }

    addWard(id: any){
        this.parentInfomation.NewWard = this.AddWardForm._value.NewWard;
        if(this.parentInfomation.NewWard){
            this.baseService.enableBtnLoading(id);
            this.commonService.post(this.serviceUrls.parent + 'addWard', this.parentInfomation).then(
                result => this.addWardCallBack(result, id, false),
                error => this.addWardCallBack(<any>error, id, true))
        }else {
            this.baseService.showNotification('Please select student' ,"", "bg-danger")
        }

    }

    addWardCallBack(result:any, id: any, error: boolean){
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeModal('addWard');
            this.parentInfomation.childs = result.childs;
            this.addStudentInfo = undefined;
            this.studentClassInfo = undefined;
            var thisObj = this;
            setTimeout(function (){
                thisObj.baseService.dataTableReload('datatable-parentInformation');
            }, 1000)
        }
        this.baseService.disableBtnLoading(id);
    }

    resetForm(){
        this.addMobileForm();
    }
}