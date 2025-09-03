/**
 * Created by bharatkumarr on 25/04/17.
 */

import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService, TransportService } from '../../../../../services/index';
import { Constants, ServiceUrls } from '../../../../../common/index';
import forEach = require("core-js/library/fn/array/for-each");
import {WizardComponent} from "../../../../wizard/wizard.component";
declare var jQuery: any;


@Component({
    selector: 'add-route',
    templateUrl: 'add-route.html'
})


export class AddRouteComponent implements OnInit {

    @ViewChild(WizardComponent) wizardComponent: WizardComponent;
    @ViewChild('driver') driver: ElementRef;
    @ViewChild('vehicle') vehicle: ElementRef;
    @ViewChild('orgin') orgin: ElementRef;
    @ViewChild('destination') destination: ElementRef;
    @ViewChild('fromLat') fromLat: ElementRef;
    @ViewChild('fromLng') fromLng: ElementRef;
    @ViewChild('toLat') toLat: ElementRef;
    @ViewChild('toLng') toLng: ElementRef;
    updatedStops: boolean;
    basicInfo: any;
    locationInfo: any;
    directionInfo: any;
    conductorInfo: any;
    route: any;
    modalId: any;
    buttonVal: string;
    modalTitle: string;
    parent: any;
    googleMap: any;
    drivers: any[];
    vehicles: any[];
    directionsRenderer: any;
    markers: any[];
    directionInfoValid: boolean;
    charsLeft: any = 160;

    constructor(private baseService: BaseService, private fb: FormBuilder,
                private transportService: TransportService, /*private googleAPI: GoogleAPI,*/
                private serviceUrls: ServiceUrls, private constants: Constants) {
    }

    ngOnInit() {
        this.route= null;
        this.googleMap = null;
        this.directionsRenderer = null;
        this.markers = [];
        this.updatedStops = false;
        this.createRouteForm();
        this.directionInfoValid = false;
    }

    openOverlay(event:any, bVal:string, title: string, id: string, parent:any) {
        this.wizardComponent.reset();
        this.buttonVal = bVal;
        this.modalTitle = title;
        this.parent = parent;
        this.basicInfo.controls['googleMap'].setValue('loaded');
        this.basicInfo.city = parent.city;

        if (this.drivers.length > 0 && this.vehicles.length > 0) {
            this.baseService.openOverlay(event);
        } else {
            this.baseService.showNotification('No Driver or Vehicle Created', '', 'bg-danger');
        }
        if (bVal == 'Update') {
            this.transportService.get(this.serviceUrls.route+id)
                .then(route => this.callBack(route));
        } else {
            if (bVal == 'Save') this.resetForm();
            this.markers = [];
        }
        if (this.parent.googleApiLoaded) {
            this.basicInfo.controls['googleMap'].setValue('loaded');
        }
        this.updatedStops = false;
        this.markers = [];
    }

    keyDown() {
        setTimeout(() => {
            this.changed()
        }, 50);
    }

    changed() {
        this.charsLeft = 160 - this.basicInfo._value.route_desc.length;
    }

    callBack(currRoute: any) {
        this.route = currRoute;
        this.editForm(currRoute);
    }

    updateDriver(event:any) {
        var driver = this.baseService.extractOptionValue(this.driver.nativeElement.selectedOptions)[0];
        this.basicInfo.controls['driver_id'].setValue(driver);
    }

    updateVehicle(event:any) {
        var vehicle = this.baseService.extractOptionValue(this.vehicle.nativeElement.selectedOptions)[0];
        this.basicInfo.controls['reg_no'].setValue(vehicle);
    }

    plotMapRoute(route: any) {
        var routeData = {}, _self = this;
        if (this.route === null) {
            routeData = {
                from_lat: this.fromLat.nativeElement.value,
                from_lng: this.fromLng.nativeElement.value,
                to_lat: this.toLat.nativeElement.value,
                to_lng: this.toLng.nativeElement.value
            }
        } else {
            routeData = this.route;
        }
        this.baseService.requestDirections(this.googleMap, routeData, true, true, this.callbackDirectionsRenderer.bind(this));
        this.baseService.closeFloatingPanel();
        this.baseService.showStopIcon();
        this.baseService.adjustStopIcon();
        this.baseService.showRoutes();
    }

    createStop() {
        var latlng = new window['google'].maps.LatLng(parseFloat(this.fromLat.nativeElement.value)+0.01,
            parseFloat(this.fromLng.nativeElement.value)+0.01);

        var radius = parseInt(this.directionInfo.controls['radius'].value);
        this.createStopByLatlng(latlng, true, radius);
    }

    createStopByLatlng(latlng: any, draggable: boolean, radius: number) {
        var pinSvg = 'M902 1185l283 -282q15 -15 15 -36t-14.5 -35.5t-35.5 -14.5t-35 15l-36 35l-279 -267v-300l-212 210l-308 -307l-280 -203l203 280l307 308l-210 212h300l267 279l-35 36q-15 14 -15 35t14.5 35.5t35.5 14.5t35 -15z';
        // var icon =  { path: window['google'].maps.SymbolPath.CIRCLE, scale: 10};
        // #1E88E5
        var icon = {
            path: pinSvg,
            scale: 0.025,
            strokeColor: 'back',
            strokeWeight: .10,
            fillOpacity: 1,
            fillColor: '#1E88E5',
            rotation: 240
        }
        //            offset: '5%',


        // var icon =  { path: pinCode, scale: 10};
        var marker = this.baseService.createMarker(this.googleMap, latlng, this.markers.length+1+'', radius,
            draggable, icon);
        this.markers.push(marker);
    }

    onBasicNext(event: any) {
        if (this.parent.googleApiLoaded && this.googleMap === null) {
            this.basicInfo.controls['googleMap'].setValue('loaded');
            this.googleMap = this.baseService.initializeMap(this.parent.schoolDetails.city, "routeMap");
        }
        this.baseService.enableAutoCompleteSearch(this.googleMap);

        if (this.buttonVal == 'Update') {
            this.editRoute(this.route);
        } else {
            var i = this.directionInfo.controls['stops'].length - 1;
            var lat_way: any = 'lat_way' + i;
            var lng_way: any = 'lng_way' + i;
            this.baseService.enableAutoCompleteAddress2('way' + i, lat_way, lng_way, this.googleMap, 'way_place' + i, i, this.stopChange.bind(this));
        }

    }

    editRoute(form: any) {
        this.directionInfo = this.fb.group({
            'orgin': [form.orgin, Validators.required],
            'from_lat': form.from_lat,
            'from_lng': form.from_lng,
            'destination': [form.destination, Validators.required],
            'to_lat': form.to_lat,
            'to_lng': form.to_lng,
            'overview_path': form.overview_path,
            'stops':this.fb.array([
            ])
        });
        this.setEditWaypoint(form.stops);
    }

    enableAutoAddress(i: number, self: any) {
        setTimeout(function(){
            var lat_way: any = 'lat_way' + i;
            var lng_way: any = 'lng_way' + i;
            self.baseService.enableAutoCompleteAddress2('way'+i, lat_way, lng_way, self.googleMap, 'way_place'+i, i, self.stopChange.bind(this));
        }, 500);
    }

    onRouteReady(directionsRenderer: any) {
        this.directionsRenderer = directionsRenderer;
        /*if (!this.updatedStops && this.route && this.route.id && this.route.stops && this.route.stops.length > 0) {
         this.updatedStops = true;
         for (var ind=0; ind < this.route.stops.length; ind++) {
         var stop = this.route.stops[ind];
         this.createStopByLatlng(new window['google'].maps.LatLng(stop.lat, stop.lng), true, stop.radius);
         }
         }*/
        this.callbackDirectionsRenderer(directionsRenderer);
    }

    getStopAddress(event: any, i:number) {
        var lat = jQuery('#lat_way'+i).val(),
            lng = jQuery('#lng_way'+i).val(), self = this;
        var latlng = new window['google'].maps.LatLng(lat, lng);
        new window['google'].maps.Geocoder().geocode({'latLng': latlng }, function(results: any, status: any) {
            if (status ==  window['google'].maps.GeocoderStatus.OK) {
                if (results[0]) {
                    jQuery('#way_place'+i).val(results[0].place_id);
                    jQuery('#way'+i).val(results[0].formatted_address);
                    self.directionInfo.controls.stops.controls[i].controls.place_id.setValue(results[0].place_id);
                    self.directionInfo.controls.stops.controls[i].controls.location.setValue(results[0].formatted_address);
                    self.directionInfoValid = true;
                }
            }
        });
    }

    onDirectionNext(event: any) {
        for (var i=0; i<this.markers.length; i++) {
            this.markers[i]._myCircle.setMap(null);
            this.markers[i].setMap(null);
        }
        this.markers = [];
        var self = this;
        setTimeout(function () {
            var z = self.googleMap.getZoom(),
                c = self.googleMap.getCenter();
            window['google'].maps.event.trigger(self.googleMap, 'resize');
            self.googleMap.setZoom(z);
            self.googleMap.setCenter(c);
            var renderRoute = self.renderRoute.bind(self);
            renderRoute();

        }, 500);


    }

    renderRoute() {
        var route = {};
        route['from_lat'] = this.fromLat.nativeElement.value;
        route['from_lng'] = this.fromLng.nativeElement.value;
        route['to_lat'] = this.toLat.nativeElement.value;
        route['to_lng'] = this.toLng.nativeElement.value;
        route['waypoints'] = [];
        var waystops = this.directionInfo.controls['stops'].value;
        for (var i=0; i<waystops.length; i++) {
            var place_id = waystops[i].place_id,
                lat = waystops[i].lat,
                lng = waystops[i].lng,
                radius = waystops[i].radius;

            if (place_id !== '') {
                route['waypoints'].push(place_id);
                var latlng = new window['google'].maps.LatLng(lat, lng);
                this.createStopByLatlng(latlng, false, radius);
            }

        }

        // this.locationInfo.controls['waystops'].setValue(route['waystops']);
        this.directionsRenderer = this.baseService.requestDirections(this.googleMap, route, false, false, this.onRouteReady.bind(this));
        this.baseService.openFloatingPanel();
        this.baseService.showFloatingRoutes();
        this.baseService.hideStopIcon();
        this.baseService.hideRoutes();
    }

    deleteWaypoint(index:number) {
        this.directionInfo.controls.stops.removeAt(index);
        var currentStops: any[] = this.directionInfo.controls.stops.value;
        var emptyValueStop = currentStops.find((currentStop:any) => currentStop.lat === '' || currentStop.lng === '' || currentStop.location === '' || currentStop.radius === '');
        if (emptyValueStop) {
            this.directionInfoValid = false;
        } else {
            this.directionInfoValid = true;
        }
    }

    addWaypoint() {
        this.directionInfo.controls['stops'].push(this.initWaypoint());
        var self = this;
        setTimeout(function(){
            var i = self.directionInfo.controls['stops'].length - 1;
            var lat_way: any = 'lat_way' + i;
            var lng_way: any = 'lng_way' + i;
            self.baseService.enableAutoCompleteAddress2('way'+i, lat_way, lng_way, self.googleMap, 'way_place'+i, i, self.stopChange.bind(self));
            self.directionInfoValid = false;
        }, 200);
    }

    onLocationNext(event: any) {
        var stoppings=[];
        for(var j=0; j<this.markers.length; j++) {
            var stopData = {};

            stopData['stop_id'] = j;
            stopData['lat'] = this.markers[j].getPosition().lat();
            stopData['lng'] = this.markers[j].getPosition().lng();
            stopData['location'] = jQuery('#way' + j).val();
            stopData['place_id'] = jQuery('#way_place' + j).val();
            stopData['radius'] = this.markers[j].radius;
            stoppings.push(stopData);//JSON.stringify(stopData);
        }

        this.directionInfo.controls['orgin'].setValue(this.orgin.nativeElement.value);
        this.directionInfo.controls['destination'].setValue(this.destination.nativeElement.value);
        this.directionInfo.controls['from_lat'].setValue(this.fromLat.nativeElement.value);
        this.directionInfo.controls['from_lng'].setValue(this.fromLng.nativeElement.value);
        this.directionInfo.controls['to_lat'].setValue(this.toLat.nativeElement.value);
        this.directionInfo.controls['to_lng'].setValue(this.toLng.nativeElement.value);
        this.directionInfo.controls['stops'].setValue(stoppings);


    }

    callbackDirectionsRenderer(directionsRenderer: any) {
        this.directionsRenderer = directionsRenderer;
        /*var geocoded_waystops = this.directionsRenderer.directions.geocoded_waystops, waystops=[];
        for (var z=0; z<geocoded_waystops.length; z++) {
            waystops.push(geocoded_waystops[z].place_id);
        }*/
        // this.locationInfo.controls['waystops'].setValue(waystops);
        this.directionInfo.controls['overview_path'].setValue(directionsRenderer.directions.routes[0].overview_polyline);
    }

    getLocationFromPlaceId(geo_wp:any, data: any, callback:any) {
        var geocoder = new window['google'].maps.Geocoder,
            str_from_lat = (<HTMLInputElement>document.getElementById("fromLat")).value,
            str_from_lng = (<HTMLInputElement>document.getElementById("fromLng")).value,
            str_to_lat = (<HTMLInputElement>document.getElementById("toLat")).value,
            str_to_lng = (<HTMLInputElement>document.getElementById("toLng")).value;

        geocoder.geocode({'placeId': geo_wp.place_id}, function(results:any, status:any) {
            if (status === 'OK') {
                var latlng = results[0].geometry.location;
                if (( str_from_lat !== latlng.lat()+'' && str_from_lng !== latlng.lng()+'') ||
                    (str_to_lat !== latlng.lat()+'' && str_to_lng !== latlng.lng()+'')) {

                    data[latlng.lat()] = latlng.lng() + '';
                }
                callback(null, data);
            }
            if (status === 'OVER_QUERY_LIMIT') {
                setTimeout(callback(null, data), 2000);
            }
        });
    }

    closeOverlay() {
        if (this.directionsRenderer !== null && this.directionsRenderer !== undefined) {
            this.directionsRenderer.setMap(null);
            window['google'].maps.event.trigger(this.googleMap, 'resize');
        }

        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i]._myCircle.setMap(null);
            this.markers[i].setMap(null);
        }
        this.baseService.closeOverlay('#addRoute');
        this.markers =  [];
    }

    createRouteForm() {
        this.getDependant();
        for (let marker of this.markers) {
            if(marker._myCircle.getMap() != null) marker._myCircle.setMap(null);
            marker.setMap(null);
        }
        this.basicInfo = this.fb.group({
            'route_name': ['', Validators.required],
            'route_desc': '',
            'driver_id': ['', Validators.required],
            'reg_no': ['', Validators.required],
            'googleMap': '',
            'city': ''
        });

        this.directionInfo = this.fb.group({
            'orgin': ['', Validators.required],
            'from_lat': '',
            'from_lng': '',
            'destination': ['', Validators.required],
            'to_lat': '',
            'to_lng': '',
            'radius': '',
            'stops':  this.fb.array([this.initWaypoint()]),
            'overview_path': ''
        });

        this.locationInfo = this.fb.group({
            'waystops': []
        });

        this.conductorInfo = this.fb.group({
            'conductor_name': '',
            'conductor_address': '',
            'conductor_phone': ''
        });
        this.markers = [];
    }

    stopChange(location: string, lat: any, lng: any, placeId:string, i:number) {
        this.directionInfo.controls.stops.controls[i].controls.location.setValue(location);
        this.directionInfo.controls.stops.controls[i].controls.lat.setValue(lat);
        this.directionInfo.controls.stops.controls[i].controls.lng.setValue(lng);
        this.directionInfo.controls.stops.controls[i].controls.place_id.setValue(placeId);
        this.directionInfoValid = true;

    }

    getLocationChange(event: any, i:number) {
        //this.directionInfo.controls.stops.controls[i].controls.location.setValue(event.target.value);
    }

    initWaypoint() {
        return this.fb.group({
            'stop_id': '',
            'location': '',
            'lat': '',
            'lng': '',
            'radius': ['500', Validators.required],
            'place_id': ''
        });
    }

    isEmpty(event: any, index: number) {
        var currentStops: any[] = this.directionInfo.controls.stops.value;
        var emptyValueStop = currentStops.find((currentStop:any) => currentStop.lat === '' || currentStop.lng === '' || currentStop.location === '' || currentStop.radius === '');

        if (event.target.value !== undefined && event.target.value.trim().length === 0 || emptyValueStop) {
            this.directionInfoValid = false;
        } else {
            this.directionInfoValid = true;
        }
    }

    setEditWaypoint(form:any){
        var stops = form;
        if (stops.length === 0) {
            this.directionInfo.controls['stops'].push(this.initWaypoint());
        } else {
            for (var i = 0; i < stops.length; i++) {
                this.directionInfo.controls['stops'].push(this.editWaypoint(stops[i]));
                this.enableAutoAddress(i, this);
            }
        }
    }

    editWaypoint(form: any) {
        return this.fb.group({
            'stop_id': form.stop_id,
            'location': [form.location,Validators.required],
            'lat': [form.lat,Validators.required],
            'lng': [form.lng,Validators.required],
            'radius': form.radius,
            'place_id': form.place_id
        });
    }

    getDependant () {
        this.transportService.getAll(this.serviceUrls.driver).then(drivers => this.callBackDriver(drivers));
        this.transportService.getAll(this.serviceUrls.activeVehicle).then(vehicles => this.callBackVehicle(vehicles));
    }

    callBackDriver(drivers: any) {
        this.drivers = drivers;
        var selectedDriver = null;
        if (this.route != null) {
            selectedDriver = this.route.driver_id;
        }
        this.basicInfo.controls['driver_id'].setValue(selectedDriver);
        this.baseService.enableSelectWithEmpty('#driver', this.drivers, [ 'driver_name', 'id' ], selectedDriver);
    }

    callBackVehicle(vehicles: any){
        this.vehicles = vehicles;
        var selectedVehicle = null;
        if (this.route != null) {
            selectedVehicle = this.route.reg_no;
        }
        this.basicInfo.controls['reg_no'].setValue(selectedVehicle);
        this.baseService.enableSelectWithEmpty('#vehicle', this.vehicles, [ 'reg_no', 'reg_no' ], selectedVehicle);

    }

    editForm(form: any) {
        this.getDependant();
        this.basicInfo.controls['route_name'].setValue(form.route_name);
        this.basicInfo.controls['route_desc'].setValue(form.route_desc);

        this.conductorInfo.controls['conductor_name'].setValue(form.conductor_name);
        this.conductorInfo.controls['conductor_address'].setValue(form.conductor_address);
        this.conductorInfo.controls['conductor_phone'].setValue(form.conductor_phone);
        this.directionInfoValid = true;

    }

    saveRoute(event:any) {
        const formData = Object.assign({}, this.basicInfo._value, this.directionInfo._value, this.locationInfo._value,
            this.conductorInfo._value);
        // formData['stops'] = this.directionInfo.controls.stops.value;
        if (this.route == null) {
            this.transportService.save(this.serviceUrls.route, { _value: formData }).then(
                result => this.saveRouteCallBack('Route Saved Successfully'),
                error => this.saveRouteErrCallBack('Route Not Saved'))
        } else {
            this.transportService.update(this.serviceUrls.route+this.route.id, { _value: formData }).then(
                result => this.saveRouteCallBack('Route Updated Successfully'),
                error => this.saveRouteErrCallBack('Route Not Updated'))
        }
    }

    saveRouteCallBack(msg:string) {
        this.closeOverlay();
        this.baseService.showNotification(msg, "", 'bg-success');
        this.parent.getAllRoutes();
    }

    saveRouteErrCallBack(msg:string) {
        this.baseService.showNotification(msg, "", 'bg-danger');
    }

    resetForm(){
        this.createRouteForm();
        this.route= null;
    }

}
