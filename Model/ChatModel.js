"use strict";

// Based on Code by Mark Dunlop from University of Strathclyde, Scotland under
//    Creative Commons Attribution licence https://creativecommons.org/licenses/by/4.0/
//    Code sourced from https://personal.cis.strath.ac.uk/mark.dunlop/teaching/

function ChatModel() {

    let newPostCallback = null, lastSeenID = -1,
        postQueue = [],

        getUUID = function () {

            let rand, millies, userid;

            if (localStorage.chat_uuid) {
                localStorage.chat_uuid = localStorage.chat_uuid * 1 + 1;
            } else {
                rand = Math.floor(Math.random() * 10000);
                millies = (new Date()).getMilliseconds() % 100;
                userid = rand * 100 + millies;

                localStorage.chat_uuid = userid * 1000;
            }

            return localStorage.chat_uuid;
        },

        updatePosts = function () {
            let http, repliesJSON, messageJSON, parameters;
            if (newPostCallback !== null) {
                http = new XMLHttpRequest();
                parameters = "startID=" + ((lastSeenID * 1) + 1);
                http.open("GET", "showChats.php?" + parameters, true);
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                http.onreadystatechange = function () {
                    if (http.readyState === 4 && http.status === 200) {
                        repliesJSON = http.responseText.split("\n");
                        repliesJSON.forEach(function (messageTextLine) {
                            if (messageTextLine.length > 0) {
                                messageJSON = JSON.parse(messageTextLine);
                                lastSeenID = messageJSON.insertID;
                                newPostCallback(messageJSON.message);
                            }
                        });
                    }
                };
                http.send();
            }
        },
        doSendPost = function (message, uuid) {
            let http = new XMLHttpRequest(),
                params = "msg=" + encodeURIComponent(message) + "&uid=" + uuid;
            http.open("POST", "postChats.php", true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.onreadystatechange = function () {
                if (http.readyState === 4 && http.status === 200) {
                    if (!isNaN(http.responseText)) {
                        delete postQueue[http.responseText];
                    }
                    window.setTimeout(updatePosts, 100);
                }
            };
            http.send(params);
        },
        checkAndSend = function () {
            let qSize = Object.keys(postQueue).length, k;
            if (qSize > 0) {
                for (k in postQueue) {
                    if (postQueue.hasOwnProperty(k)) {
                        doSendPost(postQueue[k], k);
                    }
                }
            }
        };

    this.setNewShowPostCallback = function(callback){
        newPostCallback = callback;
    };

    this.post = function (message) {
        window.console.log("Posting...");
        postQueue["" + getUUID()] = message;
        setTimeout(checkAndSend, 100);
    };

    this.init = function () {
        setTimeout(updatePosts, 500);
        setInterval(updatePosts, 5000);
        setInterval(checkAndSend, 5000);
    };
}

