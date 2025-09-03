import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {ServiceUrls} from "../../../../../common/index";
import {Constants} from "../../../../../common/constants/constants";
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";
declare var _: any;

@Component({
    selector : 'add-week-off',
    templateUrl: 'add-week-off.html'
})
export class AddWeekOffComponent implements OnInit{


    weeks: any[] = [];
    buttonVal: any;
    schoolWeeks: any;
    @ViewChild('satSelect') satSelect:ElementRef
    @ViewChild('sunSelect') sunSelect:ElementRef

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants : Constants) {

    }

    ngOnInit() {
        this.weeks = Array(5).fill(5);
    }

    openOverlay(event: any) {
         this.getSchoolWeekOff();
        if(!_.isEmpty(this.schoolWeeks)) {
            this.buttonVal = this.constants.Update;
        } else {
            this.buttonVal = this.constants.Save;
        }
        this.baseService.openOverlay(event);
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#addWeekOff');
    }

    save(id: any) {
        var form = {};
        form['saturdays'] = this.extractTimetableCheckbox(this.satSelect.nativeElement.children);
        form['sundays'] = this.extractTimetableCheckbox(this.sunSelect.nativeElement.children);
        this.baseService.enableBtnLoading(id);
        if(this.schoolWeeks.saturday != undefined) {
            this.commonService.put(this.serviceUrls.schoolWeekOff + this.schoolWeeks.id, form).then(
                result => this.saveCallBack(result, id, false),
                error => this.saveCallBack(<any>error, id, true)
            )

        } else {
            this.commonService.post(this.serviceUrls.schoolWeekOff, form).then(
                result => this.saveCallBack(result, id, false),
                error => this.saveCallBack(<any>error, id, true)
            )
        }


    }


    extractTimetableCheckbox(arr: any[]): any[] {
        let options: any[] = [];
        for(let i=0; i< arr.length; i++) {
            var children: any[] = arr[i].children;
            if(children[0] != undefined) {
                if(children[0].children[0].checked) {
                    options.push(children[0].children[0].value);
                }
            }
        }
        return options;
    }

    saveCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.closeOverlay(null);
            this.getSchoolWeekOff();
        }
        this.baseService.disableBtnLoading(id);
    }

    getSchoolWeekOff() {
        this.commonService.get(this.serviceUrls.schoolWeekOff).then(
            schoolWeekOff => this.callBack(schoolWeekOff)
        )

    }

    callBack(form: any) {
        this.schoolWeeks = form;
        if(form.saturday != undefined) {
            this.getCheckedDays(form.saturday, 'sat');
            this.getCheckedDays(form.sunday, 'sun')
        }
    }

    private getCheckedDays(days : any, id: any) {
        for (var i = 0; i < this.weeks.length; i++) {
            var day = days.find((obj:any) => obj === i + 1);
            if (day != undefined) {
                this.baseService.addChecked("#" + id + (i + 1) + "");
            } else {
                this.baseService.removeChecked("#" + id + (i + 1) + "");
            }

        }
    };

}