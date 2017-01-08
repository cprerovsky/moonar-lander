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
                { rotation: "ccw", tick: 20 },
                { rotation: "off", tick: 25 },
                { engine: "off", tick: 150 },
                { engine: "full", tick: 180 },
                { engine: "off", tick: 250 },
                { engine: "full", tick: 350 },
                { engine: "off", tick: 500 },
                { engine: "full", tick: 700 },
                { engine: "off", tick: 1000 },
            ] }));
        }
    };
    this.register = function () {
        ws.send(JSON.stringify({ token: token, name: name }));
    }
}

var clients = [new Client("Michael")]; //, new Client("Norbert"), new Client("Florian")];
setTimeout(() => {
    clients.map((client) => client.register());
}, 1000);