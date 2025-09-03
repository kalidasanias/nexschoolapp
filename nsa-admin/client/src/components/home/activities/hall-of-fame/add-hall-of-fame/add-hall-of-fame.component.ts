/**
 * Created by intellishine on 9/11/2017.
 */
import {Component, OnInit, Input, ViewChild,ElementRef} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";
import {ServiceUrls, Constants} from "../../../../../common/index";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
    selector: 'add-hall-of-fame',
    templateUrl: 'add-hall-of-fame.html'
})

export class AddHallOfFameComponent implements OnInit {

    results: string[];
    hallOfFameForm: any;
    hall_fame_id: any;
    awards:any;
    modalId: any;
    charsLeft: any = 160;
    successMsg: string;
    btnVal: string;

    @ViewChild('dateOfIssue') dateOfIssue: ElementRef
    @ViewChild('awardName') awardName: ElementRef
   /* @ViewChild('sms') sms: ElementRef
    @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef*/

    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private fb: FormBuilder,
                private constants: Constants,
                private serviceUrls: ServiceUrls) {

    }

    ngOnInit() {
        this.baseService.enablePickerDate();
        this.getAllAwards();
        this.getFeatureChannelConfiguration();
        this.createEventForm();
        this.hall_fame_id ="";
    }

    createEventForm() {
        this.hallOfFameForm = this.fb.group({
            'awardName': '',
            'awardId': '',
            'dateOfIssue': '',
            'students': [],
            'desc': '',
            'status': false
        });
    }

    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)

        )
    }

    callBackChannels(data: any) {
        this.commonService.getActiveFeatureChannelDetails(data);
    }

    getAllAwards(){
        this.commonService.get(this.serviceUrls.getAllAwards).then(
            awards => this.callBackAwards(awards)
        )
    }
    search(event: any) {
        this.commonService.get(this.serviceUrls.searchStudent + event.query).then(
            texts => this.results = texts
        )
    }

    callBackAwards(awards: any){
        this.awards = awards;
        this.baseService.enableSelectWithEmpty('#awards-List', awards, this.constants.HallOfFameObject, null);
    }

    saveHallOfFame(id: any) {
        this.setFormValues(id);
        var dataFound = this.setValidations();
        if(this.hallOfFameForm.valid && dataFound){
            this.baseService.enableBtnLoading(id);
            if (this.hall_fame_id != "") {
                this.commonService.put(this.serviceUrls.hallOfFame + this.hall_fame_id, this.hallOfFameForm._value).then(
                    result => this.saveHallOfFameCallBack(result, id, false,this.constants.updateHallOfFame),
                    error => this.saveHallOfFameCallBack(<any>error, id, true, this.constants.n_danger))
            } else {
                this.commonService.post(this.serviceUrls.hallOfFame, this.hallOfFameForm._value).then(
                    result => this.saveHallOfFameCallBack(result, id, false, this.constants.saveHallOfFame),
                    error => this.saveHallOfFameCallBack(<any>error, id, true,this.constants.n_danger))
            }

        }
    }

    setFormValues(id: any) {
        this.hallOfFameForm._value.status = false;
        var award = this.baseService.extractOptions(this.awardName.nativeElement.selectedOptions)[0];
       /* this.hallOfFameForm._value.notify.sms = this.sms.nativeElement.checked;
        this.hallOfFameForm._value.notify.email = this.email.nativeElement.checked;
        this.hallOfFameForm._value.notify.push = this.push.nativeElement.checked;*/
        this.hallOfFameForm._value.dateOfIssue = this.dateOfIssue.nativeElement.value;
        this.hallOfFameForm._value.awardId = award.id;
        this.hallOfFameForm._value.awardName = award.name;
    }

    getEditHallOfFames(event: any){
        this.modalId = event;
        var value = JSON.parse(event.target.value);
        this.commonService.get(this.serviceUrls.hallOfFame + value).then(
            result => this.exitingHallOfFameCallBack(result))
    }
    exitingHallOfFameCallBack(result: any){
        this.editForm(result);
    }

    editForm(result: any) {
        var value = result[0];
        this.hall_fame_id = value.id;
        this.hallOfFameForm = this.fb.group({
            'awardName': value.award_name,
            'awardId': value.award_id,
            'dateOfIssue': value.date_of_issue,
            'students': [JSON.parse(value.notified_students)],
            'desc': value.description,
            'status': false,
        });
        this.baseService.enableSelectWithEmpty('#awards-List', this.awards, this.constants.HallOfFameObject, value.award_id);
        this.btnVal = this.constants.Update;
        this.baseService.openOverlay(this.modalId);
    }

    setValidations():any{
        var students = (this.hallOfFameForm._value.students ?  this.hallOfFameForm._value.students: []);
        var dataFound = false;
        if(!this.hallOfFameForm._value.awardId) {
            this.baseService.showNotification('Please select awardName', "", 'bg-danger');
        } else if(!this.hallOfFameForm._value.dateOfIssue){
            this.baseService.showNotification('Please Enter Date',"",'bg-danger');
        }else if(students.length < 1){
            this.baseService.showNotification('Please choose students',"", 'bg-danger');
        } else{
            dataFound = true;
        }
        return dataFound;
    }

    keyDown() {
        setTimeout(() => {
            this.changed()
        }, 50);
    }

    changed() {
        this.charsLeft = this.constants.charMinLength - this.hallOfFameForm._value.desc.length;;
    }

    saveHallOfFameCallBack(result: any, id:any , err: any, message: string) {
        if (err) {
            this.baseService.showNotification(result, "", 'bg-danger');
            this.baseService.disableBtnLoading(id)

        } else {
            this.baseService.showNotification(message , "", 'bg-success');
            this.baseService.dataTableReload('datatable-hall-of-fame');
            this.baseService.closeOverlay('#addHallOfFame');
            this.reload();
            var Loading = this;
            setTimeout(function(){
                Loading.baseService.disableBtnLoading(id);
            }, 300)
        }
    }

    reload(){
        this.hall_fame_id ="";
        this.createEventForm();
        this.baseService.enableSelectWithEmpty('#awards-List', this.awards, this.constants.HallOfFameObject, null);
    }

    openOverlay(event:any) {
    this.btnVal = this.constants.Save;
    this.reload();
    this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.clearText('.ui-inputtext');
        this.baseService.closeOverlay('#addHallOfFame');
    }
}