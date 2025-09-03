/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {BaseService, TransportService} from "../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../common/index";
import {TransportNotificationLogsComponent } from "./transport-notification-logs/transport-notification-logs.component"
declare var jQuery: any;

@Component({
    templateUrl: 'live.html',
    styles: [`
        .dataTables_empty {
            text-align: center;
        }
    `], encapsulation: ViewEncapsulation.Emulated,

})

export class LiveComponent implements OnInit {

    constructor(private baseService: BaseService, private  serviceUrls: ServiceUrls,
                public transportService: TransportService,
                public constants: Constants, public messages: Messages) { }

    routes: any[];
    drivers: any[];
    firstHit: boolean;
    routesMarker: any[];
    city: string;
    schoolDetails: any;
    googleMap: any;
    googleApiLoaded: boolean;
    directionsRenderer: any;
    selectedRoute: any;
    timer: any;
    color: string[];
    enable: boolean = false;


    @ViewChild('selectRoute') selectRoute: ElementRef;
    @ViewChild(TransportNotificationLogsComponent) transportNotificationLogs : TransportNotificationLogsComponent;

    ngOnInit() {
        this.baseService.setTitle('NSA - Vehicle Tracking');
        this.getAllRoutes();
        this.routes = [];
        this.drivers = [];
        this.routesMarker = [];
        this.googleApiLoaded = false;
        this.firstHit = true;
        this.googleMap = null;
        this.transportService.getSchoolDetails(this.serviceUrls.school_details).then(school_details => this.callBackSchoolDetails(school_details));
        this.transportService.getAll(this.serviceUrls.vehicle).then(vehicles => this.setVehicles(vehicles));
        this.enable = this.baseService.havePermissionsToEdit(this.constants.SECTION_PERMISSIONS)
        this.color = ['#ff9000',
            '#00BFFF',
            '#32CD32',
            '#FF69B4',
            '#8470FF',
            '#2E8B57',
            '#499bea',
            '#8B2323',
            '#9ACD32',
            '#0000CD',
            '#7D26CD']
    }

    setVehicles(vehicles: any) {
        this.baseService.enableMultiSelectDefaultAll('#selectRoute', vehicles, [ 'reg_no', 'reg_no' ], null);
    }

    ngOnDestroy() {
        this.firstHit = false;
        clearTimeout(this.timer);
    }

    transportLogs(event: any){
       this.transportNotificationLogs.transportLog(event);
    }


    callBackSchoolDetails(schoolDetails: any) { //loading google api
        this.schoolDetails = schoolDetails;
        if (!window['google']) {
            (<any>window).googleMapsReady = this.onMapsReady.bind(this);
            this.baseService.enableGoogleMapApi(schoolDetails.map_key);
        } else {
            this.onMapsReady();
        }
    }

    onMapsReady() { //google callback function and created google.maps intance before overlay loading
        this.googleApiLoaded = true;
        this.baseService.enableMarkerWithLabelApi();
        if (this.googleApiLoaded && this.googleMap === null) {
            this.googleMap = this.baseService.initializeMap(this.schoolDetails.city, "liveMap");
            // this.baseService.enableOverrideMapApi();
            var _self = this;
            setTimeout(function(){
                _self.livetrack();
            }, 100);
        }
    }

    getAllRoutes() {
        this.transportService.getAll(this.serviceUrls.route).then(routes => this.callBack(routes));
    }

    callBack(routes: any) {
        if (routes.message == undefined) {
            this.routes = routes;
            var vehicles: any[] = [];
            var self = this;
            jQuery("#selectRoute").change(function () {
                var selectedCount = jQuery(this).val().length;
                jQuery('option', jQuery('#selectRoute')).each(function() {
                    self.onChangeVehicle.bind(self)(jQuery(this).context.value, jQuery(this).prop('selected'), selectedCount);
                });

            });

        } else {
            this.routes = [];
        }
    }

    onChangeVehicle(selectedVehicle: any, visibility: boolean, count: number) {
        var route = this.routes.find(route => route.reg_no == selectedVehicle);
        if (route) {

            route.movingPolyline.setVisible(visibility);
            route.marker.setVisible(visibility);
            if (route.defautPolyline) {
                route.defautPolyline.setVisible(visibility);
            }

            if (this.routesMarker.length === 1) {

                if (visibility) {
                    this.googleMap.panTo(route.marker.getPosition());
                    this.googleMap.setCenter(route.marker.getPosition());
                    this.googleMap.setZoom(16);
                }
            } else if (count === 1) {
                if (visibility) {
                    this.googleMap.panTo(route.marker.getPosition());
                    this.googleMap.setCenter(route.marker.getPosition());
                    this.googleMap.setZoom(16);
                }
            } else {
                this.googleMap.setZoom(11);
            }
        }
    }

    drawRoute(directionsRenderer: any) {
        this.directionsRenderer = directionsRenderer;
        this.transportService.getAll(this.serviceUrls.tracking+this.selectedRoute.reg_no).then(vehicleLocation => this.callbackVehicleStatus(vehicleLocation));
    }

    callbackVehicleStatus(vehicleLocation: any) {
        if (vehicleLocation && vehicleLocation.ignitionStatus === 'OFF') {
            this.baseService.showNotification('Error', 'Vehicle is Parked', this.constants.j_warning);
            this.baseService.createMarker(this.googleMap,
                new window['google'].maps.LatLng(parseFloat(vehicleLocation.latitude),
                    parseFloat(vehicleLocation.longitude)), "", 0, false, null);
        } else {
            this.baseService.initializeLivePolyline(this.googleMap, this.directionsRenderer.directions);
            this.livetrack();
        }
    }

    livetrack() {
        var _self = this;
        // this.transportService.getAll(this.serviceUrls.tracking+this.selectedRoute.reg_no).then(vehicleLocation => this.callbackLiveTrack(vehicleLocation));
        this.transportService.getAll(this.serviceUrls.tracking)
            .then(vehicleLocations => this.callbackLiveTrackAll(vehicleLocations))
            .catch(err => this.callBackError(err));

        this.timer = setTimeout(function () {
            _self.firstHit = false;
            _self.livetrack();
        }, 2000);
    }

    callBackError(err: any) {
        this.baseService.showNotification('Error', err, this.constants.j_danger);
        clearTimeout(this.timer);
    }

    callbackLiveTrackAll(vehicleLocations: any) {
        if (this.firstHit) {
            for (var i = 0; i < vehicleLocations.length; i++) {
                var route = this.routes.find(route => route.reg_no == vehicleLocations[i].regNo);
                if (!route) {
                    route = {};
                    route.reg_no = vehicleLocations[i].regNo;
                    this.routes.push(route);
                }
                var lat = parseFloat(vehicleLocations[i].latitude);
                var lng = parseFloat(vehicleLocations[i].longitude);
                var label = {
                    color: 'black',
                    fontWeight: 'bold',
                    text: route.reg_no,
                    'background-color': 'white'
                }
                route.marker = this.baseService.createVehilceMarker(this.googleMap, lat, lng, route.route_name, label);
                if (route.overview_path) {
                    route.defautPolyline = this.baseService.createPolyline('#a0a0a0');
                    var decodePath = window['google'].maps.geometry.encoding.decodePath(route.overview_path);
                    route.defautPolyline.setPath(decodePath);
                    route.defautPolyline.setMap(this.googleMap);
                }

                route.movingPolyline = this.baseService.createPolyline(this.color[(i % 10)]);
                route.movingPolyline.setPath([{lat: lat, lng: lng}]);
                route.movingPolyline.setMap(this.googleMap);
                this.routesMarker.push(route);
            }
            var position  = new window['google'].maps.LatLng(vehicleLocations[0].latitude, vehicleLocations[0].longitude),
                self = this;

            setTimeout(function() {
                self.googleMap.setCenter(position);
                if (self.routesMarker.length === 1) {
                    self.googleMap.setZoom(16);
                    self.googleMap.panTo(position);
                } else {
                    self.googleMap.setZoom(11);
                }

            }, 500)
        } else {
            for (var i = 0; i < vehicleLocations.length; i++) {
                var self = this;
                this.findRoute(vehicleLocations[i], function(vehicle: any) {
                    var lat = parseFloat(vehicleLocations[i].latitude);
                    var lng = parseFloat(vehicleLocations[i].longitude);
                    var position  = new window['google'].maps.LatLng(lat, lng);
                    var lastPosn = vehicle.marker.getPosition();

                    if (lastPosn.lat() !== position.lat() && lastPosn.lng() !== position.lng()) {

                        vehicle.marker.setPosition({lat: lat, lng: lng});
                        // vehicle.marker.ibLabel.setPosition(new window['google'].maps.LatLng(vehicleLocations[0].latitude, vehicleLocations[0].longitude));
                        var heading = window['google'].maps.geometry.spherical.computeHeading(lastPosn, position);
                        var icon = vehicle.marker.getIcon();
                        icon.rotation = heading;
                        vehicle.marker.setIcon(icon);
                        if (vehicleLocations[i].ignitionStatus === 'OFF') {
                            vehicle.movingPolyline.setPath([]);
                            vehicle.movingPolyline.setMap(null);
                        } else {
                            var path = vehicle.movingPolyline.getPath();
                            path.push(position);
                            vehicle.movingPolyline.setPath(path);
                            if (vehicle.movingPolyline.getMap() === null) {
                                vehicle.movingPolyline.setMap(self.googleMap);
                            }
                        }

                    }
                });
            }
        }
    }

    findRoute(vehicleLocation: any, callback: any){
        var vehicle = this.routesMarker.find(route => route.reg_no == vehicleLocation.regNo);
        if ((vehicle)) {
            callback(vehicle);
        }
    }

    callbackLiveTrack(vehicleLocation: any) {
        this.baseService.animate(null, vehicleLocation, this.googleMap);
    }

    changeRoute() {
    }

}
