"use strict";

function WheelieModel() {
    //general model
    //declaration of all models
    let map = new MapModel(),
        chat = new ChatModel(),
        workout = new WorkoutModel();

    this.initChat = function () {
        chat.init();
    };

    this.setNewShowPostCallback = function (callback) {
        chat.setNewShowPostCallback(callback);
    };

    this.post = function (message){
        chat.post(message);
    };

    //initialise map:
    this.initMap = function(targetDivId){
        map.init(targetDivId);
    };

    //function for getting the location based on search
    this.searchLocation = function (){
        map.searchLocation();
    };

    //function for panning to current location
    this.currentLocation = function(){
        map.getLocation();
    };

    //functions in order to attempt to reduce the models in the controller
    this.closeMapLayer = function() {
        map.closeMapLayer();
    };

    this.markRemoveMarker = function(remove){
        map.markRemoveMarker(remove);
    };

    this.undoMethod = function () {
        map.undoMethod();
    };

    this.editLineColour = function () {
        map.editLineColour();
    };

    this.locationInformation = function () {
        map.locationInformation();
    };


    /**
     * Code by Koni
     *
     * Call to Workout Model
     */
    this.setTime = function (delta) {
        return workout.setTime(delta);
    };

    this.calcDistance = function () {
        return workout.calcDistance();
    };

    this.calcVelocity = function (pos) {
        return workout.calcVelocity(pos);
    };

    this.getTimer = function () {
        return workout.getTimer();
    };

    this.getSpeed = function () {
        return workout.getSpeed();
    };
}


