/**
 * Created by bharatkumarr on 28/04/17.
 */


const googleUrl = 'http://maps.google.com/maps/api/js?sensor=false&key=AIzaSyBDnvaOtbnt5Eo-YpiMri9NfdsSRMIam_I&libraries=geometry,places&ext=.js&callback=googleAPILoaded';
const typeahead_addresspicker = '../../../../../public/assets/js/plugins/pickers/location/typeahead_addresspicker.js';
const autocomplete_addresspicker = '../../../../../public/assets/js/plugins/pickers/location/autocomplete_addresspicker.js';
const location = '../../../../../public/assets/js/plugins/pickers/location/location.js';
const picker_location = '../../../../../public/assets/js/pages/picker_location.js';

declare var jQuery: any;
declare function googleAPILoaded(): void;


export class GoogleAPI {
    private loadAPI: Promise<any>;
    public loadedAPI: boolean;

    constructor(){
        this.loadedAPI = false;
        this.loadAPI = new Promise((resolve) => {
            console.log('callback __onGoogleLoaded loading....');
            //window['__onGoogleLoaded'] = (ev:any) => {
                //console.log('gapi loaded', ev);
                resolve(window['google']);
                // this.loadedAPI= true;
            //}
            this.loadScript();
        });
    }

    public loadMap(){
        console.info('loadMap....');
        return this.loadAPI.then((gapi) => {
            console.log('gapi..this.loadedAPI......',this.loadedAPI);
            if (!this.loadedAPI) {
                console.info('if....');
                this.loadedAPI= true;
                this.updateDependecy(typeahead_addresspicker);
                this.updateDependecy(autocomplete_addresspicker);
                this.updateDependecy(location);
                // this.updateDependecy(picker_location);
            }
        });
    }

    private updateDependecy(url: string) {
        let node = document.createElement('script');
        node.src = url;
        node.type = 'text/javascript';
        // node.async = true;
        // node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
    }

    public enableLocationPicker(location: any) {
        jQuery('#us3').locationpicker({
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
            onchanged: function (currentLocation:any, radius:any, isMarkerDropped:any) {
                alert("Location changed. New location (" + currentLocation.latitude + ", " + currentLocation.longitude + ")");
            }
        });

    }

    public loadScript(){
        if (window['google'] !== undefined) {
            this.loadedAPI= true;
            return;
        }
        console.log('loading.window.google...', window['google']);

        let node = document.createElement('script');
        node.src = googleUrl;
        node.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(node);

    }
}