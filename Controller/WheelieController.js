"use strict";
/*global WheelieView, WheelieModel, */ //needed to stop JSHint from complaining about them

let view = new WheelieView(),
    model = new WheelieModel(),
    controller = null;

function WheelieController() {

    this.openMap = function () {
        view.closeMenu(1);
        model.initMap('map-div');
    };

    this.closeMap = function () {
        model.closeMapLayer();
        view.closeWidget(1);
    };

    //method for showing extra options
    this.extraOptions = function () {
        view.displayExtraFunction();
        model.markRemoveMarker(false);
    };

    //Method for toggling remove/add button
    this.removeAddButton = function () {
        let remove = view.removeButtonText();
        model.markRemoveMarker(remove);
    };

    /**
     * Code by Koni
     *
     * Code for Workout Control
     */
    this.init = function () {
        let timer, state = 0, start, history;

        view.openMenu();

        if (localStorage.getItem('history')) {
            history = JSON.parse(localStorage.getItem('history'));
            console.log(history);
            history.forEach(item => {
                view.historyLoad(item);
            });
        }else {
            history = [];
        }

        view.startCallback(function () {
            switch (state) {
                case 1 && 0:
                    let startPos, newPos, delta;

                    start = Date.now();
                    state = 1;

                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            startPos = position;
                        }, function (error) {
                            window.console.log(error.code);
                        });

                        timer = setInterval(function () {
                            navigator.geolocation.watchPosition(function (position) {
                                newPos = position;
                            }, function (error) {
                                window.console.log(error.code);
                            });

                            delta = Date.now() - start;

                            view.updateTime(model.setTime(delta));
                            view.velocity(model.calcVelocity(newPos));
                            view.distance(model.calcDistance());
                        }, 1000);
                    } else {
                        view.notSupported();
                    }
                    break;
                default:
                    view.alreadyRunning();
                    break;
            }
        });

        view.stopCallback(function () {
            if (view.areYouSure()) {
                state = 0;
                if (view.doYouSave()) {
                    let today = new Date(), newHistory = [];
                    history.push([(today.getDate()+"/"+today.getMonth()+"/"+today.getFullYear()), model.getTimer(), model.calcDistance(), model.getSpeed()]);
                    localStorage.setItem('history', JSON.stringify(history));
                    newHistory[0] = ([(today.getDate()+"/"+today.getMonth()+"/"+today.getFullYear()), model.getTimer(), model.calcDistance(), model.getSpeed()]);
                    view.addToHistory(JSON.stringify(newHistory));
                }
                view.resetWorkout();
                clearInterval(timer);
            }
        });
    };

    /**
     * Code by Emma
     *
     * Code for the chat control
     */
    this.openChat = function () {
        view.closeMenu(2);
        view.initChat();
        model.initChat();

        model.setNewShowPostCallback(function (message) {
            view.addMessage(message);
        });

        view.setCallbackForMessagePost(model.post);
    };

}

controller = new WheelieController();
window.addEventListener("load", controller.init);