/**
 * Created by Cyril  on 05-Mar-17.
 */
import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService} from "../../../../../../services/index";
import {Constants} from "../../../../../../common/constants/constants";
import {CommonService} from "../../../../../../services/common/common.service";
import {ServiceUrls} from "../../../../../../common/constants/service.urls";


@Component({
    selector: 'add-venue',
    templateUrl: 'add-venue.html'
})

export class AddVenueComponent implements OnInit {

    eventVenueForm: any;
    eventVenue: any;
    modalId: any;
    btnVal: any;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls,
                private constants: Constants) {
    }

    ngOnInit() {
        this.eventVenue == "";
        this.createEventVenueForm();
    }

    openOverlay(event:any) {
        this.eventVenue == "";
        this.resetForm();
        this.btnVal = this.constants.Save;
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#addEventVenues');
    }

    createEventVenueForm() {
        this.eventVenueForm = this.fb.group({
            'eventVenueName': ['', Validators.required],
            'location': '',
        });
    }

    getEventVenue(id: any, event: any){
        this.modalId = event;
        this.btnVal = this.constants.Update;
        this.commonService.get(this.serviceUrls.eventVenue + event.target.value).then(
            eventVenue => this.callBack(eventVenue)
        );
    }

    callBack(value: any) {
        this.eventVenue = value;
        this.editForm(value);
    }

    editForm(form: any) {
        this.eventVenueForm = this.fb.group({
            'eventVenueName': [form.venue_type_name, [Validators.required]],
            'location': [form.location],
        });
        this.baseService.openOverlay(this.modalId);
    }

    saveEventVenue(id:any) {
            this.baseService.enableBtnLoading(id);
        if (this.eventVenue.length < 1) {
            this.commonService.post(this.serviceUrls.eventVenue, this.eventVenueForm._value).then(
                result => this.saveEventVenueCallBack(result, id, false),
                error => this.saveEventVenueCallBack(<any>error, id, true))

        } else {
            this.commonService.put(this.serviceUrls.eventVenue + this.eventVenue.venue_type_id, this.eventVenueForm._value).then(
                result => this.saveEventVenueCallBack(result, id, false),
                error => this.saveEventVenueCallBack(<any>error, id, true))
        }
    }

    saveEventVenueCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.disableBtnLoading(id);
            this.baseService.closeOverlay('#addEventVenues');
            this.baseService.dataTableReload('datatable-event-venue');
            this.resetForm();
        }
    }

    resetForm(){
        this.createEventVenueForm();
        this.eventVenue= "";
    }

}