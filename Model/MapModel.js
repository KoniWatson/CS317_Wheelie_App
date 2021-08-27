"use strict";
/*global OpenLayers, prompt, confirm */ //needed to stop JSHint from complaining about them

function MapModel() {
    //Map code based on code from lecture 8 slide 15
    let openMap, openMapMarkers, remove, drawLine, defaultStyles, lineLayer, position;
    let allMarkers, markers, popups; //Arrays
    let lon, lat;
    let currentLocationMarker;

    //Method for getting the location of the device location, based on code from lecture Service, slide 13
    this.getLocation = function () {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(setCurrentPosition);
            //navigator.geolocation.watchPosition(setCurrentPosition);
        } else {
            lon = -4.2518;
            lat =  55.8642;
        }
    };

    let transformLonLat = function (lon, lat) {
        let fromProjection = new OpenLayers.Projection("EPSG:4326"), //ESPG:4326 - reference coordinate system used by
            // Global Positioning system
            toProjection = new OpenLayers.Projection("EPSG:900913"); //"ESPG:900913 - spherical mercator projection
        return new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);
    };

    let setCurrentPosition = function (position) {
        if(currentLocationMarker !== undefined){
            openMapMarkers.removeMarker(currentLocationMarker); //remove the existing marker;
        }

        lon = position.coords.longitude.toFixed(4);
        lat = position.coords.latitude.toFixed(4);

        position = transformLonLat(lon, lat);
        openMap.setCenter(position, 15); //zoom 15 is main streets
        //create a new marker
        currentLocationMarker = new OpenLayers.Marker(transformLonLat(lon, lat), new OpenLayers.Icon("circleMarker.png"));
        openMapMarkers.addMarker(currentLocationMarker);
    };

    this.searchLocation = function (){
        let searchLocation = document.getElementById("location-input").value;

        if(searchLocation === ""){
            searchLocation = prompt("Please enter a location");
        }

        if(searchLocation !== null && searchLocation !== ""){ //if a location was entered
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    let info = JSON.parse(this.response);
                    position = transformLonLat(info[0].lon, info[0].lat);
                    openMap.setCenter(position);
                }
            };

            xhttp.open("GET", "https://nominatim.openstreetmap.org/search?q=" + searchLocation +
                "&format=json&limit=1");
            xhttp.send();
        }

    };

    //method for updating the position, based on user inputs
    this.updatePosition = function(longitude, latitude) {
        openMap.panTo(transformLonLat(longitude, latitude));
    };



    //slide 16
    OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
        defaultHandlerOptions: {
            'single':true, 'double':false, 'pixelTolerance':0, 'stopSingle':false, 'stopDouble':false
        },

        //extra setting for click handling potentially allowing double click, delay= 100ms,
        // pixel tolerance = 1 to test improvement on app, dbclick tolerance is defalut
        personalisedHandlerOptions: {
            'single': true, 'double': true,  'pixelTolerance': 0, 'dblclickTolerance': 2,
            'stopSingle': false, 'stopDouble': true
        },

        initialize: function(options) {
            this.handlerOptions = OpenLayers.Util.extend({}, this.personalisedHandlerOptions);
            OpenLayers.Control.prototype.initialize.apply(this, arguments);
            this.handler = new OpenLayers.Handler.Click(this,
                {'click': this.clickhandler, 'dblclick': this.doubleclickHandler, 'handleDouble': this.doubleclickHandler },
                this.handlerOptions);
        },

        clickhandler: function (e) {
            let lonlat = openMap.getLonLatFromPixel(e.xy);
            let type = document.getElementById("add").value;
            let text = document.getElementById("text-input").value;
            let foundMarker = null;

            if(remove){
                removeMarker(lonlat);
            } else {
                if(allMarkers.length > 0 && lonlat !== null){ //if there are other markers, and there was a click location
                    foundMarker = findMarker(lonlat);  //Check if marker was pressed, and has text
                }

                if(foundMarker !== null && type !== "text"){
                    let index = foundMarker.position;
                    if(allMarkers[index].type === "text") {
                        if(allMarkers[index].marker.visible()){
                            editPopup(allMarkers[index].marker);
                        } else {
                            allMarkers[index].marker.show();
                        }
                    }
                }else {
                    addMarker(type, text, lonlat);
                }
            }
        },

        //Note: Apparently this doesn't work on the phone for some reason but it works fine on the desktop
        doubleclickHandler: function (e) {
            window.console.log("doubleclicked");

            if(document.getElementById("add").value === "none"){
                let lonlat = openMap.getLonLatFromPixel(e.xy).transform(openMap.getProjectionObject(), "EPSG:4326");
                let xmlhttp = new XMLHttpRequest();

                window.console.log(lonlat);
                xmlhttp.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        infoMessage(JSON.parse(this.response));
                    }
                };

                xmlhttp.open("GET", "https://nominatim.openstreetmap.org/reverse?lat=" +
                    lonlat.lat + "&lon=" + lonlat.lon + "&format=json&zoom=18&extratags=1");

                xmlhttp.send();
            }
        }
    });

    let infoMessage = function (info){
        if(info[0] !== undefined){
            info = info[0];
        }

       let message = "Location " + info.display_name + "\n\n";

       for (let keyValue in info.extratags){
           if(info.extratags.hasOwnProperty(keyValue)){
               if(keyValue === "wikidata" || keyValue === "ref:crs" || keyValue === "brand:wikidata" ||
                   keyValue === "layer" || keyValue === "area"){
                   window.console.log("Extra info for desktop: " + keyValue + ": " + info.extratags[keyValue]);

               } else { //Apparently it had to be this way around
                   message += keyValue + ": " + info.extratags[keyValue] + "\n";
               }
           }
       }
        confirm(message);
    };

    let addMarker = function (type, text, lonlat) {
        switch (type) {
            case "marker":
                drawLine.deactivate();
                let marker = new OpenLayers.Marker(lonlat);
                openMapMarkers.addMarker(marker);
                openMap.setCenter(lonlat);
                allMarkers.push({type: "marker", "marker": marker});
                markers.push(marker);
                break;
            case "text":
                drawLine.deactivate();
                if(text === ""){ //prompt if there is no text
                    text = prompt("Please enter text");
                }

                if(text !== null){
                    let textMarker = new OpenLayers.Marker(lonlat);
                    openMapMarkers.addMarker(textMarker);
                    let popup = new OpenLayers.Popup(null, lonlat, new OpenLayers.Size(80,20), text, true, function () {
                        textMarker.display(true);
                        popup.hide();
                    });
                    popup.autoSize = true; //automatically change size to fit content
                    popup.padding = 5; //set padding of 5 pixels
                    popup.panMapIfOutOfView = true; //automatically pan to the pop up if out view, when drawn
                    openMap.addPopup(popup);
                    popup.updateSize(); //update the size of the marker
                    openMap.setCenter(lonlat);
                    allMarkers.push({type: "text", "marker": popup, "textMarker": textMarker});
                    popups.push({"popup": popup, "marker": textMarker});
                }

                break;
            case "line": //are currently not being stored
                //Line layer based on example from URL: http://dev.openlayers.org/examples/draw-feature.html
                drawLine.activate();
                break;
            default:
                drawLine.deactivate();
                break;
        }
        storeData();
    };

    //function for undoing an event
    this.undoMethod = function () {
        let type = document.getElementById("add").value;
        switch(type){
            case "marker":
                let marker = markers.pop();
                removeMarker(marker.lonlat, true);
                break;
            case "text":
                let popupMarker = popups.pop();
                removeMarker(popupMarker.popup.lonlat, true);
                break;
            case "line":
                drawLine.undo(); //only undoes points not entire lines
                break;
            default:
                break;
        }
    };

    //Find marker
    let findMarker = function (lonlat, undo) {
        let selectedLong;
        let selectedLat;
        if(!undo){ //if this was not called by undo
            selectedLong = Math.trunc(lonlat.lon/100);
            selectedLat = Math.trunc(lonlat.lat/100) - 1; //need to adjust as center is a bit off
        }

        let markerLong;
        let markerLat;
        let foundMarker = {};
        let found = false;

        for(let i = 0; i < allMarkers.length; i++){
            if(!undo){
                markerLong = Math.trunc(allMarkers[i].marker.lonlat.lon/100);
                markerLat = Math.trunc(allMarkers[i].marker.lonlat.lat/100);

                if(selectedLat === markerLat && selectedLong === markerLong){
                    found = true;
                }

            } else {
                if(lonlat === allMarkers[i].marker.lonlat){
                    found = true;
                }
            }

            if(found){
                foundMarker.type = allMarkers[i].type;
                foundMarker.marker = allMarkers[i].marker;
                foundMarker.position = i;
                return foundMarker;
            }
        }
        return null;
    };

    //Functions for removing markers
    this.markRemoveMarker = function (rem) {
        remove = rem;
    };

    let removeMarker = function (lonlat, undo) {
        let foundMarker = findMarker(lonlat, undo);
        if(foundMarker !== null){
            if(foundMarker.type === "marker") {
                openMapMarkers.removeMarker(foundMarker.marker);
            } else if(foundMarker.type === "text") {
                openMap.removePopup(foundMarker.marker);
                openMapMarkers.removeMarker(allMarkers[foundMarker.position].textMarker);
            }
            allMarkers.splice(foundMarker.position, 1); //remove the marker from the array, without leaving a undefined hole
            //only need to remove it from the allMarkers array as that's the only array that gets saved
        }
        storeData(); //Store data to update it
    };

    //function for editing the popup
    let editPopup = function (popup) {
        let text = prompt("Please enter new text", popup.contentHTML);
        popup.setContentHTML(text);
    };

    //function to edit the line colour
    this.editLineColour = function() {
        let colour = document.getElementById("colour").value;
        switch (colour) {
            case "red":
                defaultStyles.strokeColor = "#FF0000";
                break;
            case "blue":
                defaultStyles.strokeColor = "#0000FF";
                break;
            case "green":
                defaultStyles.strokeColor = "#008000";
                break;
            default:
                break;
        }
    };

    let loadMarkers = function () {
        let storedData = JSON.parse(localStorage.getItem("markers"));
        if(storedData !== null){
            for(let i = 0; i < storedData.length; i++) {
                let type = storedData[i].type;
                if(type === "marker"){
                    addMarker(type, "", storedData[i].longlat);
                } else if(type === "text") {
                    addMarker(type, storedData[i].text, storedData[i].longlat);
                }
            }
        } else {
            allMarkers = [];
        }

    };

    //function to storing data
    let storeData = function () {
        let storeData = [];
        if(typeof(Storage) !== "undefined") {
            for(let i = 0; i < allMarkers.length; i++){
                storeData.push({"type": allMarkers[i].type, "text": allMarkers[i].marker.contentHTML,
                    "longlat": allMarkers[i].marker.lonlat});
            }
            localStorage.setItem("markers", JSON.stringify(storeData));
            window.console.log("Markers stored");
        } else {
            window.alert("Markers will not be stored");
        }
    };

    //function to be called when map layer gets closed
    this.closeMapLayer = function () {
        storeData();
        openMap.destroy();
    };


    //Function for getting more information depending on selected location
    this.locationInformation = function () {
        let infoLocation;
        let xmlhttp = new XMLHttpRequest();

        infoLocation = document.getElementById("location-input").value;

        if (infoLocation === ""){ //if no search was made, get location based on center position
            //transforming lon/lat values to WGS84 coordinates based on solution form
            // URL: https://stackoverflow.com/questions/27090189/how-to-get-lat-lng-values-from-openlayers-map
            infoLocation = openMap.getCenter().transform(openMap.getProjectionObject(), "EPSG:4326");
            xmlhttp.open("GET", "https://nominatim.openstreetmap.org/reverse?" + "lat=" +
                infoLocation.lat + "&lon=" + infoLocation.lon + "&format=json&extratags=1&zoom=" + openMap.zoom);
            //Same level of zoom as the map
        } else {
            xmlhttp.open("GET", "https://nominatim.openstreetmap.org/search?q=" + infoLocation +
                "&format=json&limit=1&extratags=1");
        }

        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                infoMessage(JSON.parse(this.response));
            }
        };

        xmlhttp.send();
    };

    //code based on slide 17, lecture 8
    this.init = function (targetDivId) {
        let mapLayer = new OpenLayers.Layer.OSM(),
            click = new OpenLayers.Control.Click();

        //Map initialisation
        openMap = new OpenLayers.Map(targetDivId);
        openMap.addLayer(mapLayer);

        //Marker initialisation
        openMapMarkers = new OpenLayers.Layer.Markers( "Markers" );
        openMap.addLayer(openMapMarkers); //adding marker layer
        lineLayer = new OpenLayers.Layer.Vector("line-layer");
        openMap.addLayer(lineLayer); //adding line layer
        drawLine = new OpenLayers.Control.DrawFeature(lineLayer, OpenLayers.Handler.Path);
        openMap.addControl(drawLine); //add a control to draw line (line layer)

        //location initialisation
        this.getLocation();
        openMap.addControl(click);

        //changing the style of the lines
        defaultStyles = lineLayer.styleMap.styles.default.defaultStyle;
        defaultStyles.strokeWidth = 3; //change width of line

        //new marker arrays:
        allMarkers = [];
        markers = [];
        popups = [];
        loadMarkers(); //load markers

        click.activate(); //activate click functionality

        remove = false; //set to add by default
    };

}