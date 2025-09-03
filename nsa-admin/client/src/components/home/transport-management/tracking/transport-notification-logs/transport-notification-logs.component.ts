/**
 * Created by intellishine on 9/5/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../common/index";
import {LiveComponent} from "../live.component";
import {DateService} from "../../../../../services/common/date.service";
import {CommonService} from "../../../../../services/common/common.service";


@Component({
    selector: 'transport-notification-logs',
    templateUrl: 'transport-notification-logs.html',
})
export class TransportNotificationLogsComponent implements OnInit {
    @ViewChild('vehiclenumber') vehiclenumber: ElementRef;
    
    @ViewChild('routename') routename: ElementRef;
    @ViewChild('date') date: ElementRef;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private constants: Constants,
                private dateService: DateService,
                private commonService: CommonService) { }
    object: any;
    isDuration: boolean = false;
    isRoutes: boolean = false;
    logstable: boolean= false;
    startDate: any;
    endDate: any;
    routes: any;
    vehicle: any;
    dates: any;
    statusObject: any;
    routeId: any;

    ngOnInit() {
        this.today(null);
        this.getVehicle();
        this.baseService.enablePickerDate();
    }

    getVehicle(){
        this.commonService.get(this.serviceUrls.vehicle).then(vehicle => this.callBackvehicle(vehicle))
    }

    callBackvehicle(vehicle: any){
        this.vehicle = vehicle;
        this.baseService.enableSelectWithEmpty('#bootstrap-vehiclename', vehicle, this.constants.vehicleObj, null);
    }

    getRoutesByVehicle(){
        var vehicleNo = this.baseService.extractOptions(this.vehiclenumber.nativeElement.selectedOptions)[0];
        if (vehicleNo.id){
            this.commonService.get(this.serviceUrls.getRoutesByVehicle + vehicleNo.name).then(routes => this.callBackRoutes(routes))
        } else {
            this.isRoutes = false;
        }
    }

    callBackRoutes(routes: any){
        this.isRoutes = true;
        this.baseService.enableSelectWithEmpty('#bootstrap-routename', routes, this.constants.routeObj, null);
    }

    transportLog(event: any){
        this.getVehicle();
        this.baseService.openOverlay(event);
    }

    today(event: any) {
        this.isDuration = false;
        var date = this.dateService.getToday();
        this.setDate(date)
    }

    week(event: any) {
        this.isDuration = false
        var date = this.dateService.getCurrentWeek();
        this.setDate(date)
    }

    month(event: any) {
        this.isDuration = false
        var date = this.dateService.getCurrentMonth();
        this.setDate(date)
    }

    setDate(date: any) {
        this.startDate = date[0]
        this.endDate = date[1]
    }

    resetForm() {
        this.today(null);
        this.isRoutes = false;
        this.logstable = false;
        this.baseService.enableSelectWithEmpty('#bootstrap-routename', [], this.constants.routeObj, null);
        this.baseService.enableSelectWithEmpty('#bootstrap-vehiclename', this.vehicle, this.constants.vehicleObj, null);
    }

    save(){
        var vehicle = this.baseService.extractOptions(this.vehiclenumber.nativeElement.selectedOptions)[0];
        if(!vehicle.id){
            this.baseService.showNotification('Please Select VehicleNumber', '', 'bg-danger');
        } else {
            this.routeId = this.baseService.extractOptions(this.routename.nativeElement.selectedOptions)[0].id;
            if(!this.routeId){
                this.baseService.showNotification('Please Select RouteName', '', 'bg-danger');
            }else {
                this.logstable = true;
                this.baseService.dataTableDestroy('notification-logs');
                this.baseService.enableDataSourceDatatable(this.serviceUrls.getNotificaionLogsByObject + this.routeId+ '?startDate='+ this.startDate + '&endDate=' + this.endDate);
            }
        }
    }

    duration(event: any) {
        this.isDuration = true
    }

    getDataByDuration(event: any) {
        this.dates = this.date.nativeElement.innerText;
        var split = this.dates.split('-');
        this.startDate = this.dateService.getStartTime(split[0].trim())
        this.endDate = this.dateService.getEndTime(split[1].trim())
    }
    getStatus(event: any) {
        this.statusObject = JSON.parse(event.target.value);
        var smsResponse = JSON.parse(this.statusObject.sms_response)
        if (smsResponse) {
            this.commonService.get(this.serviceUrls.checkStatusUrl + smsResponse.id).then(status => this.callBackStatus(status))
        }else {
            this.baseService.showNotification(this.constants.smsOutOfDate,"","bg-danger")
        }
    }

    callBackStatus(status: any) {
        var data = status.data[0];
        var id = this.statusObject.id;
        var content = '<table class="table"> <thead><tr><th>Mobile Number</th><th>Status</th><th>Sent Time</th><th>Delivered Time</th></tr></thead><tbody><tr><td>'+data.mobile+'</td><td>'+data.status+'</td><td>'+data.senttime+'</td><td>'+data.dlrtime+'</td></tr></tbody></table>'
        this.baseService.enablePopOver('#' + id, 'Notification Status', content, 'left')
    }

    closeOverlay(event: any) {
        this.resetForm();
        this.baseService.closeOverlay('#transportnotificationlogs');
    }
}