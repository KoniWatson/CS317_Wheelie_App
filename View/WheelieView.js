"use strict";

function WheelieView() {
    let chatHistoryDiv, postForm, postTextField, index = 1;

    /**
     * Code by Koni
     *
     * Application framework
     */
    this.openMenu = function () {
        document.getElementById("startMenu").style.width = "70%";
    };

    this.closeMenu = function (num) {
        document.getElementById("startMenu").style.width = "0%";
        switch (num) {
            case 1:
                document.getElementById("map").style.width = "92%";
                break;
            case 2:
                document.getElementById("chat").style.width = "92%";
                break;
            case 3:
                document.getElementById("weather").style.width = "92%";
                break;
            case 4:
                document.getElementById("workout").style.width = "92%";
                break;
        }
    };

    this.closeWidget = function (num) {
        switch (num) {
            case 1:
                document.getElementById("map").style.width = "0%";
                document.getElementById("startMenu").style.width = "70%";
                break;
            case 2:
                document.getElementById("chat").style.width = "0%";
                document.getElementById("startMenu").style.width = "70%";
                break;
            case 3:
                document.getElementById("weather").style.width = "0%";
                document.getElementById("startMenu").style.width = "70%";
                break;
            case 4:
                document.getElementById("workout").style.width = "0%";
                document.getElementById("startMenu").style.width = "70%";
                break;
            case 5:
                document.getElementById("workoutHistory").style.width = "0%";
                document.getElementById("workout").style.width = "92%";
                break;
        }
    };

    this.closeWorkout = function () {
        document.getElementById("workout").style.width = "0%";
        document.getElementById("workoutHistory").style.width = "92%";
    };

    /**
     * Code by Koni
     *
     * Workout View
     */
    this.startCallback = function (callback) {
        document.getElementById("start").addEventListener("click", callback);
    };

    this.stopCallback = function (callback) {
        document.getElementById("stop").addEventListener("click", callback);
    };

    this.notSupported = function () {
        alert("Geo location is not available on this device!");
    };

    this.alreadyRunning = function () {
        alert("Workout already started!");
    };

    this.areYouSure = function () {
        return confirm("You are about to stop your workout! Click cancel to continue workout!");
    };

    this.doYouSave = function () {
        return confirm("Do you want to save this workout?");
    };

    this.updateTime = function (time) {
        document.getElementById("time").innerHTML = "TIME: <br> <strong>" + time + "</strong>";
    };

    this.resetWorkout = function () {
        document.getElementById("time").innerHTML = "TIME: <br> <strong>00:00:00</strong>";
        document.getElementById("speed").innerHTML = "<strong>0.0</strong>";
        document.getElementById("distance").innerHTML = "<strong>0.0</strong>";
    };

    this.distance = function (dis) {
        document.getElementById("distance").innerHTML = "<strong>" + dis.toFixed(1) + "</strong>";
    };

    this.velocity = function (speed) {
        document.getElementById("speed").innerHTML = "<strong>" + speed.toFixed(1) + "</strong>";
    };

    this.historyLoad = function (history) {
        let li = document.createElement('li'),
            ul = document.getElementById('history');
        li.textContent = history;
        ul.appendChild(li);
    };

    this.addToHistory = function (newHistory) {
        newHistory = JSON.parse(newHistory);
        let li = document.createElement('li'),
            ul = document.getElementById('history');
        li.textContent = newHistory;
        ul.appendChild(li);
    };

    /**
     * Code by Amanda
     *
     * Map View
     */
    this.displayExtraFunction = function () {
        let value = document.getElementById("add").value;
        let text_box = document.getElementById("text-box").classList;
        let undo_button = document.getElementById("undo").classList;
        let remove_button = document.getElementById("remove-marker");
        let colour_select = document.getElementById("colour-div").classList;

        switch (value) {
            case "marker":
                undo_button.add("show-button");
                remove_button.classList.add("show-button");
                if (remove_button.innerText !== "Remove Marker") {
                    remove_button.innerText = "Remove Marker";
                }
                text_box.remove("show");
                colour_select.remove("show");
                break;
            case "text":
                text_box.add("show");
                undo_button.add("show-button");
                remove_button.classList.add("show-button");
                if (remove_button.innerText !== "Remove Marker") {
                    remove_button.innerText = "Remove Marker";
                }
                colour_select.remove("show");
                break;
            case "line":
                undo_button.add("show-button");
                remove_button.classList.remove("show-button");
                text_box.remove("show");
                colour_select.add("show");
                break;
            default:
                text_box.remove("show");
                undo_button.remove("show-button");
                remove_button.classList.remove("show-button");
                colour_select.remove("show");
                break;
        }

    };

    this.removeButtonText = function () {
        let button = document.getElementById("remove-marker");
        if (button.innerText === "Remove Marker") {
            button.innerText = "Add Marker";
            return true;
        } else if (button.innerText === "Add Marker") {
            button.innerText = "Remove Marker";
            return false;
        }
    };

    /**
     * Code by Emma
     *
     * Chat Room View
     */
    this.initChat = function () {
        chatHistoryDiv = document.getElementById("chatHistoryDiv");
        postForm = document.getElementById("chatForm");
        postTextField = document.getElementById("messageText");
        postTextField.focus();
    };

    this.addMessage = function (message) {
        chatHistoryDiv.innerHTML = chatHistoryDiv.innerHTML + "<p>" + message + "</p>";
        chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
    };

    this.setCallbackForMessagePost = function (callback) {
        postForm.addEventListener("submit", function (event) {
            callback(postTextField.value);
            postTextField.value = "";
            postTextField.focus();
            event.preventDefault();
        });
    };

}