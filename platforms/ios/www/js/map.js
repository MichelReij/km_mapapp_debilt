var watchID = 0;


var map = L.map('map').setView([52.10451, 5.17537], 15);

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




function popUp(f, l) {
    var out = [];
    var userProp = "";
    if (f.properties) {
        for (key in f.properties) {
            userpropNoPlus = f.properties[key].toString().replace(/\+/g, ' ');
            userProp = decodeURIComponent(userpropNoPlus);
            out.push(key + ": " + userProp);
        }
        l.bindPopup(out.join("<br />"));
    }
}

/** var geojsonMarkerOptions = {
 radius: 4,
 fillColor: "#ff7800",
 color: "#000",
 weight: 1,
 opacity: 1,
 fillOpacity: 0.8
 };
 **/
// Creates kraam marker
var mapMarker = L.icon({
    iconUrl: 'img/art_gallery.png',
    iconSize: [20, 20], // size of the icon
    iconAnchor: [5, 5], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor

});

var directionMarker = L.icon({
    iconUrl: 'img/track.png',
    iconSize: [20, 20], // size of the icon             
});
var kraamPositions = [];
var geojsonAjaxLayer = new L.GeoJSON.AJAX("data/km_map_json.json",
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
var panOn = true;
var panControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.backgroundColor = 'white';
        container.style.backgroundSize = '26px 26px';
        container.style.backgroundImage = 'url(img/panning_on.png)';
        container.style.width = '26px';
        container.style.height = '26px';
        container.innerHTML ='<a class=\"custom_icon_control" href=\"#\" title=\"automatisch verschuiven centrum kaart\"></a>';
        

        container.onclick = function () {
            if (panOn) {
                container.style.backgroundImage = 'url(img/panning_off.png)';
                panOn = false;
            } else {
                container.style.backgroundImage = 'url(img/panning_on.png)';
                panOn = true;
            }

        };

        return container;
    }
});

map.addControl(new panControl());

//auto popup control

var autoInfoOn = true;
var autoInfoControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.backgroundColor = 'white';
        container.style.backgroundSize = '26px 26px';
        container.style.backgroundImage = 'url(img/information_on.png)';
        container.style.width = '26px';
        container.style.height = '26px';
        container.innerHTML ='<a class=\"custom_icon_control" href=\"#\" title=\"automatische kraaminformatie\"></a>';
        

        container.onclick = function () {
            if (autoInfoOn) {
                container.style.backgroundImage = 'url(img/information_off.png)';
                autoInfoOn = false;
            } else {
                container.style.backgroundImage = 'url(img/information_on.png)';
                autoInfoOn = true;
            }

        };

        return container;
    }
});

map.addControl(new autoInfoControl());

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

//map.on('locationfound', onLocationFound);

/**	
 L.geoJson(geoJsonFeatureColl, {
 onEachFeature: onEachFeature,
 pointToLayer: function (feature, latlng) {
 return L.circleMarker(latlng, geojsonMarkerOptions);
 }			
 }).addTo(map);
 **/
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
