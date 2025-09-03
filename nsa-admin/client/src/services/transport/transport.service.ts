/**
 * Created by bharatkumarr on 27-Mar-17.
 */
import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { ServiceUrls, Constants, Messages } from '../../common/index';
import { BaseService } from '../index';

@Injectable()
export class TransportService {
    constructor (private http: Http,
                 public baseService: BaseService,
                 public serviceUrl: ServiceUrls,
                 public constants: Constants,
                 public messages: Messages) {}

    getAll(url:string): Promise<any> {
        return this.http.get(url, this.baseService.getHeader())
            .toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    }

    getSchoolDetails(url: string): Promise<any> {
        return this.http.get(url, this.baseService.getHeader())
            .toPromise()
            .then(this.extractSchoolData)
            .catch(this.baseService.handleError);
    }

    extractSchoolData(res: Response) {
        let body = res.json();
        return body.data.schoolDetails || { };
    }

    get(url: string): Promise<any> {
        return this.http.get(url, this.baseService.getHeader())
            .toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    }

    save (url: string, form: any): Promise<any> {
        delete form.updated_by;
        return this.http.post(url, form._value, this.baseService.getHeader())
            .toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    }

    update (url:string, form: any): Promise<any> {
        return this.http.put(url, form._value, this.baseService.getHeader())
            .toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    }

    patch (url:string, form: any): Promise<any> {
        return this.http.patch(url, form, this.baseService.getHeader())
            .toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    }

    deleteObj(url: any) {
        return this.http.delete(url, this.baseService.getHeader()).subscribe(response => {
                this.baseService.showInformation('top', this.messages.delete_success, this.constants.n_success);
            },
            error => {
                var body = JSON.parse(error._body);
                this.baseService.showInformation('top', body.data.message, this.constants.n_info)
            });
    };


    delete(url: string) : Promise<any>  {
        return this.http.delete(url, this.baseService.getHeader()).toPromise()
            .then(this.baseService.extractData)
            .catch(this.catchError);
    }

    saveUserAssign (form: any): Promise<any> {
        delete form.updated_by;
        return this.http.post(this.serviceUrl.userAssign, form, this.baseService.getHeader())
            .toPromise()
            .then(this.baseService.extractData)
            .catch(this.baseService.handleError);
    }

    private catchError (error: Response | any) {
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            return err;
        }
        return '';
    }
}
