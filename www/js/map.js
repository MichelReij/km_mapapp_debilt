var watchID = 0;
//standard event for custom map controls
var clickEvent = "click"; //default event


var map = L.map('map',{zoomControl: false}).setView([52.10451, 5.17537], 15);

//check if touch screen is used
if (L.Browser.touch){
    clickEvent = "touchend";
}

var openStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	zIndex: 1
});

L.tileLayer('http://www.kunstmarktdebilt.nl/km_map/{z}/{x}/{y}.png', {
    minZoom: 8,
    maxZoom: 23,
	maxNativeZoom: 21,
    zIndex: 2,
    opacity: 0.7,
    attribution: 'Kunstmarkt de Bilt',
    tms: true
}).addTo(map);

openStreetMap_Mapnik.addTo(map);

L.control.scale({imperial: false}).addTo(map);

L.control.zoom({position: 'bottomright'}).addTo(map);



/**
 * popup marker for db info
 * @param {jsonMarker} f
 * @param {latlong} l
 * @returns {undefined}
 */
function popUp(f, l) {
    //var out = [];
    //var userProp = "";
    if (f.properties) {
        l.bindPopup(popUpHTML(f.properties));
    }
}
/**
 * html layout for popup marker
 * @param {geojsonData} popProperties
 * @returns {String} html
 */
function popUpHTML(popProperties){
    var htmlOut = "";
    if (popProperties['kunstenaar'].length > 0){
        htmlOut +="<p><b>";
        htmlOut += popProperties['kunstenaar'];
        htmlOut += "</b><p>";
    }
    htmlOut +="<table><tbody>";
    
    if (popProperties['adres'].length > 0){
        htmlOut +="<tr class='popuptr'><td class='popuptd'><img alt='adres' width='28px' src='img/envelop.png'></td><td>";
        htmlOut += decodeURIComponent(popProperties['adres']);
        htmlOut += "</td></tr>";
    }
    if (popProperties['website'].length > 0){
       htmlOut +="<tr class='popuptr'><td class='popuptd'><img alt='website' width='28px' src='img/www_globe.png'></td><td>";
        htmlOut += popProperties['website'];
       htmlOut += "</td></tr>";
    }
    if (popProperties['beschrijving werk'].length > 0 && popProperties['beschrijving werk'].length < 250 ){
        htmlOut +="<tr class='popuptr'><td class='popuptd'><img alt='omschrijving' width='28px' src='img/info.png'></td><td>";
        htmlOut += decodeURIComponent(popProperties['beschrijving werk'].toString().replace(/\+/g, ' '));
       htmlOut += "</td></tr>";
    }
    if (popProperties['kunstvorm'].length > 0){
        htmlOut +="<tr class='popuptr'><td class='popuptd'><img alt='kunstvorm' width='28px' src='img/art.png'></td><td>";
        htmlOut += popProperties['kunstvorm'];
        htmlOut += "</td></tr>";
    }
    if (popProperties['kraamnummer'].length > 0){
        htmlOut +="<tr class='popuptr'><td class='popuptd'><img alt='kraamnummer' width='28px' src='img/art_gallery.png'></img></td><td>";
        htmlOut += popProperties['kraamnummer'];
       htmlOut += "</td></tr>";
    }
    htmlOut += "</tbody></table>";
return htmlOut;
    
}


// get popup data and create popup marker
var mapMarker = L.icon({
    iconUrl: 'img/art_gallery.png',
    iconSize: [30, 30], // size of the icon
    iconAnchor: [5, 5], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor

});

var directionMarker = L.icon({
    iconUrl: 'img/track.png',
    iconSize: [20, 20] // size of the icon             
});
var kraamPositions = [];
var geojsonAjaxLayer = new L.GeoJSON.AJAX("http://www.kunstmarktdebilt.nl/km_app/km_map_json.php",
        {onEachFeature: popUp,
            pointToLayer: function (feature, latlng) {
                var jsonMarker = L.marker(latlng, {icon: mapMarker});
                kraamPositions.push(jsonMarker);
                return jsonMarker;
            }
        });
geojsonAjaxLayer.addTo(map);

/**
 * 
 * custom map controles for panning and automatic popup
 */
/**
 * event function for custom map control
 * switch background image and disable/enable map pan control
 * @param {event} e
 * @returns {undefined}
 */
function changePan (e) {
            if (panOn) {
                panControlAdded.parentElement.style.backgroundImage = 'url(img/panning_off.png)';
                panOn = false;
            } else {
                panControlAdded.parentElement.style.backgroundImage = 'url(img/panning_on.png)';
                panOn = true;
            }

        }
var panOn = true;
var panControl = L.Control.extend({
    options: {
        position: 'bottomright'
    },
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.backgroundColor = 'white';
        container.style.backgroundSize = '35px 35px';
        container.style.backgroundImage = 'url(img/panning_on.png)';
        container.style.width = '35px';
        container.style.height = '35px';
        container.innerHTML ='<a id=\"pancontrol\" class=\"custom_icon_control\" href=\"#\" title=\"automatisch verschuiven centrum kaart\"></a>';
        return container;
    }
});

map.addControl(new panControl());
var panControlAdded=document.getElementById('pancontrol');
panControlAdded.addEventListener(clickEvent,changePan);

//auto popup control
/**
 * event function for info control button
 * changes the background image and disable/enable auto info
 * @param {event} e
 * @returns {undefined}
 */
function changeAutoinfo(e){
    if (autoInfoOn) {
        autoinfoAdded.parentElement.style.backgroundImage = 'url(img/information_off.png)';
        autoInfoOn = false;
    } else {
        autoinfoAdded.parentElement.style.backgroundImage = 'url(img/information_on.png)';
        autoInfoOn = true;
    }
}

var autoInfoOn = true;
var autoInfoControl = L.Control.extend({
    options: {
        position: 'bottomright'
    },
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.backgroundColor = 'white';
        container.style.backgroundSize = '35px 35px';
        container.style.backgroundImage = 'url(img/information_on.png)';
        container.style.width = '35px';
        container.style.height = '35px';
        container.innerHTML ='<a id=\"autoinfo\" class=\"custom_icon_control\" href=\"#\" title=\"automatische kraaminformatie\"></a>';

        return container;
    }
});

map.addControl(new autoInfoControl());
//add event to control
var autoinfoAdded=document.getElementById('autoinfo');
autoinfoAdded.addEventListener(clickEvent,changeAutoinfo);

/**
 * start dynamic location
 */
//map.locate({watch: true, enableHighAccuracy: true});
var positionSet = false;
var posLayer;
function onLocationFound(actualPos) {
    //create pos layer for first time
    if (!positionSet) {
        posLayer = L.marker(actualPos, {icon: directionMarker});
        posLayer.addTo(map);
        positionSet = true;
    } else
            //update position
            {
                posLayer.setLatLng(actualPos);
            }
    posLayer._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + headingDirection + 'deg)';
    if (panOn) {
        map.panTo(actualPos);
    }
    if (autoInfoOn) {

    for (var i = 0; i < kraamPositions.length; i++) {
        var posKraam = kraamPositions[i].getLatLng();
        if (Math.floor(posKraam.distanceTo(actualPos)) < 5) {
            kraamPositions[i].openPopup();
        }
    }
}

}


// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
var headingDirection = 0;
function onSuccess(position) {

    var actualPos = L.latLng(position.coords.latitude, position.coords.longitude);
    headingDirection = Math.floor(position.coords.heading);
    onLocationFound(actualPos);
    /**console.log('Latitude: '          + position.coords.latitude          + '\n' +
     'Longitude: '         + position.coords.longitude         + '\n' +
     'Altitude: '          + position.coords.altitude          + '\n' +
     'Accuracy: '          + position.coords.accuracy          + '\n' +
     'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
     'Heading: '           + position.coords.heading           + '\n' +
     'Speed: '             + position.coords.speed             + '\n' +
     'Timestamp: '         + position.timestamp                + '\n');**/
}

// onError Callback receives a PositionError object
//
function onError(error) {
    console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
}

// Options: throw an error if no update is received every 30 seconds.
//
//var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
