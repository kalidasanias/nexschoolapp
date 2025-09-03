/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../../services/index";
import {ServiceUrls, Constants} from "../../../../../../common/index";
import {NewTimetableComponent} from "./new-timetable/new-timetable.component";
import {UploadNotesComponent} from "./upload-notes/upload-notes.component";
import {DateService} from "../../../../../../services/common/date.service";
import {GenerateTimetableComponent} from "./generate-timetable/generate-timetable.component";

@Component({
    selector: 'class-timetable',
    templateUrl: 'class-timetable.html'
})
export class ClassTimetableComponent implements OnInit {

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls, private constants: Constants,
                private dateService: DateService) {

    }

    @ViewChild(GenerateTimetableComponent) generateTimetableComponent: GenerateTimetableComponent;
    @ViewChild(NewTimetableComponent) newTimetableComponent: NewTimetableComponent;
    @ViewChild(UploadNotesComponent) uploadNotesComponent: UploadNotesComponent;
    enable: boolean = false;

    newTimetable(event: any) {
        var today = new Date();
        this.newTimetableComponent.newTimetable(event)
    }

    generateTimetable(event: any) {
        //console.info('clicked...')
        this.generateTimetableComponent.newTimetable(event)
    }

    ngOnInit() {
        this.baseService.enableAppJs();
        this.baseService.enableDataTable(this.serviceUrls.timetableForClass);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.TIMETABLE_PERMISSIONS);
    }

    uploadnotes(event: any){
        this.uploadNotesComponent.openOverlay(event)
    }

    editTimetable(event: any) {
        this.newTimetableComponent.editTimetable(event)
    }

    addNotes(event: any) {
        this.uploadNotesComponent.openOverlay(event)
    }

    requested_delete(event:any) {
        console.log('delete in SS', JSON.parse(event.target.value))
        /*this.notificationService.deleteNotification(event.target.value);*/
    }

    requested_warning(value:any) {
        this.baseService.showWarning();
    }

    reload(res:any) {
        this.baseService.dataTableReload('datatable-nested');
    }
}
