"use strict";
var commands_1 = require("./commands");
function initKeyboardControls(cb) {
    document.addEventListener('keyup', function (e) { cb(keyup(e)); });
    document.addEventListener('keydown', function (e) { cb(keydown(e)); });
}
exports.initKeyboardControls = initKeyboardControls;
function keyup(event) {
    switch (event.keyCode) {
        case 37:
        case 39:
            return new commands_1.Command(null, "off");
        case 38:
        case 40:
            return new commands_1.Command("off");
    }
}
function keydown(event) {
    switch (event.keyCode) {
        case 37:
            return new commands_1.Command(null, "ccw");
        case 39:
            return new commands_1.Command(null, "cw");
        case 38:
            return new commands_1.Command("full");
        case 40:
            return new commands_1.Command("half");
    }
}
//# sourceMappingURL=keyboard-controls.js.map