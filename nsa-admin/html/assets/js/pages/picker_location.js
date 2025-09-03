/* ------------------------------------------------------------------------------
*
*  # Location pickers
*
*  Specific JS code additions for picker_location.html page
*
*  Version: 1.0
*  Latest update: Aug 1, 2015
*
* ---------------------------------------------------------------------------- */

function enableLocationPicker(location) {
    $(function () {
        $('#us3').locationpicker({
            // location: {latitude: 47.494293, longitude: 19.054151899999965},
            location: location,
            radius: 300,
            scrollwheel: false,
            inputBinding: {
                latitudeInput: $('#us3-lat'),
                longitudeInput: $('#us3-lon'),
                radiusInput: $('#us3-radius'),
                locationNameInput: $('#us3-address')
            },
            enableAutocomplete: true,
            onchanged: function (currentLocation, radius, isMarkerDropped) {
                alert("Location changed. New location (" + currentLocation.latitude + ", " + currentLocation.longitude + ")");
            }
        });
    });
}
