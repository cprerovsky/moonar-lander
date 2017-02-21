"use strict";
function Client(player, keyboard) {
    var player = player;
    var ws = new WebSocket("ws://localhost:4711");
    ws.onerror = function (e) {
        console.error(this.player, msg.data);
    };
    ws.onmessage = function (msg) {
        let data = JSON.parse(msg.data);
        if (data.game === 'start') {
            ws.send(JSON.stringify({
                commands: [
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
                ]
            }));
        }
    };
    ws.onopen = function () { ws.send(JSON.stringify({ player: player })); }
    function rndoff() { return Math.floor(Math.random() * 15) - 7.5 };
}

var clientNames = ["Bernhard", "Clemens", "David", "Florian", "Joan", "Jan", "Johannes", "Leon", "Lisa", "Michael",
    "Norbert", "Patrick", "Philipp", "Stefan", "Simon", "Sebastian", "Tawan", "Thomas"].sort(() => {
        if (Math.random() > 0.5) {
            return 1;
        } else {
            return -1
        }
    });

function addClient() {
    new Client(clientNames.pop());
}

document.getElementById('addclient').addEventListener('click', addClient);
