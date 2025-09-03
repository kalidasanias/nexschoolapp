/**
 * Created by Cyril  on 05-Mar-17.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService} from "../../../../../services/index";
import {ValidationService} from "../../../../../services/validation/validation.service";
import {Constants} from "../../../../../common/constants/constants";
import {FileUploader} from "ng2-file-upload";
import {ServiceUrls} from "../../../../../common/constants/service.urls";
import {WizardComponent} from "../../../../wizard/wizard.component";
import {AttachmentComponent} from "../../../common/attachment/attachment.component";
import {CommonService} from "../../../../../services/common/common.service";
declare var $: any;
declare var _: any;

@Component({
    selector: 'add-student',
    templateUrl: 'add-student.html'
})

export class AddStudentComponent implements OnInit {
    @ViewChild('class') class: ElementRef;
    @ViewChild('section') section: ElementRef;
    @ViewChild('lang1') lang1: ElementRef;
    @ViewChild('lang2') lang2: ElementRef;
    @ViewChild('lang3') lang3: ElementRef;
    @ViewChild('gender') gender: ElementRef;
    @ViewChild('hostel') hostel: ElementRef;
    @ViewChild('health') health: ElementRef;
    @ViewChild('date_of_birth') date_of_birth: ElementRef;
    @ViewChild('date_of_joining') date_of_joining: ElementRef;
    @ViewChild('father_qualification') father_qualification: ElementRef;
    @ViewChild('father_phone') father_phone: ElementRef;
    @ViewChild('mother_qualification') mother_qualification: ElementRef;
    @ViewChild('mother_phone') mother_phone: ElementRef;
    @ViewChild('isFatherPrimary') isFatherPrimary: ElementRef;
    @ViewChild('isMotherPrimary') isMotherPrimary: ElementRef;
    @ViewChild('isFatherName') isFatherName : ElementRef;
    @ViewChild('isMotherName') isMotherName : ElementRef;


    @ViewChild(WizardComponent) wizardComponent: WizardComponent;
    @ViewChild(AttachmentComponent) attachmentComponent: AttachmentComponent;

    studentForm: any;
    password :boolean = false;
    schoolBus: boolean = false;
    sectiondropdown: boolean = true;
    parentForm: any;
    emergencyForm: any;
    additionalForm: any;
    attachmentForm: any;
    Student: any;
    modalId: any;
    parent: any;
    buttonVal: string;
    languages: any[];
    attachments: any[] = [];
    profileattachments: any[] =[];
    attachmentsForm: any = {};
    genderOptions: any[];
    hostelOptions: any[];
    healthOptions: any[];
    user_name: string = null;
    studentData: any = {}
    uploadId: any;
    old_primary_phone: any;
    ParentLoginObjs: any;
    event: any;
    studentObj: any;

    //public uploader:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload'});
    //public profile:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload'});
    public uploader:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload', allowedMimeType: this.constants.allowFileTypes});
    public profile:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload', allowedMimeType: this.constants.allowFileTypes});

    constructor(private baseService: BaseService, private fb: FormBuilder,
                private serviceUrls: ServiceUrls,
                private element: ElementRef,
                private commonService: CommonService,
                private constants: Constants) {
    }

    ngOnInit() {
        this.uploader.options.headers = this.baseService.getHeaderContentForUploader();
        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        }

        this.uploader.onWhenAddingFileFailed = (item:any, filter:any, options:any) => {
            this.baseService.showUploadFileNotification(item, filter, options)
            return {item, filter, options};
        }

        this.profile.onWhenAddingFileFailed = (item:any, filter:any, options:any) => {
            this.baseService.showUploadFileNotification(item, filter, options)
            return {item, filter, options};
        }

        this.uploader.onBuildItemForm = (item, form) => {
            form.append('uploadId', this.uploadId);
        };

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            this.attachments.push(this.baseService.extractAttachment(response))
        }
        this.profile.options.headers = this.baseService.getHeaderContentForUploader();
        this.profile.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        }

        this.profile.onBuildItemForm = (item, form) => {
            form.append('uploadId', this.uploadId);
        };

        this.profile.onSuccessItem = (item, response, status, headers) => {
            this.profileattachments.push(this.baseService.extractAttachment(response))
        }

        this.genderOptions = [{value: 'male', name: 'Male'}, {value: 'female' , name: 'Female'}];
        this.hostelOptions = [{value: 'dayschool', name: 'Day School'}, {value: 'boarder' , name: 'Boarder'}];
        this.healthOptions = [ {value: 'VisionProblem', name: 'Vision Problem'},
            {value: 'HearingProblem', name: 'Hearing Problem'}, {value: 'WalkingProblem', name: 'Walking Problem'},
            {value: 'MigraineHeadache', name: 'Migraine / Headache'},
            {value: 'SkinComplaint', name: 'Skin Complaint'},
            {value: 'SpeechImpairment', name: 'Speech Impairment'}, {value: 'DustAllergy', name: 'Dust Allergy'},
            {value: 'Cold', name: 'Cold'}, {value: 'Asthma', name: 'Asthma'}, {value: 'HeavyFever', name: 'Heavy Fever'},
            {value: 'HeartProblem', name: 'Heart Problem'}, {value: 'BladderProblem', name: 'Bladder Problem'},
            {value: 'Epilepsy', name: 'Epilepsy'}];

        this.createStudentForm();
        this.Student= "";
        this.commonService.get(this.serviceUrls.getAllLanguages).then(languages => this.callBack(languages));
    }

    selectStay(){
        this.schoolBus = this.hostel.nativeElement.value =='boarder' ? true : false;
    }

    callBack(languages: any) {
        this.languages = languages;
    }

    openOverlay(event:any, bVal:string, emp_id: string, parent:any) {
        this.wizardComponent.reset();
        this.event = event;
        this.baseService.removeHideClass('#viewAttachment');
        this.buttonVal = bVal;
        this.parent = parent;
        this.resetForm();
        if (bVal == 'Update') {
            this.password = true;
            if(event.target.value) {
                this.studentObj = JSON.parse(event.target.value);
            }

            $('#select-class').attr('disabled', true);
            $('#profilePicture').attr('src', '');
            //$('#father_contact').attr('disabled', true);
            //$('#mother_contact').attr('disabled', true);
            this.commonService.get(this.serviceUrls.student + this.studentObj.user_name).then(data => this.callBackSuccessGet(data));
        } else {
            this.sectiondropdown = true;
            this.password = false;
            this.schoolBus = false;
            this.user_name = '';
            $('#select-class').attr('disabled', false);
            $('#profilePicture').attr('src', '');
            //$('#father_contact').attr('disabled', false);
            //$('#mother_contact').attr('disabled', false);
            this.baseService.enableSelectWithEmpty('#select-gender', this.genderOptions, [ 'name', 'value' ], null);
            this.baseService.enableSelect('#select-hostel', this.hostelOptions, [ 'name', 'value' ], null);
            this.baseService.enableMultiSelect('#select-health', this.healthOptions, [ 'name', 'value' ], null);
            this.baseService.enableSelectWithEmpty('#select-class', this.parent.classSections,[ 'className', 'classId' ], null);
            this.baseService.enableSelect('#select-lang1', this.languages,[ 'languageName', 'languageId' ], null);
            this.baseService.enableSelect('#select-lang2', this.languages,[ 'languageName', 'languageId' ], null);
            this.baseService.enableSelect('#select-lang3', this.languages,[ 'languageName', 'languageId' ], null);
        }
        this.baseService.openOverlay(event);
    }

    callBackSuccessGet(formData: any) {
        if(formData.active){
            this.studentData = formData
            this.user_name = formData.user_name
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            this.old_primary_phone = formData.primary_phone;
            this.editForm(formData);

            if (formData.date_of_birth != null) {
                var dob = new Date(formData.date_of_birth);
                this.date_of_birth.nativeElement.value = dob.getDate() + ' ' + monthNames[dob.getMonth()] + ', ' + dob.getFullYear();
            }

            if (formData.date_of_joining != null) {
                var doj = new Date(formData.date_of_joining);
                this.date_of_joining.nativeElement.value = doj.getDate() + ' ' + monthNames[doj.getMonth()] + ', ' + doj.getFullYear();
            }

            var isHostel = null;
            if (formData.is_hostel) {
                isHostel = 'boarder';
                this.schoolBus = true;
            } else {
                isHostel = 'dayschool';
                this.schoolBus = false;
            }
            this.setSection(formData.class_id, formData.section_id);
            if(formData.gender == null){
                this.baseService.enableSelectWithEmpty('#select-gender', this.genderOptions, [ 'name', 'value' ], null);
            }else {
                this.baseService.enableSelectWithEmpty('#select-gender', this.genderOptions, [ 'name', 'value' ], formData.gender);
            }

            this.baseService.enableSelect('#select-hostel', this.hostelOptions, [ 'name', 'value' ], isHostel);
            if (formData.medical_info) {
                this.baseService.enableMultiSelect('#select-health', this.healthOptions, [ 'name', 'value' ], JSON.parse(formData.medical_info.health) || null);
            }

            this.baseService.enableSelect('#select-class', this.parent.classSections,[ 'className', 'classId' ], formData.class_id);
            this.baseService.enableSelect('#select-lang1', this.languages,[ 'languageName', 'languageId' ], formData.languages['1'] || null);
            this.baseService.enableSelect('#select-lang2', this.languages,[ 'languageName', 'languageId' ], formData.languages['2'] || null);
            this.baseService.enableSelect('#select-lang3', this.languages,[ 'languageName', 'languageId' ], formData.languages['3'] || null);

        }else {
            this.baseService.showNotification(this.constants.deActiveStudentErr ,"", "bg-danger")
        }
    }


    classChange(event: any) {
        this.additionalForm.controls['class_id'].setValue(event.target.value);
        this.additionalForm.controls['class_name'].setValue(this.baseService.extractOptions(this.class.nativeElement.selectedOptions)[0].name);
        this.setSection(event.target.value, null);
    }

    setSection(classId: string, selectedSection: string) {
        if(classId == '') {
            this.sectiondropdown = true
        } else {
            var selectedClass = this.parent.classSections.find((obj:any) => obj.classId === classId);
            this.baseService.enableSelect('#select-section', selectedClass.sections,[ 'sectionName', 'sectionId' ], selectedSection);
            this.sectiondropdown = false
        }

    }

    editStudent(event: any, parent: any) {
        this.openOverlay(event, 'Update', null, parent);
    }

    closeOverlay() {
        this.father_phone.nativeElement.value = '';
        this.mother_phone.nativeElement.value = '';
        this.baseService.closeOverlay('#addStudent');
        this.uploader.clearQueue();
        this.profile.clearQueue();
        this.resetForm();
    }

    createStudentForm() {
        this.studentForm = this.fb.group({
            'first_name': ['', [Validators.required]],
            middle_name: '',
            last_name: '',
            short_name: '',
            nationality: 'Indian',
            mother_tongue: '',
            community: '',
            gender: '',
            hostel: '',
            transport_required: false,
            date_of_birth: [''],
            password: [''],
            place_of_birth:'',
            date_of_joining: '',
            isHostel: false,
            user_code: ['', Validators.required]
        });
        this.studentForm.controls['date_of_birth'].setValue('');
        this.studentForm.controls['date_of_joining'].setValue('');

        this.additionalForm = this.fb.group({
            class_id: ['', [Validators.required]],
            class_name: '',
            section_id: '',
            section_name: '',
            languages: {},
            sameAs: false,
            present_street_address1: [''],
            present_street_address2: [''],
            present_city: ['' ],
            present_state: [''],
            present_pincode: [''],
            street_address1: '',
            street_address2: '',
            city: '',
            state: '',
            pincode:'',
            country: 'India',
            blood_group: '',
            height: '',
            weight: '',
            medical_data: '',
            medical_info: {}
        });

        this.parentForm = this.fb.group({
            father_name: [''],
            mother_name: [''],
            father_qualification: [''],
            mother_qualification: [''],
            primary_contact: true,
            primary_email: true,
            primary_phone: '',
            email: '',
            father_occupation: '',
            mother_occupation: '',
            father_income: '',
            mother_income: '',
            father_phone: [''],
            mother_phone: [''],
            father_email: '',
            mother_email: '',
        },{
                validator: () => {
                    return this.validateForm();
                }
            }
        );

        this.emergencyForm = this.fb.group({
            sameAsFather: false,
            sameAsMother: false,
            additional_contact1_name: [{value:'', disabled: false}, Validators.required],
            additional_contact2_name: '',
            additional_contact1_phone: ['', Validators.required],
            additional_contact2_phone: ['', Validators.required],
            additional_contact1_address: '',
            additional_contact2_address: '',
            additional_contact1_relation: '',
            additional_contact2_relation: '',

        });

        this.attachmentForm = this.fb.group({
            file_srcs: ''
        });

    }

    validateForm() {
        var re = new RegExp("^[0-9]{1,10}$");
        if((this.isFatherPrimary.nativeElement.checked && !this.isFatherName.nativeElement.value) || (this.isMotherPrimary.nativeElement.checked && !this.isMotherName.nativeElement.value)){
            return { valid: false};
        }
        if ((this.isFatherPrimary.nativeElement.checked && this.father_phone.nativeElement.value.length != 10) || (this.isMotherPrimary.nativeElement.checked && this.mother_phone.nativeElement.value.length != 10)) {
            return { valid: false };
        }
        if (!re.test(this.father_phone.nativeElement.value) && (!re.test(this.mother_phone.nativeElement.value))){
            return { valid: false };
        }
        return null;

    }


    samePresent(event: any) {
        if (event.target.checked) {
            this.additionalForm.controls['street_address1'].setValue(this.additionalForm.controls['present_street_address1'].value);
            this.additionalForm.controls['street_address2'].setValue(this.additionalForm.controls['present_street_address2'].value);
            this.additionalForm.controls['city'].setValue(this.additionalForm.controls['present_city'].value);
            this.additionalForm.controls['state'].setValue(this.additionalForm.controls['present_state'].value);
            this.additionalForm.controls['pincode'].setValue(this.additionalForm.controls['present_pincode'].value);
        }
        this.disableAddress(event.target.checked);
    }

    sameFather(event: any) {
        this.copyFather(event.target.checked);
    }

    private copyFather(checkStatus: any) {
        this.disableContact1(checkStatus);
        if (checkStatus) {
            var street1 = (this.additionalForm.controls['present_street_address1'].value == '') || (this.additionalForm.controls['present_street_address1'].value == undefined) ? '' : this.additionalForm.controls['present_street_address1'].value +','+ '\n';
            var street2 =(this.additionalForm.controls['present_street_address2'].value == '') || (this.additionalForm.controls['present_street_address2'].value == undefined) ? '' : this.additionalForm.controls['present_street_address2'].value +',' +'\n';
            var city = (this.additionalForm.controls['present_city'].value == '') || (this.additionalForm.controls['present_city'].value == undefined) ? '' : this.additionalForm.controls['present_city'].value + " ,";
            var state = (this.additionalForm.controls['present_state'].value == '') || (this.additionalForm.controls['present_state'].value == undefined) ? '' : this.additionalForm.controls['present_state'].value + " ,";
            var pincode = (this.additionalForm.controls['present_pincode'].value  == '') || (this.additionalForm.controls['present_pincode'].value  == undefined) ? '' : this.additionalForm.controls['present_state'].value;

            this.emergencyForm.controls['additional_contact1_name'].setValue(this.parentForm.controls['father_name'].value);
            this.emergencyForm.controls['additional_contact1_relation'].setValue('Father');
            var address = street1 + street2 + city + state + pincode;
            this.emergencyForm.controls['additional_contact1_address'].setValue(address);
            this.emergencyForm.controls['additional_contact1_phone'].setValue(this.parentForm.controls['father_phone'].value);
        }
    }

    private disableContact1(checkStatus: boolean) {
        if (checkStatus) {
            this.emergencyForm.controls['additional_contact1_name'].disable();
            this.emergencyForm.controls['additional_contact1_relation'].disable();
            this.emergencyForm.controls['additional_contact1_address'].disable();
            this.emergencyForm.controls['additional_contact1_phone'].disable();
        } else {
            this.emergencyForm.controls['additional_contact1_name'].enable();
            this.emergencyForm.controls['additional_contact1_relation'].enable();
            this.emergencyForm.controls['additional_contact1_address'].enable();
            this.emergencyForm.controls['additional_contact1_phone'].enable();
        }
    }

    sameMother(event: any) {
        this.copyMother(event.target.checked);
    }

    private copyMother(checkStatus: any) {
        this.disableContact2(checkStatus);
        if (checkStatus) {

            var street1 = (this.additionalForm.controls['street_address1'].value == '') || (this.additionalForm.controls['street_address1'].value == undefined) ? '' : this.additionalForm.controls['street_address1'].value +','+ '\n';
            var street2 =(this.additionalForm.controls['street_address2'].value == '') || (this.additionalForm.controls['street_address2'].value == undefined) ? '' : this.additionalForm.controls['street_address2'].value +',' +'\n';
            var city = (this.additionalForm.controls['city'].value == '') || (this.additionalForm.controls['city'].value == undefined) ? '' : this.additionalForm.controls['city'].value + " ,";
            var state = (this.additionalForm.controls['state'].value == '') || (this.additionalForm.controls['state'].value == undefined) ? '' : this.additionalForm.controls['state'].value + " ,";
            var pincode = (this.additionalForm.controls['pincode'].value  == '') || (this.additionalForm.controls['pincode'].value  == undefined) ? '' : this.additionalForm.controls['pincode'].value;

            this.emergencyForm.controls['additional_contact2_name'].setValue(this.parentForm.controls['mother_name'].value);
            this.emergencyForm.controls['additional_contact2_relation'].setValue('Mother');
            var address = street1 + street2 + city + state + pincode;
            this.emergencyForm.controls['additional_contact2_address'].setValue(address);
            this.emergencyForm.controls['additional_contact2_phone'].setValue(this.parentForm.controls['mother_phone'].value);
        }
    }

    private disableContact2(checkStatus: boolean) {
        if (checkStatus) {
            this.emergencyForm.controls['additional_contact2_name'].disable();
            this.emergencyForm.controls['additional_contact2_relation'].disable();
            this.emergencyForm.controls['additional_contact2_address'].disable();
            this.emergencyForm.controls['additional_contact2_phone'].disable();
        } else {
            this.emergencyForm.controls['additional_contact2_name'].enable();
            this.emergencyForm.controls['additional_contact2_relation'].enable();
            this.emergencyForm.controls['additional_contact2_address'].enable();
            this.emergencyForm.controls['additional_contact2_phone'].enable();
        }
    }

    private disableAddress(checkStatus: boolean) {
        if (checkStatus) {
            this.additionalForm.controls['street_address1'].disable();
            this.additionalForm.controls['street_address2'].disable();
            this.additionalForm.controls['city'].disable();
            this.additionalForm.controls['state'].disable();
            this.additionalForm.controls['pincode'].disable();
        } else {
            this.additionalForm.controls['street_address1'].enable();
            this.additionalForm.controls['street_address2'].enable();
            this.additionalForm.controls['city'].enable();
            this.additionalForm.controls['state'].enable();
            this.additionalForm.controls['pincode'].enable();
            this.additionalForm.controls['street_address1'].setValue('');
            this.additionalForm.controls['street_address2'].setValue('')
            this.additionalForm.controls['city'].setValue('');
            this.additionalForm.controls['state'].setValue('');
            this.additionalForm.controls['pincode'].setValue('');

        }

    }

    editForm(form: any) {
        this.studentForm.controls['first_name'].setValue(form.first_name);
        this.studentForm.controls['middle_name'].setValue(form.middle_name);
        this.studentForm.controls['last_name'].setValue(form.last_name);
        this.studentForm.controls['short_name'].setValue(form.short_name);
        this.studentForm.controls['nationality'].setValue(form.nationality);
        this.studentForm.controls['mother_tongue'].setValue(form.mother_tongue);
        this.studentForm.controls['hostel'].setValue(form.isHostel);
        this.studentForm.controls['date_of_birth'].setValue(form.date_of_birth);
        this.studentForm.controls['place_of_birth'].setValue(form.place_of_birth);
        this.studentForm.controls['date_of_joining'].setValue(form.date_of_joining);
        this.studentForm.controls['transport_required'].setValue(form.transport_required);
        this.studentForm.controls['community'].setValue(form.community);
        this.studentForm.controls['user_code'].setValue(form.user_code);

        this.additionalForm.controls['class_id'].setValue(form.class_id);
        this.additionalForm.controls['section_id'].setValue(form.section_id);
        this.additionalForm.controls['languages'].setValue(form.languages);
        this.additionalForm.controls['present_street_address1'].setValue(form.present_street_address1);
        this.additionalForm.controls['present_street_address2'].setValue(form.present_street_address2);

        if (form.present_street_address1 === form.street_address1 &&
            form.present_street_address2 === form.street_address2 &&
            form.present_city === form.city && form.present_state === form.state && form.present_pincode === form.pincode) {

            this.additionalForm.controls['sameAs'].setValue(true);
            this.disableAddress(false);
        }

        this.additionalForm.controls['present_city'].setValue(form.present_city);
        this.additionalForm.controls['present_state'].setValue(form.present_state);
        this.additionalForm.controls['street_address1'].setValue(form.street_address1);
        this.additionalForm.controls['street_address2'].setValue(form.street_address2);
        this.additionalForm.controls['present_pincode'].setValue(form.present_pincode);
        this.additionalForm.controls['city'].setValue(form.city);
        this.additionalForm.controls['state'].setValue(form.state);
        this.additionalForm.controls['pincode'].setValue(form.pincode);
        this.additionalForm.controls['country'].setValue(form.country);
        this.additionalForm.controls['blood_group'].setValue(form.blood_group);
        this.additionalForm.controls['height'].setValue(form.height);
        this.additionalForm.controls['weight'].setValue(form.weight);
        if (form.medical_info != null && form.medical_info.medical_data != null) {
            this.additionalForm.controls['medical_data'].setValue(form.medical_info.medical_data);
        }

        this.parentForm.controls['father_name'].setValue(form.father_name);
        this.parentForm.controls['mother_name'].setValue(form.mother_name);
        this.parentForm.controls['father_qualification'].setValue(form.father_qualification);

        if(!form.father_phone && !form.mother_phone){
            this.parentForm.controls['father_phone'].setValue(form.primary_phone);
            this.parentForm.controls['mother_phone'].setValue(form.mother_phone);
        }else {
            this.parentForm.controls['father_phone'].setValue(form.father_phone);
            this.parentForm.controls['mother_phone'].setValue(form.mother_phone);
        }

        this.parentForm.controls['father_email'].setValue(form.father_email);
        this.parentForm.controls['father_occupation'].setValue(form.father_occupation);
        this.parentForm.controls['father_income'].setValue(form.father_income);
        this.parentForm.controls['mother_qualification'].setValue(form.mother_qualification);
        this.parentForm.controls['mother_occupation'].setValue(form.mother_occupation);
        this.parentForm.controls['mother_income'].setValue(form.mother_income);
        this.parentForm.controls['mother_email'].setValue(form.mother_email);

        if (form.father_phone === form.primary_phone) {
            this.parentForm.controls['primary_contact'].setValue(true);
        } else if (form.mother_phone === form.primary_phone) {
            this.parentForm.controls['primary_contact'].setValue(false);
        }else {
            this.parentForm.controls['primary_contact'].setValue(true);
        }

        if (form.father_email === form.email) {
            this.parentForm.controls['primary_email'].setValue(true);
        } else if (form.mother_email === form.email) {
            this.parentForm.controls['primary_email'].setValue(false);
        }

        this.emergencyForm.controls['additional_contact1_name'].setValue(form.additional_contact1_name);
        this.emergencyForm.controls['additional_contact1_phone'].setValue(form.additional_contact1_phone);
        this.emergencyForm.controls['additional_contact1_address'].setValue(form.additional_contact1_address);
        this.emergencyForm.controls['additional_contact1_relation'].setValue(form.additional_contact1_relation);

        this.emergencyForm.controls['additional_contact2_name'].setValue(form.additional_contact2_name);
        this.emergencyForm.controls['additional_contact2_phone'].setValue(form.additional_contact2_phone);
        this.emergencyForm.controls['additional_contact2_address'].setValue(form.additional_contact2_address);
        this.emergencyForm.controls['additional_contact2_relation'].setValue(form.additional_contact2_relation);

        this.emergencyForm.controls['sameAsFather'].setValue(form.additional_contact1_relation === 'Father');
        this.emergencyForm.controls['sameAsMother'].setValue(form.additional_contact2_relation === 'Mother');
        this.disableContact1(form.additional_contact1_relation === 'Father');
        this.disableContact2(form.additional_contact2_relation === 'Mother');


        if (form.profile_picture) {
            var url = this.baseService.getBaseUrl();
            var image =  url+'/' + form.profile_picture;
            $('#profilePicture').attr('src', image);
        }

    }

    onStudentInfo(event: any) {
        this.studentForm.controls['date_of_birth'].setValue(this.date_of_birth.nativeElement.value ? this.date_of_birth.nativeElement.value + " 23:59:00" : this.date_of_birth.nativeElement.value);
        this.studentForm.controls['date_of_joining'].setValue(this.date_of_joining.nativeElement.value);
        this.studentForm.controls['gender'].setValue(this.baseService.extractOptionValue(this.gender.nativeElement.selectedOptions)[0]);
        var hostelStatus = this.baseService.extractOptionValue(this.hostel.nativeElement.selectedOptions)[0];
        this.studentForm.controls['isHostel'].setValue(hostelStatus === 'boarder');
    }

    onClassInfo(event:any) {
        this.additionalForm.controls['class_id'].setValue(this.baseService.extractOptions(this.class.nativeElement.selectedOptions)[0].id);
        this.additionalForm.controls['class_name'].setValue(this.baseService.extractOptions(this.class.nativeElement.selectedOptions)[0].name);

        this.additionalForm.controls['section_id'].setValue(this.baseService.extractOptions(this.section.nativeElement.selectedOptions)[0].id);
        this.additionalForm.controls['section_name'].setValue(this.baseService.extractOptions(this.section.nativeElement.selectedOptions)[0].name);


        var selectedLanguages = {};
        selectedLanguages[1] = this.baseService.extractOptions(this.lang1.nativeElement.selectedOptions)[0].id;
        selectedLanguages[2] = this.baseService.extractOptions(this.lang2.nativeElement.selectedOptions)[0].id;
        selectedLanguages[3] = this.baseService.extractOptions(this.lang3.nativeElement.selectedOptions)[0].id;
        this.additionalForm.controls['languages'].setValue(selectedLanguages);

        var medical_info = { 'health' :
            JSON.stringify(this.baseService.extractOptionValue(this.health.nativeElement.selectedOptions)),
            medical_data: this.additionalForm.controls['medical_data'].value
        }
        this.additionalForm.controls['medical_info'].setValue(medical_info);
    }

    onParentInfo(event: any) {
        if (this.parentForm.controls['primary_contact'].value) {
            this.parentForm.controls['primary_phone'].setValue(this.parentForm.controls['father_phone'].value);
        } else {
            this.parentForm.controls['primary_phone'].setValue(this.parentForm.controls['mother_phone'].value);
        }

        if (this.parentForm.controls['primary_email'].value) {
            this.parentForm.controls['email'].setValue(this.parentForm.controls['father_email'].value);
        } else {
            this.parentForm.controls['email'].setValue(this.parentForm.controls['mother_email'].value);
        };
        if(this.buttonVal == 'Update'){
            this.baseService.removeChecked('#fatherAddress');
            this.baseService.removeChecked('#motherAddress');
            $('#fatherAddress').click();
            $('#motherAddress').click();
            this.baseService.addChecked('#fatherAddress');
            this.baseService.addChecked('#motherAddress');
            this.validContact();
        }
    };

    validContact(){
        var result = Object.assign({}, this.studentForm._value, this.additionalForm.getRawValue(), this.parentForm._value, this.emergencyForm.getRawValue());
        result.user_name = this.user_name;
        result.primary_phone = (result.father_phone && this.parentForm._value.primary_contact) ? result.father_phone : result.mother_phone;
        result.old_primary_phone = this.old_primary_phone;
        this.ParentLoginObjs =[];
            if(result.old_primary_phone != result.primary_phone){
                this.commonService.put(this.serviceUrls.student + 'member/user/'+ result.user_name, result).then(
                    res => this.validContactCallback(res, false, result),
                    error => this.validContactCallback(error, true, result)
                )
            }
    }

    validContactCallback(res: any, error: boolean, result: any){
        this.ParentLoginObjs = res;
        if(res.message){
            this.baseService.showNotification(res.message, '' ,'bg-danger');
            $('.previousclick').click();
        }
    }


    onEmergencyContact(event: any) {
    }

    onSaveStudent(event: any, btnId: any) {
        var result = Object.assign({}, this.studentForm._value, this.additionalForm.getRawValue(), this.parentForm._value, this.emergencyForm.getRawValue());
        result.user_name = this.user_name;
        var id = this.studentForm._value.id;
        this.baseService.enableBtnLoading(btnId);
        if (!this.user_name) {
            this.commonService.post(this.serviceUrls.student, result).then(
                result => this.saveStudentCallBack(result, id, 'Saved', false, btnId),
                error => this.saveStudentCallBack(<any>error, id, 'Saved', true, btnId))

        } else {
            result.ParentLoginObjs= this.ParentLoginObjs ? this.ParentLoginObjs : [];
            result.old_primary_phone = this.old_primary_phone;
            result.id = this.studentData.id;
            result._id = this.studentObj._id;
            result.primary_phone = (result.father_phone && this.parentForm._value.primary_contact) ? result.father_phone : result.mother_phone;
            this.commonService.put(this.serviceUrls.student + result.user_name, result).then(
                result => this.saveStudentCallBack(result, id, 'Updated', false, btnId),
                error => this.saveStudentCallBack(<any>error, id, 'Updated', true, btnId))
        }
    }

    setValidations():any{
        var dataFound =false;
        if(this.studentForm._value.date_of_birth.length < 1){
            this.baseService.showNotification("Enter Date","",'bg-danger');
        }else{
            dataFound = true;
        }
        return dataFound;
    }

    saveStudentCallBack(result: any, id: any, method: string, error: boolean, btnId: any) {
        this.uploadId = result.id;
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {

            if(this.uploader.getNotUploadedItems().length && this.profile.getNotUploadedItems().length){
                this.uploader.uploadAll();
                this.profile.uploadAll();
            }
            else if(this.uploader.getNotUploadedItems().length) {
                this.uploader.uploadAll();
            } else if(this.profile.getNotUploadedItems().length) {
                this.profile.uploadAll();
            }
            else {
                this.addAttachementsCallback(result, id, error)
            }

            this.uploader.onCompleteAll = () => {
                this.attachmentsForm['id'] = result.id;
                this.attachmentsForm['attachments'] = this.attachments;
                this.attachmentsForm['profile'] = null;
                this.addAttachements(this.attachmentsForm, id);
            }
            this.profile.onCompleteAll = () => {
                this.attachmentsForm['id'] = result.id;
                this.attachmentsForm['attachments'] = null;
                this.attachmentsForm['profile'] = this.profileattachments;
                this.attachmentsForm['userType'] = "student"
                this.addAttachements(this.attachmentsForm, id);
            }
        }
        this.baseService.disableBtnLoading(btnId)
    }


     addAttachements(data: any, id: any) {
        this.commonService.put(this.serviceUrls.userAttachments + data.id, data).then(
            result => this.addAttachementsCallback(result, id, false),
            error => this.addAttachementsCallback(<any>error, id, true))
    }

    addAttachementsCallback(result: any, id:any , err: any) {
        this.attachments.pop();
        this.profileattachments.pop();
        this.baseService.showNotification(result.message, "", 'bg-success');
        this.baseService.enableDivLoading('.datatable-student', this.constants.updating);
        var thisObj = this;
        setTimeout(function () {
            thisObj.baseService.disableDivLoading('.datatable-student');
            thisObj.baseService.dataTableReload('datatable-student');
        }, 1000)
        this.father_phone.nativeElement.value = '';
        this.mother_phone.nativeElement.value = '';
        this.baseService.closeOverlay('#addStudent');
        this.uploader.clearQueue();
        this.profile.clearQueue();
        this.resetForm();
    }

    resetForm(){
        this.createStudentForm();
        this.Student= "";
        this.studentData = "";
        this.date_of_birth.nativeElement.value ='';
        this.date_of_joining.nativeElement.value ='';
        this.ParentLoginObjs = null;
    }

    //Profile picture

    /*public file_srcs: string[] = [];
    public debug_size_before: string[] = [];
    public debug_size_after: string[] = [];
    student_img: '';
    student_profile: '';*/


   /* fileChange(input: any) {
        this.readFiles(input.files);
    }
    readFile(file:any, reader:any, callback:any) {
        reader.onload = () => {
            callback(reader.result);
            this.student_img = reader.result;
            // console.log(reader.result);
        }
        reader.readAsDataURL(file);
    }
    readFiles(files:any, index = 0) {
        // Create the file reader
        let reader = new FileReader();
        // If there is a file
        if (index in files) {
            // Start reading this file
            this.readFile(files[index], reader, (result: any) => {
                // Create an img element and add the image file data to it
                var img = document.createElement("img");
                img.src = result;
                // Send this img to the resize function (and wait for callback)
                this.resize(img, 200, 200, (resized_jpeg: any, before: any, after: any) => {
                    // For debugging (size in bytes before and after)
                    this.debug_size_before.push(before);
                    this.debug_size_after.push(after);
                    // Add the resized jpeg img source to a list for preview
                    // This is also the file you want to upload. (either as a
                    // base64 string or img.src = resized_jpeg if you prefer a file).

                    var image = this.element.nativeElement.querySelector('.image');
                    image.src = resized_jpeg;
                    this.student_profile = resized_jpeg;
                    this.file_srcs.push(resized_jpeg);
                    // Read the next file;
                    this.readFiles(files, index + 1);
                });
            });
        } else {
            // When all files are done This forces a change detection
            // this.changeDetectorRef.detectChanges();
        }
    }
    resize(img: any, MAX_WIDTH: number, MAX_HEIGHT: number, callback: any) {
        // This will wait until the img is loaded before calling this function
        return img.onload = () => {
            // Get the images current width and height
            var width = img.width;
            var height = img.height;
            // Set the WxH to fit the Max values (but maintain proportions)
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            // create a canvas object
            var canvas = document.createElement("canvas");
            // Set the canvas to the new calculated dimensions
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            // Get this encoded as a jpeg
            // IMPORTANT: 'jpeg' NOT 'jpg'
            var dataUrl = canvas.toDataURL('image/jpeg');
            // callback with the results
            callback(dataUrl, img.src.length, dataUrl.length);
        };
    }*/

    viewAttachment() {
        delete this.studentData.id;
        this.studentData['url'] = this.serviceUrls.userAttachments;
        this.studentData['id'] = this.studentData.user_name;
        this.attachmentComponent.openModal(this.studentData, true)
    }

}