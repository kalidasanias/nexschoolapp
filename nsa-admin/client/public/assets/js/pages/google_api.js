/**
 * Created by bharatkumarr on 02/05/17.
 */

var markers=[], polylines = [], alternateRoutes = {}, path = [], placeIDs = {}, dragCallback = false,
    routeSelectboxIt,directionsRenderer;

function enableAutoCompleteSearch(map) {
    enableAutoCompleteAddress('fromAddress', 'fromLat', 'fromLng', map, null);
    enableAutoCompleteAddress('toAddress', 'toLat', 'toLng', map, null);
}

function hideFloatingPanel() {
    $('.floating-panel-heading').addClass('hide');
    $('#floating-panel').find('.panel-body').addClass('hide');
    $('.createStop').removeClass('hide');
    $("#createStop").addClass('hide-search-route');
    $(".panel-heading-map").addClass('stop-mark-alone');
}


function closeFloatingPanel() {
    if (!$("#floating-panel-route").hasClass('panel-collapsed')) {
        $("#floating-collapse").click();
    }
}

function openFloatingPanel() {
    if ($("#floating-panel-route").hasClass('panel-collapsed')) {
        $("#floating-collapse").click();
    }
}

function enableAutoCompleteAddress(elementId, lat, lon, map, placeId) {
    var input = document.getElementById(elementId);
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        document.getElementById(elementId).value = place.formatted_address;
        map.setCenter(place.geometry.location);
        document.getElementById(lat).value = place.geometry.location.lat();
        document.getElementById(lon).value = place.geometry.location.lng();
        if (placeId) {
            document.getElementById(placeId).value = place.place_id;
        }

        /*new google.maps.Geocoder().geocode({latLng: place.geometry.location}, function(results, status){
            if (status == google.maps.GeocoderStatus.OK && results.length > 0){
                document.getElementById(elementId).value = results[0].formatted_address;
                map.setCenter(results[0].geometry.location);
                document.getElementById(lat).value = results[0].geometry.location.lat();
                document.getElementById(lon).value = results[0].geometry.location.lng();
                // createMarker(map, results[0].geometry.location, 'Address', results[0].formatted_address);
            }
        });*/
    });
}

function enableAutoCompleteAddress2(elementId, lat, lon, map, placeId, ind, cb) {
    var input = document.getElementById(elementId);
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        // document.getElementById(elementId).value = place.formatted_address;
        map.setCenter(place.geometry.location);
        // document.getElementById(lat).value = place.geometry.location.lat();
        // document.getElementById(lon).value = place.geometry.location.lng();
        // if (placeId) {
        //     document.getElementById(placeId).value = place.place_id;
        // }

        cb(place.formatted_address, place.geometry.location.lat(), place.geometry.location.lng(), place.place_id, ind);
    });
}

function requestDirections(map, route, dragRoute, alternateRoute, callback) {
    var routeToDisplay = 0,waypts = [],
        start = new google.maps.LatLng(route.from_lat, route.from_lng),
        end = new google.maps.LatLng(route.to_lat, route.to_lng);

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
    };

    if (route !== null && route.waypoints !== null && route.id !== null) {
        for (var place_id in route.waypoints) {
            if (route.waypoints.hasOwnProperty(place_id)) {
                var waypoint = route.waypoints[place_id];
                waypts.push({ location: {placeId: waypoint}, stopover: true});
            }
        }
        request.waypoints = waypts;
    }

    // if (route.id === null || route.id === undefined) {
        request.provideRouteAlternatives = alternateRoute;
    // }
    // google.maps.event.trigger(map, 'resize');
    rendererOptions = getRendererOptions(true, dragRoute);
    if (directionsRenderer) {
        directionsRenderer.setMap(null);
    }
    directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);

    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            renderDirections(map, result, directionsRenderer, 0, callback);

            //optionalRoute
            var options = [];
            for (var i = 0; i < result.routes.length; i++) {
                options.push({text: result.routes[i].summary, value: i});
            }

            // if (route.id === null || route.id === undefined) {
                /*if (routeSelectboxIt !== undefined) {
                    $("#selectRoute").data("selectBox-selectBoxIt").remove();
                    $("#selectRoute").data("selectBox-selectBoxIt").add(options);
                    $("#selectRoute").selectBoxIt('enable');
                } else {
                    routeSelectboxIt = $('#selectRoute').selectBoxIt({
                        theme: "bootstrap",
                        autoWidth: false,
                        populate: {data: options}
                    });
                }

                $('#selectRoute').on("change", function () {
                    directionsRenderer.setRouteIndex(parseInt($(this).val()));
                });*/
            // }
            // if (route !== null && route.id !== undefined) {
                dragCallback = true;
                callback(directionsRenderer);
            // }
        }
    });
}

function getRendererOptions(main_route, dragRoute) {
    if(main_route) {
        var _colour = '#808080';
        var _strokeWeight = 3;
        var _strokeOpacity = 0.7;
        var _suppressMarkers = false;
    }
    else {
        var _colour = '#808080';
        var _strokeWeight = 2;
        var _strokeOpacity = 0.7;
        var _suppressMarkers = false;
    }

    var polylineOptions ={ strokeColor: _colour, strokeWeight: _strokeWeight, strokeOpacity: _strokeOpacity  };
    var rendererOptions = {draggable: dragRoute, suppressMarkers: _suppressMarkers, polylineOptions: polylineOptions};
    return rendererOptions;
}

function renderDirections(map, result, directionsRenderer, routeToDisplay, callback) {
    var polylineOptions = {
        path: [],
        strokeColor: '#808080',
        strokeWeight: 3,
        strokeOpacity: 0.7
    }; //00458E
    var dragPolylineOptions = {
        path: [],
        strokeColor: '#00B3FD',
        // strokeColor: '#00458E',
        strokeWeight: 3,
        strokeOpacity: 0.8
    };

    var polyline = new google.maps.Polyline(polylineOptions);

    polylines[routeToDisplay] = polyline;
    directionsRenderer.setMap(map);
    directionsRenderer.setDirections(result);
    alternateRoutes[routeToDisplay] = directionsRenderer;

    google.maps.event.addListener(directionsRenderer, 'directions_changed', function(e) {
        var currentPolyline = polylines[directionsRenderer.routeIndex];
        currentPolyline.setOptions(dragPolylineOptions);
        currentPolyline.setPath([]);
        currentPolyline.setMap(null);
        directionsRenderer.polylineOptions = dragPolylineOptions;
        // dragPolyline(map, currentPolyline, directionsRenderer);

        placeIDs = {};
        var geo_wp = directionsRenderer.directions.geocoded_waypoints;
        for (ind = 0;ind < geo_wp.length; ind++) {
            getLocationFromPlaceId(geo_wp[ind].place_id, function(latlng) {
                placeIDs[latlng.lat()] = latlng.lng()+'';
            });
        }
        if (routeSelectboxIt !== undefined) {
            $("#selectRoute").selectBoxIt('disable');
        }
        // if (!dragCallback) {
            callback(directionsRenderer);
        // }
    });

}

function getWaypoints() {
    return placeIDs;
}

function getLocationFromPlaceId(placeId, callback) {
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'placeId': placeId}, function(results, status) {
        if (status === 'OK') {
            callback(results[0].geometry.location);
        }
    });
}

function dragPolyline(map, polyline, response) {
    polyline.setPath(response.directions.routes[0].overview_path);
    polyline.setMap(map);
    polylines[response.routeIndex] = polyline;
    for (k=0; k < Object.keys(polylines).length; k++) {
        if(k !== response.routeIndex) {
            polylines[k].setMap(null);
            alternateRoutes[k].setMap(null);
        }
    }
}

function createMarker(map, latlng, label, radius, draggable, markerIcon) {
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: label,
        draggable: draggable,
        zIndex: Math.round(latlng.lat() * -100000) << 5
    });
    if (markerIcon != null) {
        marker.setIcon(markerIcon);
    }
    setTimeout(function() { map.setCenter(latlng); }, 200);

    if (radius > 0) {
        var populationOptions = {
            strokeColor: '#b41b1b',
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillColor: '#b41b1b',
            fillOpacity: 0.2,
            map: map,
            center: latlng,
            radius: parseInt(radius)
        };

        // Add the circle for this city to the map.
        var stopCircle = new google.maps.Circle(populationOptions);
        stopCircle.bindTo('center', marker, 'position');
        marker._myCircle = stopCircle;
        marker.myname = label;
        marker.radius = radius;
    }


    var infowindow = new google.maps.InfoWindow({
        size: new google.maps.Size(150, 50)
    });
    // openInfoWindow({latLng: latlng}, map, marker, infowindow, 'Stop&nbsp;-&nbsp;');

    if(draggable) {
        google.maps.event.addListener(marker, 'dragend', function (evt) {
            openInfoWindow(evt, map, marker, infowindow, label);
        });
    }
    google.maps.event.addListener(marker, 'click', function (evt) {
        openInfoWindow(evt, map, marker, infowindow,label);
    });
    markers.push(marker);
    return marker;
}

function openInfoWindow(evt, map, marker, infowindow, text) {
    new google.maps.Geocoder().geocode({'latLng': evt.latLng }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                marker.address = results[0].formatted_address;
                infowindow.setContent("<b>"+ marker.getTitle()+" :</b>&nbsp;" + results[0].formatted_address);
                infowindow.open(map, marker);
            }
        }
    });
}

function getMapFormData(markers) {
    var stoppings={};
    for(j=0; j<markers.length; j++) {
        var stopData = {};
        stopData.lat = markers[j].getPosition().lat();
        stopData.lng = markers[j].getPosition().lng();
        stopData.address = markers[j].address;
        stoppings[j] = JSON.stringify(stopData);
    }
    var fromData = serializeFormJSON($(".routeWizardForm"));
    fromData.stops = stoppings;
    fromData.waypoints = placeIDs;
    return fromData;
}

function createVehilceMarker(map, lat, lng, title, label) {
    var car = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
    var image = {
        url: 'http://localhost:3002/public/assets/images/bussmall.svg',

        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(10, 25)
    }
    icon = {
        labelOrigin: new google.maps.Point(50, 50),
        path: car,
        scale: .5,
        strokeColor: 'black',
        strokeWeight: .9,
        fillOpacity: 1,
        fillColor: '#febf01',
        offset: '5%',
        //rotation: parseInt(heading[i]),
        anchor: new google.maps.Point(10, 25) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
    };

    var latlng = new google.maps.LatLng(lat, lng);

    var labelText = "City Hall";

    var vehicleMarker =  new MarkerWithLabel({
        position: latlng,
        map: map,
        icon: icon,
        title: title,
        draggable: false,
        labelContent: label.text,
        labelAnchor: new google.maps.Point(30, -10),
        labelClass: "labels", // the CSS class for the label
        labelStyle: {border: "1px solid black"
            ,textAlign: "center"
            ,fontSize: "8pt"
            ,width: "75px",
            'background-color': 'white',
            'margin-top': '10px'}
    });

    /*var vehicleMarker = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: icon,
        title: title,
        draggable: false,
    });*/
    var infowindow = new google.maps.InfoWindow({
        size: new google.maps.Size(150, 50)
    });
    // openInfoWindow({latLng: latlng}, map, vehicleMarker, infowindow, '');

    google.maps.event.addListener(vehicleMarker, 'click', function (evt) {
        openInfoWindow(evt, map, vehicleMarker, infowindow, label.text);
    });
    map.panTo(latlng);
    map.setZoom(17);
    /*var myOptions = {
        content: label.text
        ,boxStyle: {
            border: "1px solid black"
            ,textAlign: "center"
            ,fontSize: "8pt"
            ,width: "75px",
            'background-color': 'white',
            'margin-top': '10px'
        }
        ,disableAutoPan: true
        ,pixelOffset: new google.maps.Size(-25, 0)
        ,position: latlng
        ,closeBoxURL: ""
        ,isHidden: false
        ,pane: "mapPane"
        ,enableEventPropagation: true
    };

    console.info('infobox creating.InfoBox..',label.text);
    vehicleMarker.ibLabel =  new InfoBox(myOptions);
    vehicleMarker.ibLabel.open(map, vehicleMarker);*/
    return vehicleMarker;
}


function createPolyline(color) {
    var polyline = new google.maps.Polyline({
        path: [],
        strokeColor: color,
        strokeWeight: 3
    });
    return polyline;
}


/*
// Live Tracking
var lastVertex = -1;

function updatePoly(d) {
    // Spawn a new polyline every 20 vertices, because updating a 100-vertex poly is too slow
    if (poly2.getPath().getLength() > 20) {
        poly2 = new google.maps.Polyline([polyline.getPath().getAt(lastVertex - 1)]);
        // map.addOverlay(poly2)
    }

    if (polyline.GetIndexAtDistance(d) < lastVertex + 2) {
        if (poly2.getPath().getLength() > 1) {
            poly2.getPath().removeAt(poly2.getPath().getLength() - 1);
        }
        poly2.getPath().insertAt(poly2.getPath().getLength(), polyline.GetPointAtDistance(d));
    } else {
        poly2.getPath().insertAt(poly2.getPath().getLength(), endLocation.latlng);
    }
}


var polyline = null;
var polylineRed = null;
var polylineColor = null;
var poly2 = null;
var vehicleMarker = null;
var icon = null;
var distanceBetweenPnDRoute = 0;
var endLocation = {};

function initializeLivePolyline(map, response) {
    polyline = new google.maps.Polyline({
        path: [],
        strokeColor: '#FF0000',
        strokeWeight: 3
    });
    polylineRed = new google.maps.Polyline({
        path: [],
        strokeColor: '#FF0000',
        strokeWeight: 3
    });
    polylineColor = new google.maps.Polyline({
        path: [],
        strokeColor: '#228B22',
        strokeWeight: 3
    });

    endLocation.latlng = response.request.destination;

    var bounds = new google.maps.LatLngBounds();
    // For each route, display summary information.
    var path = response.routes[0].overview_path;
    var legs = response.routes[0].legs;
    for (i = 0; i < legs.length; i++) {
        //if (i === 0) {
            //startLocation.latlng = legs[i].start_location;
            //startLocation.address = legs[i].start_address;
            //   marker = createMarker(legs[i].start_location, "start", legs[i].start_address, "green");
        // }
        // endLocation.latlng = legs[i].end_location;
        // endLocation.address = legs[i].end_address;
        var steps = legs[i].steps;
        // console.info('steps....',steps);
        for (j = 0; j < steps.length; j++) {
            var nextSegment = steps[j].path;

            //(function(ind, nextSegment) {
            // setTimeout(function(){

            for (k = 0; k < nextSegment.length; k++) {
                polyline.getPath().push(nextSegment[k]);
                bounds.extend(nextSegment[k]);
            }
            // }, 1000 + (500 * 1));
            //})(j, nextSegment);
        }
    }
    // polyline.setMap(map);
    map.fitBounds(bounds);
    map.setZoom(14);

    var car = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
    icon = {
        path: car,
        scale: .4,
        strokeColor: 'white',
        strokeWeight: .10,
        fillOpacity: 1,
        fillColor: '#404040',
        offset: '5%',
        //rotation: parseInt(heading[i]),
        anchor: new google.maps.Point(10, 25) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
    };
    vehicleMarker = new google.maps.Marker({
        position: polyline.getPath().getAt(0),
        map: map,
        icon: icon
    });

    poly2 = new google.maps.Polyline({
        path: [polyline.getPath().getAt(0)],
        strokeColor: "#0000FF",
        strokeWeight: 10
    });
}



function animate(d, result, map) {
    // if (d > eol) {
    //     // if (index == 74) {
    //     map.panTo(endLocation.latlng);
    //     marker.setPosition(endLocation.latlng);
    //     return;
    // }
    // var oldDis = distanceCovered
    // $.ajax({url: "http://localhost:9090/vehicleinfo/"+index, success: function(result){

        // var currlat = result.latitude, currlng = result.longitude;
        // var destlat = parseFloat(destLocation.lat()).toFixed(6), destlng = parseFloat(destLocation.lng()).toFixed(6);
        // console.info('before if.....dest lat='+destLocation.lat(),'dest lng='+destLocation.lng());
        // console.info('before if.....currlat=',currlat+'currlng='+currlng);
        // if (d > eol) {
        // if (destlat == currlat && destlng == currlng) {
        //     console.info('if...... finished...');
        //     map.panTo(endLocation.latlng);
        //     marker.setPosition(endLocation.latlng);
        //     return;
        // }

        //console.info(eol+'result......'+result.rowId, result.distanceCovered*1000);
        // index++;
        var currlat = result.latitude, currlng = result.longitude;

        var disCov = result.distanceCovered*1000;

        var p = polyline.GetPointAtDistance(disCov);
        // var p = polyline.GetPointAtDistance(d);


        var p  = new google.maps.LatLng(currlat,currlng);

        var rp = polyline.GetPointAtDistance(disCov);

        // console.info('distanceBetweenPnDRoute...',distanceBetweenPnDRoute);
        if (distanceBetweenPnDRoute > 500) {
            var cPath = polylineRed.getPath();
            cPath.push(p);
            // polylineRed.setPath(cPath);
            // polylineRed.setMap(map);
        } else {
            distanceBetweenPnDRoute = getDistanceFromLatLonInMetre(currlat,currlng, rp.lat(), rp.lng());
            var cPath = polylineColor.getPath();
            cPath.push(p);
            // polylineColor.setPath(cPath);
            // polylineColor.setMap(map);
        }

        // var cPath = polylineColor.getPath();
        // cPath.push(p);
        // polylineColor.setPath(cPath);
        // polylineColor.setMap(map);

        map.panTo(p);
        //polyline.setMap(map);

        var lastPosn = vehicleMarker.getPosition();
        vehicleMarker.setPosition(p);
        var heading = google.maps.geometry.spherical.computeHeading(lastPosn, p);
        icon.rotation = heading;
        vehicleMarker.setIcon(icon);
        // updatePoly(d);
        updatePoly(disCov);


        // timerHandle = setTimeout("animate(" + (d + step) + ")", 500);
    // }});
}

function getDistanceFromLatLonInMetre(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d*1000; // Distance in Metre
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function overridePolyline() {


    google.maps.LatLng.prototype.distanceFrom = function (newLatLng) {
        var EarthRadiusMeters = 6378137.0; // meters
        var lat1 = this.lat();
        var lon1 = this.lng();
        var lat2 = newLatLng.lat();
        var lon2 = newLatLng.lng();
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = EarthRadiusMeters * c;
        return d;
    }

    google.maps.LatLng.prototype.latRadians = function () {
        return this.lat() * Math.PI / 180;
    }

    google.maps.LatLng.prototype.lngRadians = function () {
        return this.lng() * Math.PI / 180;
    }

// === A method which returns the length of a path in metres ===
    google.maps.Polygon.prototype.Distance = function () {
        var dist = 0;
        for (var i = 1; i < this.getPath().getLength(); i++) {
            dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
        }
        return dist;
    }

// === A method which returns a GLatLng of a point a given distance along the path ===
// === Returns null if the path is shorter than the specified distance ===
    google.maps.Polygon.prototype.GetPointAtDistance = function (metres) {
        // some awkward special cases
        if (metres == 0) return this.getPath().getAt(0);
        if (metres < 0) return null;
        if (this.getPath().getLength() < 2) return null;
        var dist = 0;
        var olddist = 0;
        for (var i = 1;
             (i < this.getPath().getLength() && dist < metres); i++) {
            olddist = dist;
            dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
        }
        if (dist < metres) {
            return null;
        }
        var p1 = this.getPath().getAt(i - 2);
        var p2 = this.getPath().getAt(i - 1);
        var m = (metres - olddist) / (dist - olddist);
        return new google.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * m, p1.lng() + (p2.lng() - p1.lng()) * m);
    }

// === A method which returns an array of GLatLngs of points a given interval along the path ===
    google.maps.Polygon.prototype.GetPointsAtDistance = function (metres) {
        var next = metres;
        var points = [];
        // some awkward special cases
        if (metres <= 0) return points;
        var dist = 0;
        var olddist = 0;
        for (var i = 1;
             (i < this.getPath().getLength()); i++) {
            olddist = dist;
            dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
            while (dist > next) {
                var p1 = this.getPath().getAt(i - 1);
                var p2 = this.getPath().getAt(i);
                var m = (next - olddist) / (dist - olddist);
                points.push(new google.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * m, p1.lng() + (p2.lng() - p1.lng()) * m));
                next += metres;
            }
        }
        return points;
    }

// === A method which returns the Vertex number at a given distance along the path ===
// === Returns null if the path is shorter than the specified distance ===
    google.maps.Polygon.prototype.GetIndexAtDistance = function (metres) {
        // some awkward special cases
        if (metres == 0) return this.getPath().getAt(0);
        if (metres < 0) return null;
        var dist = 0;
        var olddist = 0;
        for (var i = 1;
             (i < this.getPath().getLength() && dist < metres); i++) {
            olddist = dist;
            dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
        }
        if (dist < metres) {
            return null;
        }
        return i;
    }
// === Copy all the above functions to GPolyline ===
    google.maps.Polyline.prototype.Distance = google.maps.Polygon.prototype.Distance;
    google.maps.Polyline.prototype.GetPointAtDistance = google.maps.Polygon.prototype.GetPointAtDistance;
    google.maps.Polyline.prototype.GetPointsAtDistance = google.maps.Polygon.prototype.GetPointsAtDistance;
    google.maps.Polyline.prototype.GetIndexAtDistance = google.maps.Polygon.prototype.GetIndexAtDistance;
}
*/
