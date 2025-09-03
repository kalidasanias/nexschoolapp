/**
 * Created by senthilPeriyasamy on 12/30/2016.
 */
import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {Title} from "@angular/platform-browser";
import {Constants, Messages, ServiceUrls} from "../../common/index";
import {JwtHelper} from "angular2-jwt";
import {ActivatedRoute, Params, Router} from "@angular/router";
import * as myGlobals from "../../common/constants/global";
import {AbstractControl} from "@angular/forms";

declare function showNotification(title: string, msg : string, type: string): void;
declare function showInformation(position: string, msg : string, type: string): void;
declare function enableLoading(): void;
declare function enableLoadingWithMsg(message: any): void;
declare function enablePopOver(id: any, title: any, content: any, placement: any): void;
declare function enableDivLoading(eleAttr: any, msg: any): void;
declare function disableLoading(): void;
declare function disableDivLoading(eleAttr: any): void;
declare function enableBtnLoading(id: any): void;
declare function addAspects(): void;
declare function disableBtnLoading(id: any): void;
declare function enableDataSourceDatatable(url: any, header: any): void;
declare function enableDataSourceScholar(url: any, header: any): void;
declare function dataTableReload(attibute: any): void;
declare function dataTableDestroy(attibute: any): void;
declare function showWarning(): void;
declare function showInfoWarning(title: any, text: any, type: any): void;
declare function showWarningWithButtonsText(title: any, text:any, cancelText: any, type: any): void;
declare function showError(): void;
declare function enableDataTableExample(): void;
declare function enableAppJs(): void;
declare function getMapFormData(): void;
declare function addInputBox(ele: any, appendEle: any): void;
declare function enableDataTable(url: any, header: any): void;
declare function enableDataTableAddOn(url: any, header: any, data: any): void;
declare function enableDataTableAjax(url: any, body: any, header: any): void;
declare function enablePickerDate(): void;
declare function rportData(data: any): void;
declare function enablePickerDateByElement(elementId: string): void;
declare function enableAutoCompleteAddress(elementId: string, lat: string, lon: string, map:any, placeId: any): void;
declare function enableAutoCompleteAddress2(elementId: string, lat: string, lon: string, map:any, placeId: any, index:number, cb: any): void;
declare function enableLocationPicker(location: any): void;
declare function enableSourceDataTable(id: any, data: any): void;
declare function launchIcp(dataObj: any, confObj: any): void;
declare function payNow(dataObj: any, returnUrl: any): void;
declare function validateAssignee(seat: any) : void;
declare function checkedUserNames() : any[];
declare function getAllRoutes(routes: any[]): void;
declare function enableAutoCompleteSearch(map: any): void;
declare function getWaypoints(): any;
declare function closeFloatingPanel(): void;
declare function openFloatingPanel(): void;
declare function hideFloatingPanel(): void;
declare function requestDirections(map:any, route:any, dragRoute: boolean, alternateRoute: boolean, callback: any): any;
declare function createMarker(map: any, latlng: any, label: any, radius: any, draggable: boolean, markerIcon: any): any;
declare function createPolyline(color: any): any;
declare function initializeLivePolyline(map:any, response:any): void;
declare function createVehilceMarker(map: any, lat: any, lng: any, title: string, label: any): any;
declare function animate(d:any, result:any, map:any): void;
declare function overridePolyline(): void;
declare function HTMLtoPDF(url:any, name: any, headers: any): void
declare function hideColumn(id: any, column: any): void
declare function enableLightGallery(): void
declare function enableMarkUploadDataTable(id: any, columns: any, columnDef: any, data: any): void
declare function unblockRow(row: any): void
declare function enableEcharts(id: any, data: any):void
declare function disableEcharts(id: any): void
declare function enableC3(id: any, data: any): any
declare function disableC3(chart: any): void
declare function getAudioRecorder(): any;
declare function getRecordedAudio(recorder: any, audioId:string, success: any, error: any): void;
declare function initializeAudioControls(): void;
declare function downloadFile(options: any, cb: any): void;


declare var jQuery: any;
declare var selectOption: any;
declare var overlay: any;
declare var calendar: any;
declare var pickerOption: any;
declare var _ :any


@Injectable()
export class  BaseService {
    config: any;
    id: any;
    academicYear: string = '2017-2018';
    cYear: boolean = false;
    constructor (
        public http: Http,
        public serviceUrl: ServiceUrls,
        private jwtHelper: JwtHelper,
        public constants: Constants,
        public router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        public messages: Messages) {
        this.getConfigJSON();
    }

    public getConfigJSON() {
        //noinspection TypeScriptUnresolvedFunction
        this.http.get('../../../config/config.json')
            .map(res => res.json())
            .subscribe(data => this.config = data,
                err => console.log(err),
                () => console.log('Completed'));
    }

    getBaseUrl() {
        var user = this.findUser();
        return this.config.s3BaseUrl + user.school_id
    }

    getBaseUrlWithoutSchool() {
        return this.config.s3BaseUrl
    }

    enableGoogleMapApi(map_key: any) {
        if (this.isGoogleApiLoaded()) {
            return;
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(script);
        var googleMapHost = 'http://maps.googleapis.com/maps/api/js?';
        if (window.location.toString().startsWith('https')) {
            googleMapHost = 'https://maps-api-ssl.google.com/maps/api/js?';
        }
        // script.src = "http://maps.googleapis.com/maps/api/js?v=3&sensor=false&key=AIzaSyBDnvaOtbnt5Eo-YpiMri9NfdsSRMIam_I&libraries=geometry,places&ext=.js&callback=googleMapsReady";
        // script.src = "http://maps.googleapis.com/maps/api/js?v=3&sensor=false&key="+ map_key + "&libraries=geometry,places&ext=.js&callback=googleMapsReady";
        script.src = googleMapHost + "v=3&sensor=false&key="+ map_key + "&libraries=geometry,places&ext=.js&callback=googleMapsReady";
    }

    enableOverrideMapApi() {
        /*if (this.isGoogleApiLoaded()) {
            return;
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(script);
        script.src = "/public/assets/js/pages/google_override.js";*/
        overridePolyline();
    }

    rportData(data: any) {
        rportData(data);
    }

    enableMarkerWithLabelApi() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(script);
        script.src = "/public/assets/js/admin/markerwithlabel.js";
    }

    isGoogleApiLoaded() {
        return window['google'] !== undefined;
    }

    enableAutoCompleteSearch(map: any) {
        enableAutoCompleteSearch(map);
    }

    enableLightGallery() {
        enableLightGallery()
    }

    navigateByUrl(url: any) {
        this.router.navigateByUrl('/home');
        var $this = this;
        setTimeout( function() {
            $this.router.navigateByUrl(url);
        }, 100)
        
    }


    enableAutoCompletePlace(elementId :string, callback: any) {
        jQuery(elementId).addresspicker({
            regionBias: "fr",
            updateCallback: callback
            /*,
             mapOptions: {
             zoom: 10,
             center: new google.maps.LatLng(48.856614, 2.3522219000000177),
             scrollwheel: false,
             mapTypeId: google.maps.MapTypeId.ROADMAP
             },
             elements: {
             map: "#map2"
             }*/
        });
    }

    setAcademicYear(year: any) {
        localStorage.setItem(this.constants.syear, year);
        var cyear = this.findUser().cyear;
        var chekData = _.filter(cyear, {"academicYear": localStorage.getItem(this.constants.syear)});
        if(chekData) {
            this.cYear = (chekData.length > 0) ? chekData[0].isCurrentYear: false;
        }
        localStorage.setItem(this.constants.cyear, (this.cYear).toString());

    }

    getAcademicYear() {
        return localStorage.getItem(this.constants.syear);
    }

    initializeMap(address: string, mapId: string) {
        var myOptions = {
            zoom: 13,
            mapTypeId: window['google'].maps.MapTypeId.ROADMAP
        };
        var map = new window['google'].maps.Map(document.getElementById(mapId), myOptions);
        var geocoder = new window['google'].maps.Geocoder();
        geocoder.geocode({
            'address': address
        }, function (results:any, status: any) {
            map.setCenter(results[0].geometry.location);
        });
        return map;
    }

    createVehilceMarker(map: any, lat: any, lng: any, title: string, label: any) {
        return createVehilceMarker(map, lat, lng, title, label);
    }

    initializeLivePolyline(map:any, response:any) {
        initializeLivePolyline(map, response)
    }

    animate(d:any, result:any, map:any) {
        animate(d, result, map);
    }

    getWaypoints() {
        return getWaypoints();
    }

    waterfallOver(list:any, transObj:any, data:any, callback:any) {
        var nextItemIndex = 0;  //keep track of the index of the next item to be processed
        function report(err:any, result:any) {
            nextItemIndex++;
            // if nextItemIndex equals the number of items in list, then we're done
            if(nextItemIndex === list.length) {
                callback(err, result);
            } else {
                // otherwise, call the iterator on the next item
                transObj(list[nextItemIndex], nextItemIndex, data, report);
            }
        }
        // instead of starting all the iterations, we only start the 1st one
        transObj(list[0], 0, data, report);
    }


    requestDirections(map:any, route:any, dragRoute: boolean, alternateRoute: boolean, callback: any) {
        requestDirections(map, route, dragRoute, alternateRoute, callback);
    }

    closeFloatingPanel() {
        closeFloatingPanel();
    }

    openFloatingPanel() {
        openFloatingPanel();
    }

    showStopIcon() {
        if (jQuery('#createStop').hasClass('hide')) {
            this.removeHideClass('#createStop');
        }
    }

    hideStopIcon() {
        if (!jQuery('#createStop').hasClass('hide')) {
            this.addHideClass('#createStop');
        }
    }

    adjustStopIcon() {
        if (!jQuery('#createStop').hasClass('createStopAlone')) {
            jQuery('#createStop').addClass('createStopAlone');
        }
    }

    dontAdjustStopIcon() {
        if (jQuery('#createStop').hasClass('createStopAlone')) {
            jQuery('#createStop').removeClass('createStopAlone');
        }
    }

    /*hideStopIcon() {
        if (!jQuery('#createStop').hasClass('hide')) {
            this.addHideClass('#createStop');
        }
    }*/

    showRoutes() {
        if (jQuery('#routeOptions').hasClass('hide')) {
            this.removeHideClass('#routeOptions');
        }
    }

    hideRoutes() {
        if (!jQuery('#routeOptions').hasClass('hide')) {
            this.addHideClass('#routeOptions');
        }
    }

    hideFloatingRoutes() {
        if (!jQuery('#floating-panel-route').hasClass('hide')) {
            this.addHideClass('#floating-panel-route');
        }
    }

    showFloatingRoutes() {
        if (jQuery('#floating-panel-route').hasClass('hide')) {
            this.removeHideClass('#floating-panel-route');
        }
    }

    hideFloatingPanel() {
        hideFloatingPanel();
    }

    createMarker(map: any, latlng: any, label: any, radius: any, draggable: boolean, markerIcon: any) {
        return createMarker(map, latlng, label, radius, draggable, markerIcon);
    }

    createPolyline(color: any) {
        return createPolyline(color);
    }

    enableAppJs () {
        enableAppJs()
    }

    enableDataTableExample() {
        enableDataTableExample();
    }

    enableDataTable(url: any) {
        enableDataTable(url, this.getHeaderContent());
    }

    enableDataTableAjax(url: any, body: any) {
        enableDataTableAjax(url, body, this.getHeaderContent());
    }

    enableSelect(ele: any, data: any, obj: any, selected: any) {
        selectOption.enableSelect(ele, data, obj, selected);
    }

    enableSelectWithLabel(ele: any, data: any, obj: any, label: any, selected: any) {
        selectOption.enableSelectWithLabel(ele, data, obj, label, selected);
    }

    enableMultiSelectAllWithLabel(ele: any, data: any, obj: any, label: any, selected: any) {
        selectOption.enableMultiSelectAllWithLabel(ele, data, obj, label, selected);
    }

    enableSelectBoxIt(ele: any, data: any, obj: any, selected: any) {
        selectOption.enableSelectBoxIt(ele, data, obj, selected);
    }

    enableSelectWithEmpty(ele: any, data: any, obj: any, selected: any) {
        selectOption.enableSelectWithEmpty(ele, data, obj, selected);
    }

    enableSelectWithTipAndEmpty(ele: any, data: any, obj: any, selected: any) {
        selectOption.enableSelectWithTipAndEmpty(ele, data, obj, selected);
    }

    enableSelect2WithEmpty(ele: any, data: any, obj: any, selected: any) {
        selectOption.enableSelect2WithEmpty(ele, data, obj, selected);
    }

    getMapFormData() {
        return getMapFormData();
    }

    unblockRow(row: any) {
        unblockRow(row);
    }

    enableMultiSelect(ele: any, data: any[], obj: any, selected: any[]) {
        selectOption.enableMultiSelect(ele, data, obj, selected);
    }

    enableMultiSelectDefaultAll(ele: any, data: any[], obj: any, selected: any[]) {
        selectOption.enableMultiSelectDefaultAll(ele, data, obj, selected);
    }

    enableMultiSelectFilteringAll(ele: any, data: any[], obj: any, selected: any[]) {
        selectOption.enableMultiSelectFilteringAll(ele, data, obj, selected);
    }

    enableMultiSelectAll(ele: any, data: any[], obj: any, selected: any[]) {
        selectOption.enableMultiSelectAll(ele, data, obj, selected)
    }

    enableMultiStudent(ele: any, data: any[], obj: any, selected: any[]) {
        selectOption.enableSearchSelectForStudent(ele, data, obj, selected)
    }

    enableSlide(ele: any) {
        selectOption.slideUp(ele)
    }

    selectStyle() {
        selectOption.selectStyle();
    }

    enableSelectWithDisabled(ele: any, data: any, obj: any, selected: any, status: any) {
        selectOption.enableSelectWithDisabled(ele, data, obj, selected, status)
    }

    enableSingleSelWithDisabled(ele: any, data: any, obj: any, selected: any, status: any) {
        selectOption.enableSingleSelWithDisabled(ele, data, obj, selected, status)
    }

    enablePickerDate() {
        enablePickerDate();
    }

    enablePickerDateByElement(elementId: string) {
        enablePickerDateByElement(elementId);
    }

    enableAutoCompleteAddress(elementId: string, lat: string, lon: string, map: any, placeId: any) {
        enableAutoCompleteAddress(elementId, lat, lon, map, placeId);
    }

    enableAutoCompleteAddress2(elementId: string, lat: string, lon: string, map: any, placeId: any, index: number, cb: any) {
        enableAutoCompleteAddress2(elementId, lat, lon, map, placeId, index, cb);
    }

    enableMarkUploadDataTable(id: any, column: any, columnDef: any, data: any) {
        enableMarkUploadDataTable(id, column, columnDef, data)
    }

    enableLocationPicker(location: any) {
        enableLocationPicker(location);
    }

    enableSourceDataTable(id: any, data: any) {
        enableSourceDataTable(id, data)
    }


    validateAssignee(seat: any) {
        validateAssignee(seat);
    }

    checkedUserNames() {
        return checkedUserNames();
    }

    getAllRoutes(routes: any[]) {
        return getAllRoutes(routes);
    }

    findUser(): any {
	    var id_token = localStorage.getItem('id_token');
	    try {
	        if (id_token != null) return this.jwtHelper.decodeToken(id_token);
	        else return null;
	    }catch (e) {
	        this.router.navigate(['/login'])
	    }
	}


    showNotification(title: string, msg : string, addclass: string) {
        showNotification(title, msg, addclass);
    }

    showInformation(position: string, msg : string, addclass: string) {
        showInformation(position, msg, addclass);
    }

    showWarning() {
        showWarning();
    }

    showInfoWarning(title: any, text: any, type: any) {
        showInfoWarning(title, text, type);
    }

    showWarningWithButtonsText(title: any, text: any, cancelText: any, type: any){
        showWarningWithButtonsText(title, text, cancelText, type)
    }

    payNow(dataObj: any, returnUrl: any) {
        payNow(dataObj, returnUrl);
    }

    showError() {
        showError();
    }

    enableLoading() {
        enableLoading();
    }

    enableLoadingWithMsg(message: any) {
        enableLoadingWithMsg(message);
    }

    enableDivLoading(eleAttr: any, msg: any) {
        enableDivLoading(eleAttr, msg);
    }

    disableLoading() {
        disableLoading();
    }

    disableDivLoading(eleAttr: any) {
        disableDivLoading(eleAttr)
    }

    enableBtnLoading(id: any) {
        enableBtnLoading(id);
    }

    disableBtnLoading(id: any) {
        disableBtnLoading(id);
    }

    enableEcharts(id: any, data: any) {
        enableEcharts(id, data)
    }

    disableEcharts(id: any) {
        disableEcharts(id)
    }

    disableC3(chart: any) {
        disableC3(chart)
    }

    enableC3(id: any, data: any) {
        enableC3(id, data)
    }

    addAspects() {
        addAspects();
    }

    enableDataSourceDatatable(url: any) {
        enableDataSourceDatatable(url, this.getHeaderContent());
    }

    enableDataSourceScholar(url: any) {
        enableDataSourceScholar(url, this.getHeaderContent());
    }

    dataTableReload(attibute: any) {
        dataTableReload(attibute);
    }

    dataTableDestroy(attibute: any) {
        dataTableDestroy(attibute);
    }

    getHeaderContentForUploader(){
        var userInfo = this.findUser() || {} ;
        var headers = [];
        headers.push({name: 'Accept', value: 'application/json'});
        headers.push({name: 'session-id', value: userInfo.session_id || ''});
        headers.push({name: 'academicyear', value: localStorage.getItem(this.constants.syear)});
        if(this.id != 'undefined' && this.id != null)
        headers.push({name: 'id', value: this.id});
        return headers;
    }

    buildFormDataForUpload(data: any, form: any) {
        for ( var prop in data ) {
            form.append(prop, data[prop]);
        }
        return form;
    }

    getHeaderContent(){
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.id = params['fi'];
        });
        var userInfo = this.findUser() || {} ;
        return {Accept: 'application/json', 'Content-Type': 'application/json', 'session-id': userInfo.session_id || '', id: this.id, academicYear:  localStorage.getItem(this.constants.syear)}
    }

    getHeader(){
        let headers = new Headers(this.getHeaderContent())
        let options = new RequestOptions({ headers: headers });
        return options;
    }

    getHeaderWithBody(value: any){
        let headers = new Headers(this.getHeaderContent())
        let options = new RequestOptions({ headers: headers, body: value });
            return options;
    }

    getBody(value: any) {
        let options = new RequestOptions({ body: value });
        return options;
    }

    closeModal(id: any) {
        jQuery('#'+ id).modal('hide');
    }

    openModal(id: any) {
        jQuery('#' + id).modal('show');
    }

    openModalByClass(id: any, cls: any) {
        jQuery('#' + id).find('.'+ cls).modal('show');
    }

    removeDisabled(id: any) {
        jQuery(id).prop("disabled", false)
    }

    addDisabled(id: any) {
        jQuery(id).prop("disabled", true)
    }

    addChecked(id: any) {
        jQuery(id).prop("checked", true);
    }

    addRadioChecked(id: any) {
        jQuery(id).parent('span').addClass('checked');
    }

    removeRadioChecked(id: any) {
        jQuery(id).parent('span').removeClass('checked');
    }

    removeChecked(id: any) {
        jQuery(id).prop("checked", false)
    }

    removeHideClass(id: any) {
        jQuery(id).removeClass("hide")
    }

    addCss(id: any, css: any) {
        jQuery(id).css(css);
    }

    addClass(id: any, className: any) {
        jQuery(id).addClass(className);
    }

    removeClass(id: any, className: any) {
        jQuery(id).removeClass(className);
    }

    removeId(id: any) {
        jQuery(id).removeAttr("ng-reflect-id")
        jQuery(id).removeAttr("id")
    }

    addHideClass(id: any) {
        jQuery(id).addClass("hide")
    }


    setTitle( newTitle: string) {
        this.titleService.setTitle( newTitle );
    }

    launchIcp(dataObj: any, confObj: any) {
        launchIcp(dataObj, confObj);
    }

    extractOptions(arr: any[]): any[] {
        let options: any[] = [];
        for(let i=0; i< arr.length; i++) {
            options.push({"id" : arr[i].value, "name": arr[i].label })
        }

        return options;
    }

    extractOptionValue(arr: any[]): any[] {
        let options: any[] = [];
        for(let i=0; i< arr.length; i++) {
            options.push(arr[i].value)
        }
        return options;
    }

    openOverlay(event: any) {
        overlay.openOverlay(event)
    }

    closeOverlay(id: any) {
        overlay.closeOverlay(id)
    }

    navSelect() {
        selectOption.navSelect();
    }

    enableFullCalendar(data: any, view: any) {
        calendar.enableFullCalendar(data, view);
    }

    calendarRefresh(data: any) {
        calendar.calendarRefresh(data)
    }

    showEventPopup(start: any, end: any, data: any) {
        calendar.showEventPopup(start, end, data)
    }

    renderEvent(event: any) {
        calendar.renderEvent(event)
    }

    removeEvent(eventId: any) {
        calendar.removeEvent(eventId)
    }

    updateEvent(event: any) {
        calendar.updateEvent(event)
    }

    extractTableData(arr: any[]): any[] {
        let options: any[] = [];
        for(let i=0; i< arr.length; i++) {
            var options1: any[] = arr[i].children;
            for (let j=0; j< options1.length; j++) {
                var options2: any[] = options1[j].children;
                var percent ="";
                if(options2.length > 0) {
                    var childOption : any[] = options2[0].value;
                    for (let k=0 ; k < options2.length; k++ ){
                        var options3: any[] = options2[k].children;
                        if(options3.length > 0) {
                            childOption = options1[j- 1].children[0].value;
                            percent = options3[0].children[0].value;
                        }
                    }
                }
            }
            options.push({"id" : options1[0].textContent, "name": options1[1].textContent, "amount" : childOption , "percent": percent})
        }

        return options;
    }

    extractTimetableData(arr: any[]): any[] {
        let options: any[] = [];
        for(let i=0; i< arr.length; i++) {
            var children: any[] = arr[i].children;
            var period = {};
            period['periodId'] = children[0].children[0].selectedOptions[0].value;

            period['periodName'] = children[0].children[0].selectedOptions[0].label;
            period['periodStartTime'] = children[1].children[0].children[0].children[1].children[0].value;
            period['periodEndTime'] = children[2].children[0].children[0].children[1].children[0].value;
            period['periodHours'] = children[1].children[0].children[0].children[1].children[0].value + ' - ' + children[2].children[0].children[0].children[1].children[0].value;
            period['break'] = children[3].children[0].checked;
            options.push(period);
        }
        return options;
    }

    extractTimetableCheckbox(arr: any[]): any[] {

        let options: any[] = [];
        for(let i=0; i< arr.length; i++) {
            var children: any[] = arr[i].children;
            var period = {};
            period['periodId'] = children[0].children[0].selectedOptions[0].value;
            period['periodHours'] = children[1].children[0].children[1].value + ' - ' + children[2].children[0].children[1].value;
            period['break'] = children[3].children[0].checked;
            options.push(period);
        }
        return options;
    }

    extractAmount(arr: any[]): any {
        let amount: any = 0;
        for(let i=0; i< arr.length; i++) {
            var options1: any[] = arr[i].children;
            for (let j=0; j< options1.length; j++) {
                var options2: any[] = options1[j].children;
                if(options2.length > 0 && options2[0].value != undefined) {
                    amount = amount + Number(options2[0].value);
                }
            }
        }
        return amount;
    }

    addInputBox(ele: any, appendEle: any){
        addInputBox(ele, appendEle);
    }

    JsonToArray(data: any, obj: any[]) : any[] {
        var arr: any[] =[];
        var value = obj[1];
        if(data != undefined) {
            data.forEach(function (node:any) {
                arr.push(node[value])
            });
        }
        return arr;
    }

    checkValueInData(data: any[], obj: any, key: any): any {
        var arr: any ;
        data.forEach(function (node:any) {
            if(node[key] == obj) {
                arr = node
            }
        });
        return arr;
    }

    handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || body.data.message;
            errMsg = `${err || 'Contact Admin'}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Promise.reject(errMsg);
    }

    handleErr (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || body.data.message;
            errMsg = `${err || 'Contact Admin'}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return errMsg;
    }

    extractData(res: Response) {
        let body = res.json();
        if(body != null && body != 'undefined') {
            if(body.validSession != null && body.validSession != 'undefined' && !body.validSession) {
                jQuery('#logoutId').click()
            }
        }
        return body.data || { };
    }

    enableTimePicker(ele: any, val: any) {
        pickerOption.enableTimePicker(ele, val);
    }

    removeBackgroundImage() {
        jQuery("body").removeClass("nsa-backgroud-image");
    }

    addBackgroundImage() {
        jQuery("body").addClass("nsa-backgroud-image");
    }

    triggerClick(id: any) {
        jQuery(id).trigger('click');
    }

    destroyDatatable(id: any) {
        jQuery(id).DataTable().destroy();
    }

    checkUserCanEdit(): boolean {
        var arr = ['Employee', 'SchoolAdmin']

        return this.hasAnyRole(arr);
    }


    hasAnyRole(roles: any): boolean {
        var user = this.findUser();
        var role = user.roles;
        var rolesSet = new Set(roles);

        for ( var prop in role ) {
            if(rolesSet.has(role[prop])) {
                return true;
            }
        }

        return true;
    }

    arrayTOString(array: any): string {
        return array.join(", ");
    }

    extractAttachment(response: any): any {
        var rawData = JSON.parse(response).files[0];
        return {bucket: rawData.bucket, key: rawData.key, name: rawData.originalname, size: rawData.size, id: rawData.key, mimetype: rawData.mimetype, originalname: rawData.originalname}
    }

    extractMobiAttachment(response: any): any {
        var rawData = JSON.parse(response);
        return rawData['data'].audio_id;
    }

    extractVideoAttachment(response: any): any {
        var rawData = JSON.parse(response);
        if(rawData.success) {
            rawData = rawData.data;
            var uri = rawData.uri
            var id = uri.substring(uri.lastIndexOf("/") + 1);
            return {bucket: 'Vimeo', key: id, name: rawData.originalname, size: rawData.size, id: id, mimetype: 'video/mp4', originalname: rawData.originalname}
        }
    }

    removeCylicObj(obj: any) {
        var seen: any[] = [];
        var json = JSON.stringify(obj, function(key, val) {
            if (typeof val == "object") {
                if (seen.indexOf(val) >= 0)
                    return
                seen.push(val)
            }
            return val
        })

        return JSON.parse(json);
    }

    navigateByRouterPath(path: any) {
        this.router.navigate([path]);
    }

    HTMLtoPDF(url: any, name: any) {
        HTMLtoPDF(url, name, this.getHeaderContent());
    }

    checkRoleToResetPwd(): boolean {
        return this.hasAnyRole(myGlobals.ASA_USER)
    }

    checkRole(role: any): boolean {
        return this.hasAnyRole(role)
    }

    hideColumn(id: any, column: any) {
        hideColumn(id, column)
    }

    enablePopOver(id: any, titile: any, content: any, placement: any) {
        enablePopOver(id, titile, content, placement)
    }

    isEmptyObject(obj: any) {
        return (Object.keys(obj).length === 0);
    }

    dateFormat(date: string) {
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var newDate = new Date(date);
        return newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ', ' + newDate.getFullYear();

    }

    formatTime12(date_obj: Date) {
        // formats a javascript Date object into a 12h AM/PM time string
        var hour :number = date_obj.getHours();
        var minute: number = date_obj.getMinutes(), strMinute;
        var amPM = (hour > 11) ? "pm" : "am";
        if(hour > 12) {
            hour -= 12;
        } else if(hour == 0) {
            hour = 12;
        }
        if(minute < 10) {
            strMinute = "0" + minute;
        }
        return hour + ":" + minute + amPM;
    }

    havePermissionsToEdit(permissions: any) {
        var check = false;
        var checkCur = localStorage.getItem(this.constants.cyear);
        if(permissions != null && (checkCur == 'true')) {
            var permissions = this.getPermissions(permissions);
            var m = _.includes(permissions, this.constants.MANAGE);
            var v = _.includes(permissions, this.constants.MANAGE_ALL);

            if(m || v) {
                check = true
            }
        }

        return check;
    };

    havePermissionsToEditPromotions(permissions: any) {
        var check = false;
        if(permissions != null) {
            var permissions = this.getPermissions(permissions);
            var m = _.includes(permissions, this.constants.MANAGE);
            var v = _.includes(permissions, this.constants.MANAGE_ALL);

            if(m || v) {
                check = true
            }
        }

        return check;
    }

    getPermissions(permissions: any): any {
        var array = [];
        var userPermissions = this.findUser().permissions;
        var permissions = _.intersection(userPermissions, permissions);
        for ( var prop in permissions ) {
            var arr = permissions[prop].split('_');
            var userpermission = arr[arr.length - 1];
            array.push(userpermission)
        }

        return array;
    }

    getObject(objs: any, keyObj: any) {
        return _.find(objs, keyObj);
    }

    getObjectValues(objs: any, key: any) {
        return _.map(objs, key);
    }

    showUploadNotification(item: any, filter: any, options: any) {
        var name = filter.name
        if(name == 'mimeType') {
            var allowedType = options.allowedMimeType.toString();
            this.showNotification('File Selection Error', 'Choosen File ' + item.name + ' type '+ item.type +' is not of type ' + allowedType, 'bg-danger')
        } else if(name == 'fileSize') {
            var expetcedSize = this.formatBytes(options.maxFileSize)
            var actualSize = this.formatBytes(item.size)
            this.showNotification('File Selection Error', 'File ' + item.name + ' Size '+ actualSize +' Exceeds Maximum Allowed Size ' + expetcedSize, 'bg-danger')
        }

    }

    showUploadFileNotification(item: any, filter: any, options: any) {
        var name = filter.name;
        if(name == 'mimeType') {
            this.showNotification('File Selection Error', 'Choosen File ' + item.name + ' type '+ item.type +' is not of type ' + this.constants.allowFiles, 'bg-danger')
        } else if(name == 'fileSize') {
            var expetcedSize = this.formatBytes(options.maxFileSize)
            var actualSize = this.formatBytes(item.size)
            this.showNotification('File Selection Error', 'File ' + item.name + ' Size '+ actualSize +' Exceeds Maximum Allowed Size ' + expetcedSize, 'bg-danger')
        }

    }

    formatBytes(bytes: any) {
        if(bytes < 1024) return bytes + " Bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KB";
        else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MB";
        else return(bytes / 1073741824).toFixed(3) + " GB";
    }

    isContainsKey(objs: any, key: any) {
        return _.includes(objs, key);
    }

    getAudioRecorder() {
        return getAudioRecorder();
    }

    disableSelect(ele: any, status: boolean) {
        return selectOption.disableSelect(ele, status);
    }

    getRecordedAudio(recorder: any, audioId: string, success: any, error: any) {
        getRecordedAudio(recorder, audioId, success, error);
    }

    initializeAudioControls() {
        initializeAudioControls();
    }

    downloadFile(options: any, cb: any) {
        downloadFile(options, cb)
    }

    numberOnly(e:any, OnlyNumber: any){
        if (OnlyNumber) {
            if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                    // Allow: Ctrl+A
                (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
                    // Allow: Ctrl+C
                (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
                    // Allow: Ctrl+V
                (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
                    // Allow: Ctrl+X
                (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
                    // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        }
    }

    clearText(selector: any){
        jQuery(selector).val('');
    }

    capitalizeFirstLetter(value: any) {
        var pieces = value.split(" ");
        for ( var i = 0; i < pieces.length; i++ )
        {
            var j = pieces[i].charAt(0).toUpperCase();
            pieces[i] = j + pieces[i].substr(1).toLowerCase();
        }
            return pieces.join(" ");
    }

    closePopover(id: any){
        jQuery('#' + id).popover('hide');
    }

    isCurrentYear() {
        return localStorage.getItem(this.constants.cyear) === "true" ? true : false
    }

}
