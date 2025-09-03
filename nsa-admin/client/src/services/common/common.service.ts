/**
 * Created by senthil-p on 13/06/17.
 */
'use strict';

import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Constants, Messages, ServiceUrls, contentHeaders} from "../../common/index";
import {BaseService} from "../index";

@Injectable()
export class CommonService {
    constructor (private http: Http,
                 public baseService: BaseService,
                 public serviceUrl: ServiceUrls,
                 public constants: Constants,
                 public messages: Messages) {}

    get(url: any): Promise<any> {
        return this.http.get(url, this.baseService.getHeader())
            .toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    }

    post(url: any, value: any): Promise<any> {
        return this.http.post(url, value, this.baseService.getHeader())
            .toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    }

    postWithOutSessionId(url: any, value: any): Promise<any> {
        return this.http.post(url, value, {headers: contentHeaders})
            .toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    }

    put(url: any, value: any): Promise<any> {
        return this.http.put(url, value, this.baseService.getHeader())
            .toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    }

    del(url: any): Promise<any> {
        return this.http.delete(url, this.baseService.getHeader())
            .toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    }

    deleteObj(url: any, id: any) {
        return this.http.delete(url, this.baseService.getHeader()).subscribe(response => {
                this.baseService.showInformation('top', this.messages.delete_success, this.constants.n_success);
                this.baseService.dataTableReload(id);
            },
            error => {
                var body = JSON.parse(error._body);
                this.baseService.showInformation('top', body.data.message, this.constants.n_info)
            });
    };

    deleteObject(url: any, value: any, id: any) {
        if(value.length > 0) {
            value = JSON.parse(value);
            return this.http.delete(url, this.baseService.getHeaderWithBody(value)).subscribe(response => {
                    this.baseService.showInformation('top', this.messages.delete_success, this.constants.n_success);
                    this.baseService.dataTableReload(id);
                },
                error => {
                    var err: any = this.baseService.handleErr(error);
                    this.baseService.showInformation('top', err, this.constants.n_info)
                });
        }
    };

    deleteMethod(url: any, value: any) {
        return this.http.delete(url, this.baseService.getHeaderWithBody(value))
            .toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    };

    deleteMethodWithCallback(url: any, value: any): Promise<any> {
        return this.http.delete(url, this.baseService.getHeaderWithBody(value))
            .toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    }

    deleteEvent(value: any) {
        return this.http.delete(this.serviceUrl.event +  value.event_id, this.baseService.getHeaderWithBody(value)).subscribe(response => {
                this.baseService.showInformation('top', this.messages.delete_success, this.constants.n_success);
            },
            error => {
                this.baseService.showInformation('top', this.messages.delete_err, this.constants.n_info)
            });
    }

    getActiveFeatureChannelDetails(data:any){
        if(data != undefined){
            data.sms === true ? this.baseService.addChecked(this.constants.smsChecked) : this.baseService.removeChecked(this.constants.smsChecked);
            data.push === true ? this.baseService.addChecked(this.constants.pushChecked) : this.baseService.removeChecked(this.constants.pushChecked);
            if(data.is_override) {
                this.baseService.removeHideClass(this.constants.sms);
                this.baseService.removeHideClass(this.constants.push);
            } else {

                data.sms === true ? this.baseService.removeHideClass(this.constants.sms) : this.baseService.addHideClass(this.constants.sms);
                data.push === true ? this.baseService.removeHideClass(this.constants.push) : this.baseService.addHideClass(this.constants.push);
            }

        }
    }

    deleteTimetableById(value:any, obj: any):Promise<any> {
        return this.http.delete(this.serviceUrl.timetable + value, this.baseService.getHeaderWithBody(obj))
            .toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    }

    deleteEmployee(obj: any) : Promise<any>  {
        return this.http.delete(this.serviceUrl.employee + obj.userName, this.baseService.getHeaderWithBody(obj)).toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    }

    deleteStudent(obj: any) : Promise<any>  {
        return this.http.delete(this.serviceUrl.student + obj.userName, this.baseService.getHeaderWithBody(obj)).toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    }

    updateUserContactDetails(value: any) {
        this.http.put(this.serviceUrl.getUserContactDetails, value, this.baseService.getHeader()).subscribe(response => {
                this.baseService.showNotification('Success!', response.json().data, 'bg-success');
                this.baseService.dataTableReload('datatable-nested');
            },
            error => {
                this.baseService.showNotification('Faild!', 'User Update Failed', 'bg-danger');
            });
    }

}