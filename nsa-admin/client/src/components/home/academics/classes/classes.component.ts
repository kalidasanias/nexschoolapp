/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../common/index";
import {FormBuilder} from "@angular/forms";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'classes.html',
})
export class ClassesComponent implements OnInit {

    class_to_delete:any;
    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private constants: Constants,
                private messages :Messages,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Classes')
        this.baseService.enableAppJs();
        this.baseService.enableDataTable(this.serviceUrls.getAllClasses);
    }

    updateClassStatus(event:any){
        var obj = JSON.parse(event.target.value);
        if(obj.status === true) {
            this.baseService.showInfoWarning("Are you sure you want to deactivate the class? ","Deactive!", 'warning')
            obj.status = false;
        } else {
            this.baseService.showInfoWarning("Are you sure you want to activate the class?","Active!", 'warning')
            obj.status = true;
        }
        this.class_to_delete = obj;
    };

    confirmDelete() {
        if(this.class_to_delete != undefined) {
            this.commonService.put(this.serviceUrls.updateClassStatus + this.class_to_delete.classId, this.class_to_delete).then(
                result => this.saveClassStatusCallBack(result, false),
                error => this.saveClassStatusCallBack(<any>error, true))
        }

    }

    saveClassStatusCallBack(result:any, error:boolean) {
        if (error) {
            this.baseService.showInformation('top', result, this.constants.n_info);
            this.baseService.dataTableReload('datatable-classes');
            /*this.baseService.showNotification(result, "", 'bg-danger');*/
        } else {
            this.baseService.showInformation('top', result.message, this.constants.n_success);
            this.baseService.dataTableReload('datatable-classes');
        }
    }



    reload() {
        this.baseService.dataTableReload('datatable-classes');
    }

    request_warning(event: any) {
        if(event.target.value == 'true') {
            this.baseService.showInfoWarning("Are you sure want to activate the Class? ","Active!", 'warning')
        } else {
            this.baseService.showInfoWarning("Are you sure want to deactivate  the Class? ","Deactive!", 'warning')
        }
    }
}
