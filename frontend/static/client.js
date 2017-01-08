"use strict";
function Client(name) {
    var name = name;
    var token = '';
    var ws = new WebSocket("ws://localhost:4711");
    ws.onerror = function (e) {
        console.error(this.name, msg.data);
    };
    ws.onmessage = function (msg) {
        let data = JSON.parse(msg.data);
        if (data.token) token = data.token;
        console.log(name, msg.data);
    };
    this.register = function () {
        ws.send(JSON.stringify({ token: token, name: name }));
    }
}

var clemens = new Client("Clemens");
var norbert = new Client("Norbert");
var florian = new Client("Florian");
setTimeout(() => {
    clemens.register();
    norbert.register();
    florian.register();
}, 1000);