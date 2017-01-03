"use strict";
var geometry_1 = require("./geometry");
var physics_1 = require("./physics");
var THRUST = 0.02;
var Lander = (function () {
    function Lander(pilot, position, velocity, angle, rotation, rotationSpeed, engine, fuel) {
        this.pilot = pilot;
        this.position = position;
        this.velocity = velocity;
        this.angle = angle;
        this.rotation = rotation;
        this.rotationSpeed = rotationSpeed;
        this.engine = engine;
        this.fuel = fuel;
    }
    return Lander;
}());
exports.Lander = Lander;
function tick(no, commands, lander, terrainGeometry) {
    lander = execute(commands, lander);
    var nrotationSpeed = physics_1.rotate(lander.rotation, lander.rotationSpeed);
    var nangle = physics_1.angle(lander.angle, nrotationSpeed);
    var nposition = physics_1.position(geometry_1.add(lander.position, lander.velocity));
    var nvelocity = physics_1.accelerate(lander.velocity, THRUST, nangle, lander.engine);
    var landerGeometry = geometry_1.LANDER_GEOMETRY.map(function (v) { return geometry_1.translate(v, nposition, nangle); });
    var fuel = burn(lander.fuel, lander.engine);
    return physics_1.collide(new Lander(lander.pilot, nposition, nvelocity, nangle, lander.rotation, nrotationSpeed, lander.engine, fuel), landerGeometry, terrainGeometry);
}
exports.tick = tick;
function burn(fuel, engine) {
    if (engine === "half") {
        return fuel - 0.25;
    }
    else if (engine === "full") {
        return fuel - 0.5;
    }
    else {
        return fuel;
    }
}
function execute(commands, lander) {
    var engine = lander.engine;
    var rotation = lander.rotation;
    commands.map(function (c) {
        if (c.engine)
            engine = c.engine;
        if (c.rotation)
            rotation = c.rotation;
        console.log(c);
    });
    return new Lander(lander.pilot, lander.position, lander.velocity, lander.angle, rotation, lander.rotationSpeed, engine, lander.fuel);
}
//# sourceMappingURL=lander.js.map