 /**
 * Created by maggi on 23/05/17.
 */

import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormControl, FormBuilder, Validators, AbstractControl, FormArray} from "@angular/forms";
import {BaseService} from "../../../../../../../../services/base/base.service";
import {Constants, Messages} from "../../../../../../../../common/index";
import {ServiceUrls} from "../../../../../../../../common/constants/service.urls";
import {FileUploader} from "ng2-file-upload";
import {AttachmentComponent} from "../../../../../../common/attachment/attachment.component";
import {CommonService} from "../../../../../../../../services/common/common.service";
 declare var _ :any;
 declare var moment: any;
 declare var jQuery: any;

@Component({
    selector: 'add-exam-schedule',
    templateUrl: 'add-exam-schedule.html'
})
export class AddExamScheduleComponent implements OnInit {

    @ViewChild('sms') sms: ElementRef
    // @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef;
    @ViewChild('portionDes') portionDes: ElementRef;
    @ViewChild(AttachmentComponent) attachmentComponent: AttachmentComponent;

    examForm: any;
    exam: any;
    buttonVal: string;
    examTypes: any[];
    classSections: any;
    classes: any;
    sections: any;
    classId: any;
    sectionIds: any[];
    subjects: any[];
    deletedSubjects: any[] = [];
    saveDisable: boolean;
    datei = 0;
    date1: Date = new Date(0,0,0, 9,0);
    timepicker: any;
    examSchedule: any;
    date: any[] = [];
    startTime: any[] = [];
    endTime: any[] = [];
    edit: boolean = false;
    inputType: string;
    selectDisabled: boolean;
    getExam: boolean = false;
    uploadId: any;
    attachments: any[] = [];
    portionData: any = {};
    attachmentsForm: any = {};
    existingAttachments: any[];
    portions: any;
    portionTab: boolean;
    feature: any[];
    hideNoSubjects: boolean = false;
    notifications: boolean = true;

    public uploader:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload', allowedMimeType: this.constants.allowFileTypes});
    constructor(private constants: Constants,
                private messages: Messages,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private baseService: BaseService,
                private fb: FormBuilder) { }

    ngOnInit() {
        this.uploader.options.headers = this.baseService.getHeaderContentForUploader();
        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        }
        this.uploader.onBuildItemForm = (item, form) => {
            form.append('uploadId', this.uploadId);
        };

        this.uploader.onWhenAddingFileFailed = (item:any, filter:any, options:any) => {
            this.baseService.showUploadFileNotification(item, filter, options)
            return {item, filter, options};
        }

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            this.attachments.push(this.baseService.extractAttachment(response))
        }

        this.subjects = null;
        this.commonService.get(this.serviceUrls.classSession).then(classSections => this.callBackClass(classSections));
        this.createExamForm();
        this.datei = 0;
        this.examSchedule = null;
        this.sectionIds = [];
        this.saveDisable = true;
        this.inputType = 'add';
        this.portionTab = false;
        this.existingAttachments = [];
        this.edit = this.baseService.havePermissionsToEdit(this.constants.EXAM_SCHEDULE_PERMISSIONS);
        this.getFeatureChannelConfiguration();
    }

    tabChange(currentTab: string) {
        if (currentTab === 'Schedule') {
            this.portionTab = false;
        } else {
            this.portionTab = true;
        }
    }

    callBackClass(classSections: any) {
        this.classSections = classSections;
        this.baseService.enableSelectWithEmpty('#select-class', this.classSections,[ 'className', 'classId' ], null);
    }

    createExamForm() {
        this.uploader.clearQueue();
        this.examForm = this.fb.group({
            'schedule': this.fb.array([
            ]),
            class_id: ['', Validators.required],
            class_name: ['', Validators.required],
            sections: [{}, Validators.required],
            written_exam_id: ['', Validators.required],
            written_exam_name: ['', Validators.required],
            "notify": this.fb.group({
                "sms":'',
                "email": '',
                "push": ''
            }),
            'notifyTo': this.fb.group({
                'status': this.constants.Sent
            }),
            status: false,
            portions: this.fb.group({
                portion_id:'',
                portion_details:'',
                files:[],

            }),
        });
    }

    isScheduleValid() {
        if (this.examForm.controls['schedule'].length >= 1)
            return true;
        return false;
    }

    public clearSchedule(){
        this.date = [];
        this.startTime = [];
        this.endTime = [];

        while (this.examForm.controls.schedule.length) {
            this.examForm.controls.schedule.removeAt(this.examForm.controls.schedule.length - 1);
        }
    }

    initSubject() {
        this.saveDisable = false;
        return this.fb.group({
            'subject_name': ['', Validators.required],
            'subject_id': ['', Validators.required],
            'date': ['', Validators.required],
            'exam_start_time': ['', Validators.required],
            'exam_end_time': ['', Validators.required],
            'mark': ['100']
        }, {validator: this.endTimeValidation});
    }

    initSubjectWithValue(subject: any) {
        this.saveDisable = false;
        return this.fb.group({
            'subject_name': subject.subject_name,
            'subject_id': subject.subject_id,
            'date': [subject.exam_start_time, Validators.required],
            'exam_start_time': [subject.exam_start_time, Validators.required],
            'exam_end_time': [subject.exam_end_time, Validators.required],
            'mark': [subject.mark],
        });
    }

    endTimeValidation(control : AbstractControl) : {[s:string ]: boolean} {
        if (new Date(control.get('exam_start_time').value).getTime() === new Date(control.get('exam_end_time').value).getTime() ||
            new Date(control.get('exam_start_time').value) > new Date(control.get('exam_end_time').value)) {
            return { valid: false };
        } else {
            return null;
        }
    }

    deleteSubject(index:number) {
        this.examForm.controls.schedule.removeAt(index);
        this.saveDisable = !this.examForm.controls.schedule.valid;

        /*
        var subjectToMove = this.deletedSubjects[this.deletedSubjects.length - 1];
        this.subjects.push(subjectToMove);
        this.deletedSubjects = this.deletedSubjects.filter(function(sub: any) {
            return sub.subjectId !== subjectToMove.subjectId;
        });
        this.regenerateSubject();*/
    }

    regenerateSubject() {
        for (var i=0; i<this.examForm.controls.schedule.controls.length; i++) {
            var subjectId = this.examForm.controls.schedule.controls[i].controls.subject_id.value;
            subjectId = subjectId !== '' ? subjectId : null;
            this.baseService.enableSelectWithEmpty('#select-subject'+i, this.subjects, this.constants.sectionSubObj, subjectId);
        }
    }

    isEmptyObject() {
        var scheduledSubjects = this.examForm.controls.schedule.value, i = 0;
        while (i < scheduledSubjects.length) {
            for (var key in scheduledSubjects[i]) {
                if (scheduledSubjects[i].hasOwnProperty(key)) {
                    if (scheduledSubjects[i][key] === '') {
                        return true;
                    }
                }
            }
            i++;
        }
        return false;
    }

    addSubject(index: number) {

        var subject = this.examForm.controls.schedule.controls[index-1].value,
            schedules = this.examForm.controls.schedule.value, foundSchedule = {}, foundDuplicate = false;

        if (this.examForm.controls.schedule.length >= 2) {
            schedules.forEach(function (obj: any) {
                if (foundSchedule[obj.subject_id]) {
                    foundDuplicate = true;
                } else {
                    foundSchedule[obj.subject_id] = obj.subject_name;
                }
            });
        }

        if (this.isEmptyObject()) {
            this.baseService.showNotification('Please fill all the fields to add subject', '', 'bg-danger');
            return;
        } else if (foundDuplicate) {
            this.baseService.showNotification('Please choose unique subject to schedule', '', 'bg-danger');
            return;
        } else if (new Date(subject.exam_start_time).getTime() === new Date(subject.exam_end_time).getTime() ||
                new Date(subject.exam_start_time) > new Date(subject.exam_end_time)) {
            this.baseService.showNotification('End time should be greater than start time ', '', 'bg-danger');
            return;
        }

        /*console.info('subject....',subject);
        var subjectToRemove = this.subjects.find((obj:any) => obj.subjectId === subject.subject_id);
        console.info('subjectToRemove....',subjectToRemove);
        this.deletedSubjects.push(subjectToRemove);
        this.subjects = this.subjects.filter(function(sub: any) {
            console.info('sub....',sub);
            return sub.subjectId !== subjectToRemove.subjectId;
        });*/

        this.saveDisable = true;
        this.examForm.controls['schedule'].insert(index, this.initSubject());
        this.date.splice(index, 0, "");
        this.startTime.splice(index, 0, "");
        this.endTime.splice(index, 0, "");
        setTimeout(()=> {
            this.baseService.enableSelectWithEmpty('#select-subject'+index, this.subjects, this.constants.sectionSubObj, null);
            this.baseService.enablePickerDateByElement('#exam_date'+index);
        }, 100);
    }

    getExamType(event: any) {
        this.examForm.controls.written_exam_id.setValue(event.target.value);
        this.examForm.controls.written_exam_name.setValue(event.target.selectedOptions[0].text);
        this.isValidToSearch();
    }

    getSectionByClass(event: any) {
        this.sectionIds = [];
        this.portion();
        this.hideNoSubjects = false;
        if (event.target.value === '') {
            this.classId = null;
            this.examForm.controls.sections.setValue({});
            this.baseService.addHideClass('.select-section');
            this.isValidToSearch();
            return;
        }
        this.subjects = null;
        this.examForm.controls.class_id.setValue(event.target.value);
        this.examForm.controls.class_name.setValue(event.target.selectedOptions[0].text);
        this.classId = event.target.value;
        this.setSectionControl(event.target.value, []);
        this.isValidToSearch();
    }

    setSectionControl(classId: string, selectedSection: any[]) {
        var selectedClass = this.classSections.find((obj:any) => obj.classId === classId);
        this.baseService.enableMultiSelectFilteringAll('#select-section', selectedClass.sections,[ 'sectionName', 'sectionId' ], selectedSection);
        this.baseService.removeHideClass('.select-section');
    }

    getSection(event:any) {
        // event.target.selectedOptions
        if (event.target.selectedOptions.length === 0) {
            this.sectionIds = [];
            this.isValidToSearch();
            this.hideNoSubjects = false;
            this.notifications = true;
            this.portion();
            return;
        }
        var sectionObj = {}, sectionIds = [];
        for (var i=0; i < event.target.selectedOptions.length; i++) {
            sectionIds.push(event.target.selectedOptions[i].value);
            sectionObj[event.target.selectedOptions[i].value] = event.target.selectedOptions[i].text;
        }

        this.examForm.controls.sections.setValue(sectionObj);
        this.sectionIds = sectionIds;
        // this.subjects = null;
        this.saveDisable = true;
        // this.clearSchedule();
        this.isValidToSearch();
    }

    isValidToSearch() {
        if (this.classId === null || this.examForm.controls.written_exam_id.value === null ||
            this.examForm.controls.written_exam_id.value === '' || this.sectionIds.length === 0) {

            // this.saveDisable = true;
            this.clearSchedule();
            return false;
        } else {
            if(this.inputType !== 'clone'){
                this.search();
            }

            // this.saveDisable = !this.isScheduleValid();
        }

    }

    search() {
        //this.examSchedule = null;
        this.clearSchedule();
        this.getFeatureChannelConfiguration();
        this.commonService.post(this.serviceUrls.getSubjectsByMultiSections, {
            sectionIds: this.sectionIds,
            classId: this.classId
        }).then(
            result => this.callBackSubjects(result),
            error => this.callBackSubjectsErr(<any>error))

    }

    callBackSubjectsErr(err: any) {
        if (err.indexOf('section: ') > 0) {
            var sectionID = err.substring(err.indexOf('section: ')+9);
            var sectionName = this.examForm.controls.sections.value[sectionID];
            var err1 = err.substring(0, err.indexOf('section: ')+9) +  sectionName;
            this.baseService.showNotification(err1, "", 'bg-danger');
        } else {
            this.baseService.showNotification(err, "", 'bg-danger');
        }
    }

    portion(){
        this.portions = '';
        this.portionData = {};
        jQuery('#description').val("");
    }

    callBackSubjects(subjects: any) {
        this.subjects = subjects;
        if (subjects.length > 0) {
            this.hideNoSubjects = true;
            this.notifications = false;
            var exsitingSchedules = this.examForm.controls.schedule.value;
            for (var i=0; i<exsitingSchedules.length; i++) {
                var subjectId = exsitingSchedules[i].subject_id;
                var isSubject = subjects.filter((obj:any) => obj.subjectId === subjectId);
                if (isSubject.length === 0) {
                    this.deleteSubject(i);
                } else {
                    this.baseService.enableSelectWithEmpty('#select-subject' + i, subjects, this.constants.sectionSubObj, subjectId);
                }
            }
            this.getExistingExamSchedule();
        } else {
            this.hideNoSubjects = false;
            this.notifications = true;
            this.baseService.showNotification('No Subject associcated to the Class and Section', '', 'bg-danger');
            this.clearSchedule();
        }

    }

    show(event: any, inputs: string, examTypes: any[]) {
        this.datei = this.datei + 1;
        // this.buttonVal = bVal;
        this.examTypes = examTypes;
        if (inputs !== null) {
            var inputData = JSON.parse(inputs);
            this.inputType = inputData.click;
            this.saveDisable = false;
            // this.saveDisable = inputData.click === 'clone' ? true : false;
            if (inputData.click === 'edit' || inputData.click === 'clone') {
                this.edit = true;
            } else if (inputData.click === 'view') {
                this.edit = false;
            }
            this.getExamSchedule(inputData.id);
        } else {
            this.edit = true;
            this.inputType = 'add';
            this.baseService.enableSelectWithEmpty('#select-exam', this.examTypes, ['written_exam_name', 'written_exam_id'], null);
        }

        if (this.inputType === 'clone') {
            this.selectDisabled = true;
            jQuery('#select-class').attr('disabled', true);
        } else {
            this.selectDisabled = false;
            jQuery('#select-class').removeAttr('disabled');
            jQuery('#select-class').selectpicker('refresh');

        }


        // jQuery('#add-exam-tabs ul > li').removeClass('active');
        jQuery('#scheduleTab').click();
        this.commonService.getActiveFeatureChannelDetails(this.feature);
        this.baseService.openOverlay(event);
    }

    getExamSchedule(exam_schedule_id: string) {
        this.commonService.get(this.serviceUrls.examSchedule + exam_schedule_id).then(
            examSchedule => this.callBack(examSchedule)
        );
    }

    getExistingExamSchedule() {
        var typeId = this.examForm.controls.written_exam_id.value
        this.commonService.post(this.serviceUrls.examScheduleByType + typeId, {
            sections: this.sectionIds,
            class_id: this.classId
        }).then(
            examSchedule => this.callBack(examSchedule),
            error => this.baseService.showNotification(error, '', 'bg-danger')
        );
    }

    callBack(pCurrExamSchedule: any) {
        if (this.examSchedule !== null && pCurrExamSchedule.length > 0 && this.examSchedule.exam_schedule_id === pCurrExamSchedule[0].exam_schedule_id) {
            this.saveDisable = !this.examForm.controls.schedule.valid;
            if (this.examForm.controls.schedule.length === 0) {
                this.examForm.controls['schedule'].push(this.initSubject());
                 setTimeout(() => {
                 this.baseService.enableSelectWithEmpty('#select-subject0', this.subjects, this.constants.sectionSubObj, null);
                 this.baseService.enablePickerDateByElement('#exam_date0');
                 }, 100);
            }
            return;
        }

        if (this.sectionIds.length > 1 && this.examSchedule !== null &&
            this.examSchedule.exam_schedule_id !== pCurrExamSchedule[0].exam_schedule_id &&
            pCurrExamSchedule.length > 0) {

            this.baseService.showNotification('Exam (' + pCurrExamSchedule[0].written_exam_name + ') is already scheduled  for this class and section', "", 'bg-danger');
            return;
        }
        var currExamSchedule = Array.isArray(pCurrExamSchedule) ?
            pCurrExamSchedule.length > 0  ? pCurrExamSchedule[0]: {} : pCurrExamSchedule ;

        if (Object.keys(currExamSchedule).length > 0) {
            this.clearSchedule();

            this.examSchedule = currExamSchedule;
            this.editForm(currExamSchedule);
            if (this.edit) {
                // if (currExamSchedule.status && this.inputType !== 'clone') {
                if (this.inputType !== 'clone') {
                    this.edit = false;
                } else {
                    this.edit = true;
                }
            }
        } else {
            if (this.examForm.controls['schedule'].length === 0) {
                this.examForm.controls['schedule'].push(this.initSubject());
                setTimeout(() => {
                    this.baseService.enableSelectWithEmpty('#select-subject0', this.subjects, this.constants.sectionSubObj, null);
                    this.baseService.enablePickerDateByElement('#exam_date0');
                }, 100);
            }
        }

    }

     editForm(currExamSchedule: any) {
        this.hideNoSubjects = true;
        this.notifications = false;
        this.baseService.enableSelectWithEmpty('#select-exam', this.examTypes,
            ['written_exam_name', 'written_exam_id'], currExamSchedule.written_exam_id);

        this.portions = currExamSchedule.portions;
        if (currExamSchedule.portions && this.portions.files){
            this.portionData.attachments = this.portions.files;
            this.existingAttachments = this.portions.files;
            if(this.portionData.attachments.length > 0) {
                this.portionData.attachments = this.portions.files;
            }else {
                this.portionData.attachments="";
            }

        } else {
            this.portionData.attachments = '';
            this.existingAttachments = [];
        }
        if (currExamSchedule.portions) {
            this.examForm.controls.portions.controls.portion_details.setValue(this.portions.portion_details);
        }

        this.classId = currExamSchedule.class_id;
        this.examForm.controls.class_id.setValue(currExamSchedule.class_id);
        this.examForm.controls.class_name.setValue(currExamSchedule.class_name);
        this.examForm.controls.written_exam_id.setValue(currExamSchedule.written_exam_id);
        this.examForm.controls.written_exam_name.setValue(currExamSchedule.written_exam_name);
        this.examForm.controls.sections.setValue(currExamSchedule.sections);
        this.baseService.enableSelectWithEmpty('#select-class', this.classSections, ['className', 'classId'], currExamSchedule.class_id);

        var self = this;
        this.sectionIds = [];
        Object.keys(currExamSchedule.sections).forEach(function (section_id) {
            self.sectionIds.push(section_id);
        });
        self.setSectionControl(currExamSchedule.class_id, this.sectionIds);

        if (this.edit && currExamSchedule.schedule != null) {
            this.editSubjectsByClass(currExamSchedule);
        } else  if (currExamSchedule.schedule != null) {
            for (var i=0; i<currExamSchedule.schedule.length; i++) {
                this.examForm.controls['schedule'].push(this.initSubjectWithValue(currExamSchedule.schedule[i]));
                var viewSubject = { subjectName: currExamSchedule.schedule[i].subject_name,
                    subjectId: currExamSchedule.schedule[i].subject_id };
                this.setSubject(this, i, [viewSubject], currExamSchedule.schedule[i]);
            }
        } else {
            this.editSubjectsByClass(currExamSchedule);
        }
        if (this.inputType === 'clone') {
            this.examForm.controls.status.setValue(false);
        } else {
            this.examForm.controls.status.setValue(currExamSchedule.status);
        }
        this.saveDisable = false;
    }

    editSubjectsByClass(currExamSchedule: any) {
        this.commonService.post(this.serviceUrls.getSubjectsByMultiSections, {sectionIds: this.sectionIds, classId: this.classId}).then(
            subjects => this.editCallBackSubjects(subjects, currExamSchedule)
        )
    }

    editCallBackSubjects(subjects: any, currExamSchedule: any) {
        this.subjects = subjects;
        if (currExamSchedule.schedule === null || currExamSchedule.schedule && currExamSchedule.schedule.length === 0) {
            this.examForm.controls['schedule'].push(this.initSubject());
            setTimeout(() => {
                this.baseService.enableSelectWithEmpty('#select-subject0', this.subjects, this.constants.sectionSubObj, null);
                this.baseService.enablePickerDateByElement('#exam_date0');
            }, 100);
        } else {
            for (var i = 0; i < currExamSchedule.schedule.length; i++) {
                this.examForm.controls['schedule'].push(this.initSubjectWithValue(currExamSchedule.schedule[i]));
                this.setSubject(this, i, this.subjects, currExamSchedule.schedule[i]);
            }
        }

        // this.baseService.removeHideClass('.subjects');
    }

    setSubject(self:any, i: number, subjects:any, subject: any) {
        setTimeout(function() {
            self.baseService.enableSelectWithEmpty('#select-subject'+i, subjects, self.constants.sectionSubObj, subject.subject_id);
            self.baseService.enablePickerDateByElement('#exam_date'+i);
        }, 200);

        var startDate = new Date(subject.exam_start_time),
            endDate = new Date(subject.exam_end_time);
        this.examForm.controls.schedule.controls[i].controls.date.setValue(startDate.toDateString());
        this.examForm.controls.schedule.controls[i].controls.exam_start_time.setValue(startDate.toTimeString());
        this.examForm.controls.schedule.controls[i].controls.exam_end_time.setValue(endDate.toTimeString());
        this.examForm.controls.schedule.controls[i].controls.mark.setValue(subject.mark);
        this.date[i] = this.baseService.dateFormat(subject.exam_start_time);
        this.startTime[i] = startDate;
        this.endTime[i] = endDate;

    }

    getSubject(event: any, index: number) {
        if (event.target.value === '') {
            this.saveDisable = true;
            this.examForm.controls.schedule.controls[index].controls.subject_id.setValue('');
            this.examForm.controls.schedule.controls[index].controls.subject_name.setValue('');
        } else {
            this.saveDisable = false;
            this.examForm.controls.schedule.controls[index].controls.subject_id.setValue(event.target.value);
            this.examForm.controls.schedule.controls[index].controls.subject_name.setValue(event.target.selectedOptions[0].text);
        }
    }

    dateChange(event:any) {
        console.info('change happend...');
    }

    getExamDate(event:any, index: number) {
        this.date[index] = event.target.value;
        this.examForm.controls.schedule.controls[index].controls.date.setValue(event.target.value);
        var examDate = new Date(event.target.value);
        this.updateTime(examDate,  this.examForm.controls.schedule.controls[index].controls.exam_start_time, this.startTime[index]);
        this.updateTime(examDate,  this.examForm.controls.schedule.controls[index].controls.exam_end_time, this.endTime[index]);
    }

    updateTime (examDate:Date, ctrl: FormControl, modelValue: any) {
        if (modelValue) {
            var ctrlsDate = new Date(modelValue);
            examDate.setHours(ctrlsDate.getHours(), ctrlsDate.getMinutes(), ctrlsDate.getSeconds());
            ctrl.setValue(examDate.toString());
        }
    }

    getStartTime(event:Date, index: number) {
        if (event) {
            event.setSeconds(1);
            this.setExamTime(event, index, this.examForm.controls.schedule.controls[index].controls.exam_start_time);
        }
    }

    getEndTime(event:Date, index: number) {
        if (event) {
            this.setExamTime(event, index, this.examForm.controls.schedule.controls[index].controls.exam_end_time);
        }
    }

    setExamTime(event: Date, index: number, ctrl: FormControl) {
        var examDate = this.examForm.controls.schedule.controls[index].controls.date.value;
        if (event && examDate) {
            var date = new Date(examDate);
            date.setHours(event.getHours(), event.getMinutes(), event.getSeconds());
            ctrl.setValue(date.toString());
        }
    }

    closeOverlay() {
        this.baseService.closeOverlay("#add_schedule_exam");
        this.attachments.pop();
        this.createExamForm();
        this.uploader.clearQueue();
        this.portions = '';
        this.portionData = {};
        this.examSchedule = null;
        this.saveDisable = true;
        this.sms.nativeElement.checked = true;
        this.hideNoSubjects = false;
        this.notifications = true;
        // this.email.nativeElement.checked = true;
        this.push.nativeElement.checked = true;
        this.resetInputs();
    }

    resetInputs() {
        this.clearSchedule();
        this.date = [];
        this.startTime = [];
        this.endTime = [];
        this.baseService.enableSelectWithEmpty('#select-exam', this.examTypes, ['written_exam_name', 'written_exam_id'], null);
        this.baseService.enableSelectWithEmpty('#select-class', this.classSections,[ 'className', 'classId' ], null);
        jQuery('#select-class').removeAttr('disabled');
        this.baseService.addHideClass('.select-section');
        this.classId = null;
        this.sectionIds = [];
        this.createExamForm();
        this.portionTab = false;
        this.existingAttachments = [];
    }

    validation (callback: any) {
        if (this.portionTab) {
            if (!this.examForm.controls.written_exam_id.value || !this.classId || this.sectionIds.length < 1){
                if (!this.examForm.controls.written_exam_id.value) {
                    this.baseService.showNotification("Please select Exam Name", '', 'bg-danger');
                } else if (!this.classId) {
                    this.baseService.showNotification("Please select Class Name", '', 'bg-danger');
                } else if (this.sectionIds.length < 1) {
                    this.baseService.showNotification("Please select Section", '', 'bg-danger');
                }
            }
            else if (this.examForm.controls.portions.controls.portion_details.value === '' &&
                (this.uploader.getNotUploadedItems().length === 0 && this.existingAttachments.length === 0)) {
                this.baseService.showNotification('Please enter portion description or attachments', '', 'bg-danger');
            } else if (this.examForm.controls.schedule.length <= 1) {
                if (!this.examForm.controls.schedule.valid) {
                    this.examForm.controls.schedule.removeAt(0);
                }
                callback(false);
            } else {
                if (!this.examForm.controls.schedule.valid) {
                    this.baseService.showNotification('Please fill all the fields in Schedule tab', '', 'bg-danger');
                } else {
                    this.validateSchedules(callback);
                }
            }
        } else {
            this.validateSchedules(callback);
        }
    }

    validateSchedules(callback: any) {
        var schedules = this.examForm.controls.schedule.value, duplicate = false
        var data = {schedules: schedules, duplicate: duplicate, subjects: this.subjects};
        this.baseService.waterfallOver(schedules, this.checkOverrideTime, data, function (err: any, result: any) {
            callback(result.duplicate);
        });
    }


    checkOverrideTime(schedule: any, index: number, data: any, report: any) {
        if (index === data.schedules.length - 1) {
            report(null, data);
        }

        for (var j=index+1; j < data.schedules.length; j++) {
            var startA = new Date(schedule.exam_start_time),
                endA = new Date(schedule.exam_end_time),
                startB = new Date(data.schedules[j].exam_start_time),
                endB = new Date(data.schedules[j].exam_end_time);

            // (startA <= endB)  and  (endA >= startB) || (startA <= endB)  and  (startB <= endA)
            if ( (startA <= endB)  &&  (endA >= startB) || (startA <= endB)  &&  (startB <= endA) ) {

                var subjectASections = data.subjects.find((subject:any) => subject.subjectId === schedule.subject_id).sectionIds;
                var subjectBSections = data.subjects.find((subject:any) => subject.subjectId === data.schedules[j].subject_id).sectionIds;
                var findInSections = subjectASections.filter(function(sectionId: any) {
                    return subjectBSections.find((sectionIdB:any) => sectionIdB === sectionId);
                });

                if (!data.duplicate) {
                    data.duplicate = findInSections.length > 0;
                }
                report(null, data);

            } else {
                report(null, data);
            }
        }


    }

    save() {
        var self = this;
        this.validation(function (duplicate: boolean) {
            if (!duplicate) {
                self.saveAfterValidate();
            } else {
                self.baseService.showNotification('Same Date and Times are entered more than two subjects', '', 'bg-danger');
            }
        });

    }

    draft() {
        this.examForm.controls.status.setValue(false);
        this.save();
    }

    saveAfterValidate() {
        var duplicatesFound = false, duplicateExamDate = false, duplicateTimes = false;
        if (this.examForm.controls.schedule.value) {
            var schedules = this.examForm.controls.schedule.value;
            var subjectName : any[];
            var examDate : any[];
            _.forEach(schedules, function(val: any) {
                if(val.exam_start_time === val.exam_end_time || val.exam_start_time > val.exam_end_time){
                    duplicateTimes = true;
                    return false;
                }
                subjectName = _.filter(schedules, {'subject_id' : val.subject_id});
                examDate = _.filter(schedules, {'date' : val.date});
                if(subjectName.length > 1) {
                    duplicatesFound = true;
                    return false;
                }
                if(examDate.length > 1){
                    if(examDate[0].exam_start_time == examDate[1].exam_start_time || examDate[0].exam_end_time == examDate[1].exam_end_time){
                        duplicateExamDate = true;
                        return false
                    }else if(moment(examDate[1].exam_start_time).isBetween(examDate[0].exam_start_time, examDate[0].exam_end_time) ||
                        moment(examDate[1].exam_end_time).isBetween(examDate[0].exam_start_time, examDate[0].exam_end_time)){
                        duplicateExamDate = true;
                        return false
                    }
                }
            })
            if(duplicateTimes){
                this.baseService.showNotification('End time should be greater than start time ', '', 'bg-danger');
                return;
            }
            else if(duplicatesFound) {
                this.baseService.showNotification('Duplicate subject ' + subjectName[0].subject_name + ' are found', '', 'bg-danger');
                return;
            }else if(duplicateExamDate){
                this.baseService.showNotification('Same Date and Times are entered more than two subjects', '', 'bg-danger');
                return
            }
        }

        this.examForm._value.notify.sms = this.sms.nativeElement.checked;
        /*this.examForm._value.notify.email = this.email.nativeElement.checked;*/
        this.examForm._value.notify.push = this.push.nativeElement.checked;

        if (this.inputType === 'clone') {
            this.examSchedule = null;
        }

        this.baseService.enableBtnLoading('saveasdraft');
        this.baseService.enableBtnLoading('publish');
        this.examForm._value.isPortions = this.uploader.queue.length >= 1 ? true : false;
        if (this.examSchedule === null) {
            if(this.portionDes.nativeElement.value){
                this.examForm._value.portions.portion_details = this.portionDes.nativeElement.value;
             }else {
                this.examForm._value.portions = {};
            }

            this.commonService.post(this.serviceUrls.examSchedule, this.examForm._value).then(
                result => this.saveExamCallBack(result,'bg-success', false),
                error => this.saveExamCallBack(<any> error,'bg-danger',true))
        } else {
            this.examForm._value.secondTime = false;
            this.examForm._value.portions.files = this.existingAttachments;
            this.uploadId = this.examSchedule.exam_schedule_id;

            if (this.uploader.getNotUploadedItems().length) {
                this.uploader.uploadAll();
            } else {
                this.examForm._value.portions.portion_id = this.portions.id;
                this.examForm._value.portions.portion_details = this.portionDes.nativeElement.value;
                this.examForm._value.portions.files = this.existingAttachments;
                this.commonService.put(this.serviceUrls.examSchedule + this.examSchedule.exam_schedule_id, this.examForm._value).then(
                    result => this.addAttachmentsCallback(result,'bg-success', false),
                    error => this.addAttachmentsCallback(<any> error,'bg-danger',true))
            }
            this.uploader.onCompleteAll = () => {
                this.examForm._value.portions.portion_id = this.portions.id;
                this.examForm._value.portions.portion_details = this.portionDes.nativeElement.value;
                this.examForm._value.portions.files = this.existingAttachments.concat(this.attachments);
                this.commonService.put(this.serviceUrls.examSchedule + this.examSchedule.exam_schedule_id, this.examForm._value).then(
                    result => this.addAttachmentsCallback(result,'bg-success', false),
                    error => this.addAttachmentsCallback(<any> error,'bg-danger',true))
            }
        }
    }

    publish() {
        this.examForm.controls.status.setValue(true);
        this.save();
    }

    saveExamCallBack(msg:any, msgIcon:string, error:boolean){
        this.uploadId = msg.exam_schedule_id;
        if(this.uploader.getNotUploadedItems().length) {
                this.uploader.uploadAll();
         } else {
                this.addAttachmentsCallback(msg, msgIcon, error)
         }
         this.uploader.onCompleteAll = () => {
         this.attachmentsForm['attachments'] = this.attachments;
             this.addAttachements(this.attachmentsForm, msg);
         }
    }

    addAttachements(file: any, result:any){
        this.examForm._value.portions.portion_id = result.id;
        this.examForm._value.portions.portion_details = this.portionDes.nativeElement.value;
        this.examForm._value.portions.files = file.attachments;
        this.examForm._value.secondTime = true;
        this.commonService.put(this.serviceUrls.examSchedule + result.exam_schedule_id, this.examForm._value).then(
            result => this.addAttachmentsCallback(result,'bg-success', false),
            error => this.addAttachmentsCallback(<any> error,'bg-danger',true))
    }

    addAttachmentsCallback(result: any, msgIcon:string , error: any){
        if(error){
            this.baseService.showNotification(result,"", msgIcon);
        }else {
            result.message = this.examForm._value.secondTime ? result.message.replace('Updated', 'Type Saved') : result.message;
            this.attachments.pop();
            this.baseService.showNotification(result.message, "", msgIcon);
            this.closeOverlay();
            this.createExamForm();
            this.uploader.clearQueue();
            this.portions = '';
            this.portionData = {};
            this.baseService.dataTableReload('datatable-exam-schedule');
        }
        this.baseService.disableBtnLoading('saveasdraft');
        this.baseService.disableBtnLoading('publish');
    }
    viewAttachment() {
        this.commonService.get(this.serviceUrls.getPortion +  this.portions.id).then(
            portion => this.callBackPortion(portion))
    }

    callBackPortion(value: any){
        this.portionData = value;
        this.portionData.attachments = value.files;
        this.portionData['url'] = this.serviceUrls.deletePortionAttachement;
        this.portionData['scheduleobject'] = this.examSchedule.status;
        if(this.inputType == "clone"){
            this.attachmentComponent.openModal(this.portionData, false);
        } else{
            this.attachmentComponent.openModal(this.portionData, true);
        }
    }


    getExistingFiles(event: any){
        this.existingAttachments = JSON.parse(event.target.value);
    }

    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)
        )
    }

    callBackChannels(data: any) {
        this.feature = data;
        this.commonService.getActiveFeatureChannelDetails(data);
    }


}
