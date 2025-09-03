/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, ElementRef, OnInit, ViewChild, ViewChildren, QueryList} from "@angular/core";
import {BaseService} from "../../../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../../../common/index";
import {ExtCalendarComponent} from "../../../../../common/calendar/ext.calendar.component";
import {DateService} from "../../../../../../../services/common/date.service";
import {CalendarService} from "../../../../../../../services/calendar/calendar.service";
import {CommonService} from "../../../../../../../services/common/common.service";
declare var $: any;
declare var _: any;

@Component({
    selector: 'new-timetable',
    templateUrl: 'new-timetable.html'
})
export class NewTimetableComponent implements OnInit {
    edit: boolean = false;
    classes: any;
    sections: any;
    subjects: any;
    sectionId: any;
    classId: any;
    className: any;
    sectionName: any;
    employees: any;
    classEmployees: any;
    timetable: any = {};
    timetableId: any;
    deletTimetableObj: any = {}
    eventId: any;
    subjectId: any;
    classTeacherName: any = '';
    feature:any[];
    enable: boolean = false;
    enableData: boolean = false;
    isNewTimetable: boolean = false
    isEditTimetable: boolean = false
    subEmpAssociation: any

    @ViewChild('singleClass') singleClass: ElementRef;
    @ViewChildren("subEmpDetails") subEmpDetails: QueryList<any>
    @ViewChild('sectionSelect') sectionSelect: ElementRef;
    @ViewChild('subject') subject: ElementRef;
    @ViewChild('subjectTeacher') subjectTeacher: ElementRef;
    @ViewChild('classTeacher') classTeacher: ElementRef;
    @ViewChild('slot') slot: ElementRef;
    @ViewChild('startTime') startTime: ElementRef;
    @ViewChild('endTime') endTime: ElementRef;
    @ViewChild('sms') sms: ElementRef;
    @ViewChild('push') push: ElementRef;

    constructor(private baseService: BaseService,
                private constants: Constants,
                private calendarService: CalendarService,
                private dateService: DateService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {}

    @ViewChild(ExtCalendarComponent) exeCalendar: ExtCalendarComponent;

    ngOnInit() {
        this.getAllEmployees();
        this.baseService.selectStyle();
        this.getAllEmployees();
        this.enable = this.baseService.havePermissionsToEdit(this.constants.TIMETABLE_PERMISSIONS);
    }

    getTimetableData() {
        this.commonService.get(this.serviceUrls.getDashboardTimetable).then(data => this.timetableDataCallback(data))
    }

    timetableDataCallback(data: any) {
        this.timetable = data;
    }

    getActiveClasses() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            classes => this.callBackClasses(classes)
        )
    }

    callBackClasses(data: any) {
        this.classes = data;
        this.baseService.enableSelectWithEmpty('#bootstrap-select', this.classes, this.constants.classObj, null);
    }

    getAllEmployees() {
        this.commonService.get(this.serviceUrls.getActiveEmployees).then(
            employees => this.callBackClassEmployees(employees)
        )
    }

    callBackClassEmployees(data: any) {
        this.classEmployees = data;
    }

    renderCalendar(data: any, view: any, role: any) {
        this.exeCalendar.enableCalendar(data, view, role);
    }

    refreshCalendar(data: any) {
        this.exeCalendar.refresh(data)
    }

    classTeacherChange(event: any) {
        this.classTeacherName = this.baseService.extractOptions(this.classTeacher.nativeElement.selectedOptions)[0].id;
    }

    openOverlay(event:any) {
        this.getActiveClasses();
        this.enableData = true;
        this.baseService.removeHideClass('.noteClass')
        this.baseService.addHideClass('.calDiv')
        this.baseService.openOverlay(event);
    }

    getSectionByClass() {
        this.sectionId = '';
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        this.className = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].name;
        if(this.classId.length < 1) {
            this.baseService.addHideClass('#section-select');
        }  else {
            this.baseService.enableLoadingWithMsg('')
            this.commonService.get(this.serviceUrls.getSectionsByClass + this.classId).then( sections => this.callBackSections(sections))
            this.baseService.removeHideClass('#section-select');
        }
    }

    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)
        )
    }

    callBackChannels(data: any) {
        this.feature =data;
        this.commonService.getActiveFeatureChannelDetails(data);
    }

    getSubjectsByEmployee() {
        this.subjectId = this.baseService.extractOptions(this.subject.nativeElement.selectedOptions)[0].id
        if(this.subjectId.length < 1) {
            this.baseService.addHideClass('#teacher');
        }  else {
            this.commonService.get(this.serviceUrls.subjectByEmployee + this.subjectId).then( subjects => this.callBackEmployees(subjects))
            this.baseService.removeHideClass('#teacher');
        }
    }

    getSubjectsByEmployeeForEdit(event: any) {
        var targetId = event.target.dataset['id'];
        this.subjectId = event.target.value
        this.getEmployeeBySubject(targetId, null)
    }

    getEmployeeBySubject(targetId: any, selectedEmp: any) {
        if(this.subjectId.length > 1) {
            this.commonService.get(this.serviceUrls.subjectByEmployee + this.subjectId).then( subjects => this.callBackEmployeesForEdit(subjects, targetId, selectedEmp))
        }
    }

    callBackEmployeesForEdit(data: any, id: any, selectedEmp: any) {
        this.employees = data;
        this.baseService.enableSelectWithEmpty('#' + id, this.employees, this.constants.empObj, selectedEmp)
    }

    editTimetable(event: any) {
        this.baseService.enableLoadingWithMsg('')
        var obj = JSON.parse(event.target.value);
        var cyear = (localStorage.getItem(this.constants.cyear) == 'true');
        this.enableData = obj.editPermissions && cyear;
        if(this.enableData == true) {
            this.baseService.removeHideClass('.noteClass')
        } else {
            this.baseService.addHideClass('.noteClass');
        }
        
        this.classId = obj.classId;
        this.className = obj.className;
        this.sectionName = obj.sectionName;
        this.sectionId = obj.sectionId;
        this.getClassTeacher();
        this.getFeatureChannelConfiguration();
        this.commonService.get(this.serviceUrls.getClassPeriods + obj.classId).then(periods => this.callBackClassPeriods(periods, this.enableData));

        this.commonService.post(this.serviceUrls.getSubjectsBySections, {sectionId: this.sectionId, classId: this.classId}).then(
            subjects => this.callBackSubjects(subjects)
        )

        this.edit = true;
        this.baseService.openOverlay(event);
    }

    callbackTimetableByClass(data: any) {
        this.timetable = data;
        this.renderCalendar(this.timetable, 'week', this.enable);
        this.refreshCalendar(this.timetable)
        this.openOverlay(event);
    }

    newTimetable(event: any) {
        this.edit = false;
        this.sections = ''
        this.openOverlay(event);
    }

    callBackClassPeriods(data: any, role: any) {
        if(data.length > 0) {
            this.baseService.removeDisabled('.noteClass');
            this.timetable.eleAttr = '.fullcalendar';
            this.timetable.newEvent = '#newTimetable';
            this.timetable.newEventButton = '#eventNewButton';
            this.timetable.weekEle = '#classWeekData';
            this.timetable.eventMenu = '.timetable-menu';
            this.timetable.slots = data;
            this.timetable.showSelectHelper = true
            this.timetable.stopOverlap = true;
            this.timetable.isTimetable = true;
            this.renderCalendar(this.timetable, 'week', role);
            this.refreshCalendar(this.timetable)
        } else {
            this.baseService.addDisabled('.noteClass')
            this.baseService.showInformation('top', this.constants.classConfigValidation, this.constants.n_danger);
        }
        this.baseService.disableLoading();
    }

    callBackSections(data: any) {
        this.sections = _.sortBy(data, 'sectionName');
        this.getFeatureChannelConfiguration();
        setTimeout(() => {
            this.baseService.enableSelectWithEmpty('#employee-select', this.classEmployees, this.constants.empObj, null)
            this.baseService.enableSelectWithEmpty('#section-select', this.sections, this.constants.sectionObj, null)
            this.baseService.disableLoading();
        }, 0);

    }

    callBackEmployees(data: any) {
        this.employees = data;
        this.baseService.enableSelectWithEmpty('#subject-teacher', this.employees, this.constants.empObj, null)
    }

    getSubjectBySection() {
        this.baseService.enableLoadingWithMsg('');
        this.classTeacherName = '';
        this.sectionId = this.baseService.extractOptions(this.sectionSelect.nativeElement.selectedOptions)[0].id;
        this.sectionName = this.baseService.extractOptions(this.sectionSelect.nativeElement.selectedOptions)[0].name;
        this.getClassTeacher()
        if(this.sectionId.length > 0) {
            this.commonService.post(this.serviceUrls.getSubjectsBySections, {sectionId: this.sectionId, classId: this.classId}).then(
                subjects => this.callBackSubjects(subjects)
            )
        }
    }

    callBackSubjects(data: any) {
        if(data.length < 1){
            this.baseService.addHideClass('.calDiv');
            this.baseService.showNotification('No subject has been allocated for this Section.', "", 'bg-danger');
        }else {
            this.subjects = data;
            this.baseService.removeHideClass('.calDiv');
            this.commonService.get(this.serviceUrls.getClassPeriods + this.classId).then(periods => this.callBackClassPeriods(periods, this.enable))
            this.baseService.enableSelectWithEmpty('#subject-select', data, this.constants.sectionSubObj, null)
        }
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#new-timetable');
    }

    saveTimetable(event: any, id: any) {
        if(this.setValidationsForAssign()) {
            var obj = this.buildTimetableObj();
            if(this.isNewTimetable) {
                this.baseService.enableBtnLoading(id);
                this.commonService.post(this.serviceUrls.timetableForClass, obj).then(result => this.callbackSaveTimetable(result, id))
            } else {
                this.baseService.enableBtnLoading(id);
                this.commonService.put(this.serviceUrls.timetableForClassAdd + this.timetableId, obj).then(result => this.callbackSaveTimetable(result, id))
            }
        }

    }

    callbackSaveTimetable(result: any, btnId: any) {
        this.baseService.disableBtnLoading(btnId);
        this.renderCalendar(this.timetable, 'week', this.enable);
        this.refreshCalendar(this.timetable)
        this.baseService.dataTableReload('class_timetable_datatable');
        this.baseService.closeModal('newTimetable')
    }

    callbackUpdateTimetable(result: any, btnId: any) {
        this.baseService.disableBtnLoading(btnId);
        this.renderCalendar(this.timetable, 'week', this.enable);
        this.refreshCalendar(this.timetable)
        this.baseService.dataTableReload('class_timetable_datatable');
        this.baseService.closeModal('newTimetable')
    }

    getWeekData(event: any) {
        var date = new Date(event.target.value);
        date.setDate(date.getDate() + 1);
        var weekNumber = this.dateService.getWeekNumber(date)
        this.commonService.get(this.serviceUrls.classTimetable + this.classId + '/' + this.sectionId + '?weekNo=' + weekNumber[1]).then(result => this.callbackWeekData(result))
    }

    callbackWeekData(data: any) {
        this.timetable.events = data;
        this.refreshCalendar(this.timetable)
    }

    editEventTimetable(event: any) {
        var event = JSON.parse(event.target.value);
        this.isEditTimetable = true;
        this.subEmpAssociation = event.subEmpAssociation
        this.timetableId = event.timetable_id;
        this.eventId = event._id;
        this.baseService.removeHideClass('#updateEvent');
        this.baseService.addHideClass('#addEvent');
        this.baseService.removeHideClass('#teacher');
        this.subEmpAssociation.forEach((subEmp: any, index: any) => {
            this.subjectId = subEmp.subjectId
            this.getEmployeeBySubject('emp_' + index, subEmp.employeeId);
            setTimeout(() => {
                this.baseService.enableSelectWithEmpty('#sub_' + index, this.subjects, this.constants.sectionSubObj, subEmp.subjectId)
            })
        });

        this.calendarService.showEventPopup(event, this.timetable)
    }

    addEventTimetable(event: any) {
        this.isNewTimetable = false;
        this.isEditTimetable = false;
        var event = JSON.parse(event.target.value);
        this.timetableId = event.timetable_id;
        this.eventId = event._id;
        setTimeout(() =>{
            this.baseService.enableSelectWithEmpty('#subject-select', this.subjects, this.constants.sectionSubObj, null)
        }, 100)
        this.baseService.addHideClass('#updateEvent');
        this.baseService.removeHideClass('#addEvent');
        this.baseService.addHideClass('#teacher')
        this.calendarService.showEventPopup(event, this.timetable)
    }

    newEventTimetable(event: any) {
        this.isNewTimetable = true;
        this.isEditTimetable = false;
        var event = JSON.parse(event.target.value);
        setTimeout(() =>{
            this.baseService.enableSelectWithEmpty('#subject-select', this.subjects, this.constants.sectionSubObj, null)
        }, 100)
        this.baseService.addHideClass('#updateEvent');
        this.baseService.removeHideClass('#addEvent');
        this.baseService.addHideClass('#teacher')
        this.calendarService.showEventPopup(event, this.timetable)
    }

    deleteEventTimetable(event: any) {
        var attachment = $("#deleteButton").attr("attachment");
        if(attachment == 'false'){
            this.commonService.deleteTimetableById(this.timetableId, this.deletTimetableObj).then(result => this.callbackTimetableDelete(result))
        }
    }

    deletePeriodTimetable(event: any) {
            this.commonService.deleteTimetableById(this.timetableId, this.deletTimetableObj).then(
                result => this.callbackTimetableDelete(result))
    }

    callbackTimetableDelete(result: any) {
        this.baseService.showInformation('top', result.message, this.constants.n_success)
        this.calendarService.removeEvent(this.eventId)
    }

    showWarning(event: any) {
        var event = JSON.parse(event.target.value);
        this.eventId = event._id;
        this.timetableId = event.timetable_id;
        this.deletTimetableObj.classId = event.classId;
        this.deletTimetableObj.sectionId = event.sectionId;
        $("#deleteButton").attr('attachment', false);
        this.baseService.showWarning();
    }

    updateTimetable(event: any, id: any) {
        if(this.setValidationsForEdit()) {
            var obj = this.buildEditTimetableObj();
            obj.swap = false;
            this.baseService.enableBtnLoading(id);
            this.commonService.put(this.serviceUrls.timetableForClass + this.timetableId, obj).then(result => this.callbackUpdateTimetable(result, id))
            if(obj.subEmpAssociation.length < 1){
                this.deletTimetableObj.classId = this.classId;
                this.deletTimetableObj.sectionId = this.sectionId;
                this.deletTimetableObj.eventId = this.eventId;
                this.deletTimetableObj.timetableId = this.timetableId;
                this.deletePeriodTimetable(event);
            }
        }
    }

    buildTimetableObj(): any {
        var slotObj = JSON.parse(this.slot.nativeElement.value);
        var startTime = new Date(this.startTime.nativeElement.value);
        var periodId = slotObj.id;
        var subjectId = this.baseService.extractOptions(this.subject.nativeElement.selectedOptions)[0].id;
        var employeeId = this.baseService.extractOptions(this.subjectTeacher.nativeElement.selectedOptions)[0].id;

        var obj = {
            classId: this.classId,
            sectionId: this.sectionId,
            periodId: periodId,
            subjectId: subjectId,
            empId: employeeId,
            dayId: startTime.getDay(),
            classTeacherUserName: this.classTeacherName

        }

        return obj;
    }

    buildEditTimetableObj(): any {
        var slotObj = JSON.parse(this.slot.nativeElement.value);
        var subEmpAssociationObj: any[] = []
        this.subEmpDetails.forEach(div => {
            var selected = div.nativeElement.getElementsByTagName('select')
            var obj = {}
            for (let entry of selected) {
                obj[entry.dataset['name']] = entry.value
            }
            if(!this.baseService.isEmptyObject(obj))
            subEmpAssociationObj.push(obj)
        });

        var startTime = new Date(this.startTime.nativeElement.value);
        var periodId = slotObj.id;

        var obj = {
            classId: this.classId,
            sectionId: this.sectionId,
            periodId: periodId,
            subEmpAssociation: subEmpAssociationObj,
            dayId: startTime.getDay(),
            classTeacherUserName: this.classTeacherName

        }

        return obj;
    }

    save(event: any) {
        if(this.setValidations()) {
            var form = {sms: this.sms.nativeElement.checked, push: this.push.nativeElement.checked}
            var notifyTo = {status: 'Sent'};
            var saveForm = {
                notify: form,
                notifyTo: notifyTo,
                classId: this.classId,
                className: this.className,
                sectionName: this.sectionName,
                sectionId: this.sectionId,
                classTeacherUserName: this.classTeacherName
            }
            this.commonService.post(this.serviceUrls.saveAndNotify, saveForm).then(
                result => this.saveCallback(result, false),
                error => this.saveCallback(<any>error, true))
        }
    }

    setValidations() : any {
        this.classTeacherName = this.baseService.extractOptions(this.classTeacher.nativeElement.selectedOptions)[0].id;
        var dataFound = false;
        if(this.classId.length < 1) {
            this.baseService.showNotification(this.constants.selectClass, "", this.constants.j_danger);
        } else if (this.sectionId.length < 1) {
            this.baseService.showNotification(this.constants.selectSection, "", this.constants.j_danger);
        } else if (this.classTeacherName.length < 1) {
            this.baseService.showNotification(this.constants.selectClassTeacher, "", this.constants.j_danger);
        } else {
            dataFound = true;
        }

        return dataFound;
    }

    setValidationsForAssign() : any {
        var dataFound = false;
        var subjectId = this.baseService.extractOptions(this.subject.nativeElement.selectedOptions)[0];
        var employeeId = this.baseService.extractOptions(this.subjectTeacher.nativeElement.selectedOptions)[0];
        if(subjectId.id == "" || subjectId.id == undefined) {
            this.baseService.showNotification(this.constants.selectSubject, "", this.constants.j_danger);
        } else if (employeeId.id == "" ||  employeeId.id == undefined) {
            this.baseService.showNotification(this.constants.selectEmp, "", this.constants.j_danger);
        } else {
            dataFound = true;
        }

        return dataFound;
    }

    setValidationsForEdit() : any {
        var dataFound = true;
        this.subEmpDetails.forEach(div => {
            var selected = div.nativeElement.getElementsByTagName('select')
            for (let entry of selected) {
                if(entry.value  == "" || entry.value == undefined) {
                    dataFound = false;
                    if(entry.dataset['name'] == 'id') {
                        this.baseService.showNotification(this.constants.selectSubject, "", this.constants.j_danger);
                    } else {
                        this.baseService.showNotification(this.constants.selectEmp, "", this.constants.j_danger);
                    }
                }
            }
        });

        return dataFound;
    }

    deleteSubject(event: any) {
        $(event.target.parentElement.parentElement).html('')
    }

    saveCallback(result: any, err: any) {
        if(err) {
            this.baseService.showNotification('Failure!', result, 'bg-danger');
        } else {
            this.baseService.showNotification('Success!', result.message, 'bg-success');
            this.baseService.closeOverlay('#new-timetable');
        }
    }

    getClassTeacher() {
        this.commonService.get(this.serviceUrls.getClassTeacher + this.classId + '/' + this.sectionId).then(
            result => this.classTeacherCallback(result, false),
            error => this.classTeacherCallback(<any>error, true))
    }

    classTeacherCallback(result: any, err: any) {
        this.classTeacherName = result.class_teacher_id;
        this.baseService.enableSelectWithEmpty('#employee-select', this.classEmployees, this.constants.empObj, this.classTeacherName)
        this.baseService.disableLoading()
    }

}

