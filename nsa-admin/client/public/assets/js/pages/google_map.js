/**
 * Created by bharatkumarr on 02/05/17.
 */
var markers=[], geoCoder = null, polylines = {}, alternateRoutes = {}, directionsRenderer=null,
    path = [], placeIDs = [], isGoogleAPILoaded = false;


function googleAPILoaded() {
    var typeahead_addresspicker = '/public/assets/js/plugins/pickers/location/typeahead_addresspicker.js';
    var autocomplete_addresspicker = '/public/assets/js/plugins/pickers/location/autocomplete_addresspicker.js';
    var location = '/public/assets/js/plugins/pickers/location/location.js';

    if (window['google'] !== undefined) {
        // updateDependecy(typeahead_addresspicker);
        // updateDependecy(autocomplete_addresspicker);
        // updateDependecy(location);
        // enableAutoCompleteAddress(query.elementId);
        isGoogleAPILoaded = true;
        console.info('loaded...');
        document.getElementById('googleMap').value = ''
        $('#googleMap').val('loaded');
        return true;
    }
}


function updateDependecy(url) {
    var node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    // node.async = true;
    // node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
}

function loadGoogleMapApi(query){
    var googleUrl = 'http://maps.google.com/maps/api/js?sensor=false&key='+query.key+'&libraries=geometry,places&ext=.js&callback=googleAPILoaded';
    if (window['google'] !== undefined) {
        this.isGoogleAPILoaded= true;
        return;
    }
    var node = document.createElement('script');
    node.src = googleUrl;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
}

function enableMap(location) {
    var locaPic = $('#us3').locationpicker({
        location: {latitude: 13.069384, longitude: 80.16824},
        // location: location,
        radius: 300,
        scrollwheel: false,
        inputBinding: {
            latitudeInput: $('#fromLat'),
            longitudeInput: $('#fromLng'),
            radiusInput: $('#radius'),
            locationNameInput: $('#fromAddress')
        },
        enableAutocomplete: true,
        onchanged: function (currentLocation, radius, isMarkerDropped) {
            alert("Location changed. New location (" + currentLocation.latitude + ", " + currentLocation.longitude + ")");
        }
    });

    var map = $('#us3').locationpicker('map').map;

    $('#us3').locationpicker({
        location: {
            map: map,
            latitude: 13.592556, longitude: 79.520116},
        // location: location,
        radius: 300,
        scrollwheel: false,
        inputBinding: {
            latitudeInput: $('#toLat'),
            longitudeInput: $('#toLng'),
            radiusInput: $('#radius'),
            locationNameInput: $('#toAddress')
        },
        enableAutocomplete: true,
        onchanged: function (currentLocation, radius, isMarkerDropped) {
            alert("Location changed. New location (" + currentLocation.latitude + ", " + currentLocation.longitude + ")");
        }
    });
    $('#us3').locationpicker('autosize');
}

function enableAutoCompleteAddress(elementId, lat, lon, map) {
    var autoComplete = new google.maps.places.Autocomplete(document.getElementById(elementId));
    google.maps.event.addListener(autoComplete, 'place_changed', function() {
        var place = autoComplete.getPlace();
        if (!place.geometry) {
            //gmapContext.settings.onlocationnotfound(place.name);
            return;
        }

        new google.maps.Geocoder().geocode({latLng: place.geometry.location}, function(results, status){
            if (status == google.maps.GeocoderStatus.OK && results.length > 0){
                document.getElementById(elementId).value = results[0].formatted_address;
                map.setCenter(results[0].geometry.location);
                document.getElementById(lat).value = results[0].geometry.location.lat();
                document.getElementById(lon).value = results[0].geometry.location.lng();
                // createMarker(map, results[0].geometry.location, 'Address', results[0].formatted_address);
            }
        });
    });
}


function createMarker(map, latlng, label, html) {
    // var contentString = '<b>' + label + '</b><br>' + html;
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10
        },
        title: label,
        draggable: true,
        zIndex: Math.round(latlng.lat() * -100000) << 5
    });
    map.setCenter(latlng);

    var radius = parseInt($('#radius').val() || 500);
    var populationOptions = {
        strokeColor: '#b41b1b',
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: '#b41b1b',
        fillOpacity: 0.2,
        map: map,
        center: latlng,
        radius: radius
    };

    // Add the circle for this city to the map.
    var stopCircle = new google.maps.Circle(populationOptions);
    stopCircle.bindTo('center', marker, 'position');
    marker.myname = label;

    var infowindow = new google.maps.InfoWindow({
        size: new google.maps.Size(150, 50)
    });
    google.maps.event.addListener(marker, 'dragend', function(evt){
        openInfoWindow(evt, marker, infowindow);
    });
    google.maps.event.addListener(marker, 'click', function (evt) {
        // openInfoWindow(evt, map, marker, stopCircle);
        infowindow.open(map, marker);
    });
    markers.push(marker);
    return marker;
}

function getMapFormData() {
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

function serializeFormJSON (form) {
    var data = {};
    var formData = form.serializeArray();
    $(formdata ).each(function(index, obj){
        data[obj.name] = obj.value;
    });
    console.info('serializeArray....',data);
    /*$.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });*/
    return data;
}

function openInfoWindow(evt, marker, infowindow) {
    if (geoCoder == null) {
        geoCoder = new google.maps.Geocoder();
    }
    // stopCircle.setCenter(evt.latLng);
    geoCoder.geocode({'latLng': evt.latLng }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                marker.address = results[0].formatted_address;
                infowindow.setContent(results[0].formatted_address);
                // infowindow.open(map, marker);
            }
        }
    });
}

function createMap(address) {
    console.info('address....',address);
    var myOptions = {
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("us3"), myOptions);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        map.setCenter(results[0].geometry.location);
    });
    return map;
}

function drawRoute(map, orginLat, orginLng, destinationLat, destinationLng, route) {
    console.info('drawRoute....',orginLat, orginLng, destinationLat, destinationLng)
    requestDirections(map, orginLat, orginLng, destinationLat, destinationLng, 0, true, route);
}

function requestDirections(map, startlat, startlng, endlat, endlng, routeToDisplay, main_route, route) {

    /*$('#fromLat').val(startlat);
    $('#fromLng').val(startlng);
    $('#toLat').val(endlat);
    $('#toLng').val(endlng);
    $('input').trigger('input');*/
    var start = new google.maps.LatLng(startlat,startlng);
    var end = new google.maps.LatLng(endlat,endlng);
    var waypts = [];

    console.info('start...',start);
    console.info('start...',start);
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
    };

    if (route !== null && route.waypoints !== null) {
        for (var lat in route.waypoints) {
            if (route.waypoints.hasOwnProperty(lat)) {
                var lng = route.waypoints[lat];
                // var lat = parseFloat(key);
                console.info('latlng...', lat, lng);
                waypts.push({ location: new google.maps.LatLng(lat, lng), stopover: true})
            }
        }
        request.waypoints = waypts;
    } else {
        request.provideRouteAlternatives = main_route;
    }

    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            if(main_route) {
                var rendererOptions = getRendererOptions(true);
                console.info('result....',result);
                renderDirections(map, result, rendererOptions, 0);

                if (route === null) {
                    //optionalRoute
                    var options = [];
                    for (var i = 0; i < result.routes.length; i++) {
                        options.push({text: result.routes[i].summary, value: i});
                    }


                    $('#selectRoute').selectBoxIt({
                        theme: "bootstrap",
                        autoWidth: false,
                        populate: {data: options}
                    });
                    var stopLeft = $('#floating-panel-select').width() - 5;
                    $('#createStop').css("left", stopLeft);

                    $('#selectRoute').on("change", function () {
                        directionsRenderer.setRouteIndex(parseInt($(this).val()));
                        var stopLeft = $('#floating-panel-select').width() - 5;
                        $('#createStop').css("left", stopLeft);
                    });
                }
            } else {
                var rendererOptions = getRendererOptions(false);
                renderDirections(map, result, rendererOptions, routeToDisplay);
            }
        }
    });
}

function getRendererOptions(main_route) {
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
    var rendererOptions = {draggable: true, suppressMarkers: _suppressMarkers, polylineOptions: polylineOptions};
    return rendererOptions;
}

function renderDirections(map, result, rendererOptions, routeToDisplay) {
    console.info('map....',map);
    var polylineOptions = {
        path: [],
        strokeColor: '#00458E',
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

    // create new renderer object
    directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);

    polylines[routeToDisplay] = polyline;
    directionsRenderer.setMap(map);
    directionsRenderer.setDirections(result);
    // directionsRenderer.setRouteIndex(routeToDisplay);
    alternateRoutes[routeToDisplay] = directionsRenderer;

    google.maps.event.addListener(directionsRenderer, 'directions_changed', function(e) {
        var currentPolyline = polylines[directionsRenderer.routeIndex];
        currentPolyline.setOptions(dragPolylineOptions);
        currentPolyline.setPath([]);
        currentPolyline.setMap(null);
        directionsRenderer.polylineOptions = dragPolylineOptions;
        dragPolyline(map, currentPolyline, directionsRenderer);

        placeIDs = {};
        var geo_wp = directionsRenderer.directions.geocoded_waypoints;
        for (ind = 0;ind < geo_wp.length; ind++) {
            getLocationFromPlaceId(geo_wp[ind].place_id, function(latlng) {
                placeIDs[latlng.lat()] = latlng.lng()+'';
            });
        }
        $("#selectRoute").selectBoxIt('disable');
        // directionsRenderer.setDirections(directionsRenderer.directions);
    });

    $('#createStop').click(function(){
        var c_waypoints = directionsRenderer.directions.routes[0].legs[0].via_waypoints;
        createMarker(map, c_waypoints[0], 'Stop', '')//map, latlng, label, html
    });

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
    // var routemiddle = response.dragResult.routes[0].legs[0].steps[0].path.length / 2;
    // map.setCenter(response.dragResult.routes[0].legs[0].steps[0].path[routemiddle]);
    // map.setZoom(13);
}


function drawPolyline(map, polyline, route) {
    var bounds = new google.maps.LatLngBounds();
    // var route = response.routes[0];
    startLocation = new Object();
    endLocation = new Object();

    var path = route.overview_path;
    var legs = route.legs;
    for (i = 0; i < legs.length; i++) {
        if (i === 0) {
            startLocation.latlng = legs[i].start_location;
            startLocation.address = legs[i].start_address;
            //   marker = createMarker(legs[i].start_location, "start", legs[i].start_address, "green");
        }
        endLocation.latlng = legs[i].end_location;
        endLocation.address = legs[i].end_address;
        var steps = legs[i].steps;
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
    polyline.setMap(map);
    map.fitBounds(bounds)
}