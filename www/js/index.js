/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
	   if (this.isApp()) {
		   // We draaien binnen de app
	      this.bindEvents();
	   } else {
		   // We draaien vanaf een webserver
		   this.onDeviceReady();
	   }

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onSuccess: function (position) {
        console.log('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');

    },

    onError: function (error) {
        console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

   	$('#MapIcon').on('click', function() {
	   	if ($("#map").is(":visible")) {
		   	$('#map').hide();
		   	$('#SiteContainer').show();
	   	} else {
		   	$('#map').show();
		   	$('#SiteContainer').hide();		   	
	   	}
  		});  
  				
  		$('#map').hide();

      watchID = navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });

      app.receivedEvent('deviceready');


               
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      if (this.isApp()) {
  			var parentElement = document.getElementById(id);
  			var listeningElement = parentElement.querySelector('.listening');
  			var receivedElement = parentElement.querySelector('.received');
  			
  			listeningElement.setAttribute('style', 'display:none;');
  			receivedElement.setAttribute('style', 'display:block;');
  			
  			console.log('Received Event: ' + id);
  		}
    },
    
    isApp: function() {
	   if (document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1) {
		   // We draaien binnen de app
	      return true;
	   } else {
		   // We draaien vanaf een webserver
		   return false;
	   }
    }
};

app.initialize();