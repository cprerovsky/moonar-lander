"use strict";
var geometry_1 = require("./geometry");
var lander_1 = require("./lander");
var terrain_1 = require("./terrain");
var seedrandom = require("seedrandom");
var render_1 = require("./render");
var keyboard_controls_1 = require("./keyboard-controls");
var ui_1 = require("./ui");
var canvas = document.getElementById("game");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var ctx = canvas.getContext("2d");
var rng = seedrandom("test");
var fgTerrain = terrain_1.terrain(10000, 350, rng, 9, 4);
var bgTerrain = terrain_1.terrain(2500, 350, rng, 8, 3).map(function (p) { return new geometry_1.Vector(p.x * 2, p.y + 50); });
var skybox = render_1.sky(3500, 800);
var lander = new lander_1.Lander('clemens', new geometry_1.Vector(1000, 300), new geometry_1.Vector(0, 0), 0, "off", 0, "off", 1000);
var flagPosition = terrain_1.flag(fgTerrain, rng);
var commands = [];
keyboard_controls_1.initKeyboardControls(function (command) {
    if (command) {
        commands = commands.concat(command);
    }
});
var tickNo = 0;
setInterval(function () {
    tickNo++;
    var exec = commands.filter(function (c) { return !c.tick || c.tick <= tickNo; });
    lander = lander_1.tick(tickNo, exec, lander, fgTerrain);
    if (tickNo % 5 === 0)
        ui_1.updateUi(lander);
    commands = commands.filter(function (c) { return c.tick > tickNo; });
}, 10);
(function nextFrame() {
    requestAnimationFrame(function (t) {
        render_1.render(ctx, lander.position, lander, fgTerrain, bgTerrain, skybox, flagPosition);
        nextFrame();
    });
})();
//# sourceMappingURL=index.js.map