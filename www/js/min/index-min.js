var app={initialize:function(){this.bindEvents()},bindEvents:function(){document.addEventListener("deviceready",this.onDeviceReady,!1)},onDeviceReady:function(){app.receivedEvent("deviceready"),alert("Boe"),$("#MapIcon").on("click",function(){$("#Map").toggle()});var e=L.map("Map").setView([52.104,5.175],13);L.tileLayer("https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png",{maxZoom:18,attribution:'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="http://mapbox.com">Mapbox</a>',id:"examples.map-i875mjb7"}).addTo(e)},receivedEvent:function(e){var t=document.getElementById(e),i=t.querySelector(".listening"),a=t.querySelector(".received");i.setAttribute("style","display:none;"),a.setAttribute("style","display:block;"),console.log("Received Event: "+e)}};app.initialize();