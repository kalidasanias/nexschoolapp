/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {BaseService, TransportService} from "../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../common/index";
import {VehicleAllocationComponent} from "../vehicle-allocation.component";
import {DualListComponent} from "../../../../dual-list/dual-list.component";
declare var _ :any;

@Component({
    selector: 'assign-user',
    templateUrl: 'assign-user.html'
})
export class AssignUserComponent implements OnInit {

    @ViewChild('singleClass') singleClass: ElementRef;
    @ViewChild('singleSection') singleSection: ElementRef;
    @ViewChild('selectRoute') selectRoute: ElementRef;
    @ViewChild('selectStop') selectStop: ElementRef;
    @ViewChild('reportingManager') reportingManager: ElementRef;
    @ViewChild('employee') employee: ElementRef;

    alreadySelectedUsers: any[];
    filteredSelectedUsers: any[];
    driver: any;
    vehicle: any;
    routes: any[];
    user:any;
    selectedRoute: any;
    stops: any[];
    classes: any;
    sections: any;
    classId: any;
    sectionId: any;
    users: any[];
    selectedUsers: any[];
    key: string;
    display: string;
    moveDisable: boolean = false;
    searchDisable: boolean = true;
    assignDisable: boolean = true;
    selectedSection: any;
    selecteStop: any;
    stopIndex: any;
    format:any = {  add: '', remove: '', all: '', none: '', direction: DualListComponent.LTR };
    parent: VehicleAllocationComponent;
    allClass: any;
    movedUsers: any;


    constructor(private router: Router,
                private baseService: BaseService,
                private constants: Constants,
                private serviceUrls: ServiceUrls,
                private transportService: TransportService) {

    }

    ngOnInit() {
        this.baseService.enableAppJs();
        this.resetInputs();
        this.key = "user_name";
        this.display = "first_name";
        this.stopIndex = '';
        this.selecteStop = {};
        this.classId = this.selectedSection = null;
    }

    openOverlay(event: any, parent: VehicleAllocationComponent) {
        this.parent = parent;
        this.routes = parent.routes;
        this.allClass = parent.classSections;
        this.baseService.enableSelectWithEmpty('#select-class', this.parent.classSections,[ 'className', 'classId' ], null);
        this.resetInputs();
        this.baseService.openOverlay(event);
    }

    closeOverlay() {
        this.baseService.closeOverlay('#assignUser');
    }

    resetInputs() {
        this.moveDisable = false;
        this.driver = { driver_name: ''};
        this.vehicle = { seating_capacity: ''};
        this.selectedRoute = { reg_no: ''};
        this.users = this.selectedUsers = [];
        this.baseService.enableSelectWithEmpty('#select-route', this.routes, [ 'route_name', 'id' ], null);
        this.baseService.enableSelectWithEmpty('#select-class', this.allClass, [ 'className', 'classId' ], null);
        this.baseService.disableSelect('#select-route', false);
        this.baseService.disableSelect('#select-class', false);
        this.selectedUsers = [];
        this.stopIndex = '';
        this.selecteStop = {};
        this.alreadySelectedUsers = [];
        this.movedUsers = [];
        this.classId = this.selectedSection = null;
        this.baseService.addHideClass('.routeShow');
        this.baseService.addHideClass('.select-section');
    }


    getRouteDetails(event : any) {
        var route = this.selectedRoute = this.routes.find( route => route.id === event.target.value);
        if (!route) {
            this.selectedRoute = { reg_no: ''};
            this.baseService.addHideClass('.routeShow');
            this.isValidToSearch();
            return;
        }

        this.transportService.get(this.serviceUrls.userAssign + 'route/' + route.id)
            .then(vehicleAllocation => this.callBackAllocation(vehicleAllocation));

        this.transportService.get(this.serviceUrls.vehicle+route.reg_no).then(
            vehicle => this.callBackVehicle(vehicle));

        this.transportService.get(this.serviceUrls.driver+route.driver_id).then(
            driver => this.callBack(driver));

        this.baseService.enableSelectWithTipAndEmpty('#select-stop', this.selectedRoute.stops, [ 'location','stop_id' ], null);
        this.selecteStop = {};
        this.stopIndex = '';
        this.isValidToSearch();
    }

    callBackAllocation(vehicleAllocations: any) {
        this.alreadySelectedUsers = vehicleAllocations;
    }

    callBack(driver: any) {
        this.driver = driver;
        this.baseService.removeHideClass('.routeShow');
    }

    callBackVehicle(vehicle: any) {
        this.vehicle = vehicle;
    }

    getStopUsers(event: any) {
        if (event.target.value === '') {
            this.stopIndex = '';
            this.isValidToSearch();
            return;
        }
        this.stopIndex = event.target.value;
        this.selecteStop = this.selectedRoute.stops[event.target.value];
        this.isValidToSearch();
    }

    getSectionByClass(event: any) {
        if (event.target.value === '') {
            this.classId = null;
            this.selectedSection = null;
            this.baseService.addHideClass('.select-section');
            this.isValidToSearch();
            return;
        }
        this.setSectionControl(event.target.value, null);
        this.isValidToSearch();
    }

    setSectionControl(classId: string, selectedSection: string) {
        this.classId = classId;
        var selectedClass = this.parent.classSections.find((obj:any) => obj.classId === classId);
        this.baseService.enableSelectWithEmpty('#select-section', selectedClass.sections,[ 'sectionName', 'sectionId' ], selectedSection);
        this.baseService.removeHideClass('.select-section');
    }

    getSection(event:any) {
        if (event.target.value === '') {
            this.selectedSection = null;
            this.isValidToSearch();
            return;
        }
        this.selectedSection = this.baseService.extractOptionValue(this.singleSection.nativeElement.selectedOptions)[0];
        this.isValidToSearch();
    }

    movingUsers() {
        this.moveDisable = true;
        this.isValidToSearch();
    }

    isValidToSearch() {
        if (this.selectedRoute.reg_no === '') {
            this.searchDisable = true;
            this.assignDisable = true;
            return false;
        }

        if (this.classId === null ) {
            this.searchDisable = true;
            this.assignDisable = true;
            return false;
        }

        if (this.selectedSection === null ) {
            this.searchDisable = true;
            this.assignDisable = true;
            return false;
        }

        if (this.stopIndex === '' ) {
            this.searchDisable = true;
            this.assignDisable = true;
            return false;
        }

        this.searchDisable = false;

        var _this = this;
        this.movedUsers = this.selectedUsers.filter(function(user: any) {
            return !_this.alreadySelectedUsers.find(selectUser => selectUser['user_name'] === user.user_name);
        });

        if (this.selectedUsers.length === 0 || this.vehicle.seating_capacity < this.selectedUsers.length) {
            this.assignDisable = true;
            return false;
        } else {
            this.assignDisable = false;
            return true;
        }


    }

    search() {
        var selectedSection = this.baseService.extractOptionValue(this.singleSection.nativeElement.selectedOptions)[0]
        this.transportService.getAll(this.serviceUrls.studentByClassAndSection + this.classId + '/' + selectedSection
           ).then(users => this.callBackSearch(users));
    }

    callBackSearch(users: any) {
        var _this = this, availableUsers:any = [], selectionUser:any = [], filteredUsers:any = [];
        var selectedStopKey = this.baseService.extractOptionValue(this.selectStop.nativeElement.selectedOptions)[0]
        var selectedStop = this.selectedRoute.stops[selectedStopKey], i = 0;

        if (this.alreadySelectedUsers.length > 0) {
            var usersAlreadySelected = users.filter(function(user: any) {
                var currentUser = _this.alreadySelectedUsers.find(selectUser => selectUser['user_name'] === user.user_name);
                if (currentUser) {
                    var pickLocation = JSON.parse(currentUser.pickup_location).location;
                    return currentUser && pickLocation === selectedStop.location;
                } else {
                    return false;
                }
            });

            var filteredUsers = users.filter(function(user: any) {
                return !_this.alreadySelectedUsers.find(selectUser => selectUser['user_name'] === user.user_name);
            });

            if (usersAlreadySelected) {
                this.selectedUsers = _.uniqWith(this.selectedUsers.concat(usersAlreadySelected),_.isEqual);
                this.users = _.uniqWith(filteredUsers.concat(usersAlreadySelected),_.isEqual);
            } else {
                this.selectedUsers = _.uniqWith(this.selectedUsers.concat(usersAlreadySelected),_.isEqual);
                this.users = filteredUsers;
            }

            this.users = _.uniqWith(this.movedUsers.concat(this.users),_.isEqual);
            this.selectedUsers = _.uniqWith(this.movedUsers.concat(this.selectedUsers),_.isEqual);

        } else {
            this.users = users;
        }
    }

    assignUser() {
        var selectedStopKey = this.baseService.extractOptionValue(this.selectStop.nativeElement.selectedOptions)[0]
        var selectedStop = this.selectedRoute.stops[selectedStopKey];
        var assignUserObjs = [];
        if (this.movedUsers.length === 0 ) {
            this.baseService.showNotification('User Not Selected', '', 'bg-danger');
            return;
        } else {
            for(var i = 0; i < this.movedUsers.length; i++) {
                var assignUserObj = {}; //selectedUser = JSON.parse(this.selectedUsers[i].value);
                var user:any = this.movedUsers[i]; //this.getClassSection(this.selectedUsers[i].user_name);
                assignUserObj['user_code'] = user.user_code;
                assignUserObj['user_name'] = user.user_name;
                assignUserObj['first_name'] = user.first_name;
                assignUserObj['class_id'] = user.classes[0].class_id;
                assignUserObj['class_name'] = user.classes[0].class_name;
                assignUserObj['section_id'] = user.classes[0].section_id;
                assignUserObj['section_name'] = user.classes[0].section_name;
                assignUserObj['route_id'] = this.selectedRoute.id;
                assignUserObj['reg_no'] = this.selectedRoute.reg_no;
                assignUserObj['notify_distance'] = this.selectedRoute.radius;
                assignUserObj['pickup_location_index'] = selectedStopKey;
                assignUserObj['pickup_location'] = selectedStop;
                assignUserObjs.push(assignUserObj);
            }
        }

        var reqObj = {};
        reqObj['route_id'] = this.selectedRoute.id;
        reqObj['reg_no'] = this.selectedRoute.reg_no;
        reqObj['radius'] = selectedStop.radius;
        reqObj['stop'] = selectedStop;
        reqObj['users'] = assignUserObjs;


        this.transportService.saveUserAssign(reqObj).then(
            result => this.saveCallBack('User Assigned Saved Successfully','bg-success'),
            error => this.saveCallBack('User Not Assigned','bg-danger'))
    }

    getClassSection(user_name: string) {
        var user :any = this.users.filter(function (user: any) {
            if (user.user_name === user_name) {
                return user;
            }
        });

        // var user = this.users.filter(userObj => userObj.user_name === user_name);
        return user[0];
    }

    saveCallBack(msg:string, msgIcon:string) {
        this.baseService.showNotification(msg, "", msgIcon);
        if (msgIcon == 'bg-success') {
            this.router.navigate(['/home/allocated']);
            this.resetInputs();
            this.closeOverlay();
            this.baseService.dataTableReload('datatable-student-allocation');
        }
    }

}
