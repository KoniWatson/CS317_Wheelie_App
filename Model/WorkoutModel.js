"use strict";

const minutes = 6;

function WorkoutModel() {
    let time, hrs, min, sec, speed = 0;

    this.setTime = function (delta) {
        time = Math.floor(delta / 1000);

        hrs = Math.floor(time / 3600);
        min = Math.floor(time / 60);
        sec = time % 60;

        if (hrs > 0) {
            min -= minutes * (hrs * 10);
        }

        if (hrs < 10 && min < 10 && sec < 10) {
            return ("0" + hrs + ":0" + min + ":0" + sec);
        } else if (hrs < 10 && min < 10) {
            return ("0" + hrs + ":0" + min + ":" + sec);
        } else if (hrs < 10 && sec < 10) {
            return ("0" + hrs + ":" + min + ":0" + sec);
        } else if (hrs < 10) {
            return ("0" + hrs + ":" + min + ":" + sec);
        } else {
            return (hrs + ":" + min + ":" + sec);
        }
    };

    /**
     * The Javascript implementation is adapted from a script provided
     * by Moveable Type -> http://www.movable-type.co.uk/scripts/latlong.html
     * under a Creative Commons license:
     *
     * @param lon1
     * @param lat1
     * @param lon2
     * @param lat2
     * @returns {number}
     */
    /*this.calcDistance = function (lon1, lat1, lon2, lat2) {
        let R = 6371; // km
        let dLat = (lat2 - lat1).toRad(),
            dLon = (lon2 - lon1).toRad(),
            a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2),
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
            dis = R * c;

        if (dis < 0) {
            dis = dis * (-1);
        }

        distance = distance + dis;
    };
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    };*/

    this.calcDistance = function () {
        return speed / (time * 3600);
    };

    this.calcVelocity = function (pos) {
        speed = pos.coords.speed;

        if (speed !== null) {
            speed = (speed * 18) / 5;
            return speed;
        }
        speed = 0;

        return speed;
    };

    this.getTimer = function () {
        let localHrs, localMin, localSec;

        if (hrs < 10) {
            localHrs = "0" + hrs.toString();
        }else {
            localHrs = hrs;
        }

        if (min < 10) {
            localMin = "0" + min.toString();
        }else {
            localMin = min;
        }

        if (sec < 10) {
            localSec = "0" + sec.toString();
        }else {
            localSec = sec;
        }

        return localHrs + ":" + localMin + ":" + localSec;
    };

    this.getSpeed = function () {
        return speed;
    };
}