/**
 * Created by Senthilkumar on 03/29/2017.
 */
import {Component} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {CommonService} from "../../../../services/common/common.service";
import {ServiceUrls} from "../../../../common/constants/service.urls";
declare var moment: any;

@Component({
    selector: 'dashboard-info',
    templateUrl: 'info.html'
})
export class InfoComponent {
    homework: any
    leavesAssign: any
    leavesTaken: any
    notes: any
    timetable: any
    user: any;
    totalRemLeavs: any;
    dashboardCountObj: any
    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {}
    ngOnInit() {
        this.user = this.baseService.findUser();
        this.getDashboardCount();
        this.commonService.get(this.serviceUrls.getDashboardInfo);
    }

    getDashboardCount() {
        var newdate = new Date();
        var date = moment(new Date()).format('YYYY-MM-DD');
        this.commonService.get(this.serviceUrls.getDashboardCount + this.user.user_name + '/' + newdate.getDay()+'?date=' + date).then( result => this.dashboardCountCallback(result))
    }

    dashboardCountCallback(result: any) {
        this.dashboardCountObj = result
        this.homework = this.dashboardCountObj['homework'].length || 0;
        this.leavesAssign = this.dashboardCountObj['leavesAssign'].length || 0;
        this.leavesTaken = this.dashboardCountObj['leavesTaken'].length || 0;
        this.notes = this.dashboardCountObj['notes'].length || 0;
        this.totalRemLeavs = this.dashboardCountObj['totRemLeavs'] || 0;
        this.timetable = this.dashboardCountObj['timetable'].length || 0;
    }
}

