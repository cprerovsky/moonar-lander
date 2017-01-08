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
        console.log(name, msg.data);
        if (data.token) {
            token = data.token;
        } else if (data.game === "start") {
            console.log(name, msg.data);
            ws.send(JSON.stringify({ token: token, commands: [
                { engine: "full", rotation: "cw" },
                { rotation: "ccw", tick: 20 + rndoff() },
                { rotation: "off", tick: 25 + rndoff() },
                { engine: "off", tick: 150 + rndoff() },
                { engine: "full", tick: 180 + rndoff() },
                { engine: "off", rotation: "ccw", tick: 250 + rndoff() },
                { rotation: "off", tick: 260 + rndoff() },
                { engine: "full", tick: 350 + rndoff() },
                { engine: "off", tick: 500 + rndoff() },
                { engine: "full", tick: 700 + rndoff() },
                { engine: "off", tick: 1000 + rndoff() },
            ] }));
        }
    };
    this.register = function () {
        ws.send(JSON.stringify({ token: token, name: name }));
    }
    function rndoff() { return Math.floor(Math.random() * 20) - 10 };
}

var clients = [
    new Client("Katharina"),
    new Client("Michael"),
    new Client("Norbert"),
    new Client("Florian"),
    new Client("Clemens"),
    new Client("Klaus")
];
setTimeout(() => {
    clients.map((client) => client.register());
}, 1000);