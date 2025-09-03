/**
 * Created by Cyril  on 05-Mar-17.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../../common/index";
import {AttachmentComponent} from "../../../../common/attachment/attachment.component";
import {CommonService} from "../../../../../../services/common/common.service";
declare var jQuery : any;

@Component({
    selector: 'view-event',
    templateUrl: 'view-event.html'
})

export class ViewEventComponent implements OnInit {

    modalId: any;
    event: any;
    venueName: any;
    eventDetails: any;
    eve: any;
    calendarData: any;
    enable: boolean = false;

    @ViewChild(AttachmentComponent) attachmentComponent: AttachmentComponent;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private constants: Constants,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {
    }

    ngOnInit() {
        this.event = "";
        this.eve = "";
        this.enable = this.baseService.havePermissionsToEdit(this.constants.CREATE_EVENTS_PERMISSIONS);
    }

    openOverlay(event:any) {
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#viewEvent');
    }

    getEventById(event: any) {
        this.modalId = event;
        this.calendarData = JSON.parse(event.target.value);
        this.commonService.get(this.serviceUrls.eventDetails + this.calendarData.event_id).then(
            events => this.callback(events)
        )
    }

    callback(event: any) {
        this.event = event.events;
        this.calendarData.attachments = event.events.attachments;
        this.eventDetails = event.eventDetails;
        this.eve = event;
        this.openOverlay(this.modalId);
        var venues = this.event.venues;
        if (venues && this.event.mapLocation){
            var places = this.constructVenue(venues);
            this.venueName = places + ", "+ this.event.mapLocation
        }
        else if (venues){
            this.venueName = this.constructVenue(venues);
        }else {
            this.venueName = this.event.mapLocation;
        }

    }

    constructVenue(venues: any){
        var name  = [];
        for(var i= 0; i < venues.length; i++) {
            name.push(venues[i].name);
        }
        return this.baseService.arrayTOString(name);
    }


    requested_warning() {
        jQuery('#deleteButton').attr('attachment', false);
        this.baseService.showWarning();
    }
    getExistingFiles(event: any){
        this.calendarData.attachments = JSON.parse(event.target.value);
    }

    requested_delete() {
        var attachment = jQuery("#deleteButton").attr("attachment");
        if(attachment == 'false'){
            this.commonService.deleteEvent(this.calendarData);
            jQuery('#reRenderData').click();
            this.baseService.closeOverlay('#viewEvent');
            jQuery("#deleteButton").attr("attachment",true);
            this.baseService.enableLoadingWithMsg(this.constants.updating)
        }
        setTimeout(() => {
            this.baseService.disableLoading();
        }, 1000);
    }

    viewAttachment() {
        this.commonService.get(this.serviceUrls.eventDetails + this.calendarData.event_id).then(
            events => this.callbackattachment(events)
        )
    }

    callbackattachment(event: any){
        this.event = event.events;
        this.event['url'] = this.serviceUrls.eventAttachments;
        this.event['id'] = this.event.eventId;
        this.event.calendarData = this.calendarData;
        this.attachmentComponent.openModal(this.event, true);
    }
}