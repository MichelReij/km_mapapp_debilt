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
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
	    
      app.receivedEvent('deviceready');
        		
  		
  		$('#MapIcon').on('click', function() {
			$('#Map').toggle();
		});
      
        
  		var map = L.map('Map').setView([52.104, 5.175], 13);
		
		L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery � <a href="http://mapbox.com">Mapbox</a>',
			id: 'examples.map-i875mjb7'
		}).addTo(map);
		
  		$('#Map').hide();


        
        
        
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