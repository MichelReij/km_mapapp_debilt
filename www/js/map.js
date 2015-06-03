var watchID = 0;


var map = L.map('map').setView([52.10451, 5.17537], 15);
		
		L.tileLayer('http://www.kunstmarktdebilt.nl/km_map/{z}/{x}/{y}.png', {
			minZoom: 8,
			maxZoom: 19,
			attribution: 'Kunstmarkt de Bilt',
			tms: true			
			}).addTo(map);
			
		L.control.scale({imperial: false}).addTo(map);
		
               function popUp(f,l){
                    var out = [];
                    var userProp = "";
                    if (f.properties){
                        for(key in f.properties){                         
                            userpropNoPlus = f.properties[key].toString().replace(/\+/g,' ');
                            userProp =decodeURIComponent(userpropNoPlus);                          
                            out.push(key+": "+userProp);
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
               // Creates a red marker with the coffee icon
                var mapMarker = L.icon({
                  iconUrl: 'img/art_gallery.png',
                  iconSize:     [20, 20], // size of the icon
                  iconAnchor:   [5, 5], // point of the icon which will correspond to marker's location
                  popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor

                });

                var geojsonAjaxLayer = new L.GeoJSON.AJAX("data/km_map_json.json",
                    {   onEachFeature: popUp,
                        pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {icon: mapMarker});
			}			
                    });
                 geojsonAjaxLayer.addTo(map);
                 
                 /**
                  * start dynamic location
                  */
                 //map.locate({watch: true, enableHighAccuracy: true});
                 
                 function onLocationFound(currPosition) {
                    L.circle(currPosition, 4).addTo(map);
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
                function onSuccess(position) {

                    var latlng = L.latLng(position.coords.latitude, position.coords.longitude);
                    onLocationFound(latlng);
                    console.log('Latitude: '          + position.coords.latitude          + '\n' +
                          'Longitude: '         + position.coords.longitude         + '\n' +
                          'Altitude: '          + position.coords.altitude          + '\n' +
                          'Accuracy: '          + position.coords.accuracy          + '\n' +
                          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                          'Heading: '           + position.coords.heading           + '\n' +
                          'Speed: '             + position.coords.speed             + '\n' +
                          'Timestamp: '         + position.timestamp                + '\n');
                }

                // onError Callback receives a PositionError object
                //
                function onError(error) {
                    console.log('code: '    + error.code    + '\n' +
                          'message: ' + error.message + '\n');
                }

                // Options: throw an error if no update is received every 30 seconds.
                //
                //var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
