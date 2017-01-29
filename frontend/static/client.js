"use strict";
function Client(name, keyboard) {
    var name = name;
    var token = '';
    var ws = new WebSocket("ws://localhost:4711");
    var $out = document.getElementById('out');
    $out.innerText += "new client: " + name + "\n";
    // console.log(name);
    ws.onerror = function (e) {
        console.error(this.name, msg.data);
    };
    ws.onmessage = function (msg) {
        let data = JSON.parse(msg.data);
        // console.log(name, msg.data);
        if (data.token) {
            token = data.token;
        } else if (data.game === "start" && !keyboard) {
            ws.send(JSON.stringify({
                token: token, commands: [
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
    ws.onopen = function () {
        setTimeout(() => {
            // omg this is ugly. timeout is needed to allow to server to send us a token after connecting
            ws.send(JSON.stringify({ token: token, name: name }));
        }, 200);
    }
    function rndoff() { return Math.floor(Math.random() * 20) - 10 };
    if (keyboard) {
        initKeyboardControls((cmd) => {
            ws.send(JSON.stringify({
                token: token, commands: [cmd]
            }));
        });
    }
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

function addKeyboardClient() {
    new Client("KeyboardClient", true);
}

document.getElementById('addclient').addEventListener('click', addClient);
document.getElementById('addkeyboardclient').addEventListener('click', addKeyboardClient);

function initKeyboardControls(cb) {
    document.addEventListener('keyup', (e) => { cb(keyup(e)) });
    document.addEventListener('keydown', (e) => { cb(keydown(e)) })
}

function keyup(event) {
    switch (event.keyCode) {
        case 37:
        case 39:
            // Right Arrow key
            return { rotation: "off" };
        case 38:
        case 40:
            // Up Arrow key
            return { engine: "off" };
    }
}

function keydown(event) {
    switch (event.keyCode) {
        case 37:
            // Left Arrow key
            return { rotation: "ccw" };
        case 39:
            // Right Arrow key
            return { rotation: "cw" };
        case 38:
            // Up Arrow key
            return { engine: "full" };
        case 40:
            // Down
            return { engine: "half" };
    }
}
