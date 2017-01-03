"use strict";
var geometry_1 = require("./geometry");
var geometry_2 = require("./geometry");
var lander_1 = require("./lander");
var MAX_ROTATION_SPEED = 0.1;
var ROTATION_ACCELERATION = 0.0005;
var ROTATION_DAMPING = 0.00005;
var FRICTION = 0.3;
var RESTITUTION = 0.7;
var GRAVITY = 0.008;
function collide(lander, landerGeometry, groundGeometry) {
    var collisions = geometry_2.isOverlap(landerGeometry, groundGeometry);
    if (collisions.length === 0) {
        return lander;
    }
    else {
        var wallVector = geometry_1.subtract(collisions[0].segmentEnd, collisions[0].segmentStart);
        var nvelocity = bounce(lander.velocity, wallVector);
        if (geometry_1.length(lander.velocity) < 0.2)
            nvelocity = new geometry_1.Vector(0, 0);
        var npostition = new geometry_1.Vector(lander.position.x, lander.position.y + 0.3);
        var nrotationSpeed = 0;
        if (collisions[0].point.x < lander.position.x) {
            nrotationSpeed -= 0.03 * geometry_1.length(lander.velocity);
        }
        else {
            nrotationSpeed += 0.03 * geometry_1.length(lander.velocity);
        }
        return new lander_1.Lander(lander.pilot, npostition, nvelocity, lander.angle, lander.rotation, nrotationSpeed, lander.engine, lander.fuel);
    }
}
exports.collide = collide;
function rotate(rotation, rotationSpeed) {
    switch (rotation) {
        case "cw":
            return (rotationSpeed <= MAX_ROTATION_SPEED) ?
                rotationSpeed - ROTATION_ACCELERATION : rotationSpeed;
        case "ccw":
            return (rotationSpeed >= -MAX_ROTATION_SPEED) ?
                rotationSpeed + ROTATION_ACCELERATION : rotationSpeed;
        case "off":
            return (rotationSpeed > 0) ?
                rotationSpeed - ROTATION_DAMPING : rotationSpeed + ROTATION_DAMPING;
    }
}
exports.rotate = rotate;
function angle(angle, rotation) {
    return angle + rotation;
}
exports.angle = angle;
function accelerate(velocity, thrust, angle, engine) {
    var vx = velocity.x;
    var vy = velocity.y;
    if (engine !== "off") {
        var t = (engine === "full") ? thrust : thrust * 0.6;
        vx = velocity.x + t * Math.sin(-angle);
        vy = velocity.y + t * Math.cos(angle);
    }
    vy -= GRAVITY;
    return new geometry_1.Vector(vx, vy);
}
exports.accelerate = accelerate;
function position(newPos) {
    return newPos.x > 5 ? newPos : new geometry_1.Vector(5, newPos.y);
}
exports.position = position;
function bounce(vector, wall) {
    var normal = geometry_1.normalA(wall);
    var u = geometry_1.multiply(normal, geometry_1.dot(vector, normal) / geometry_1.dot(normal, normal));
    var w = geometry_1.subtract(vector, u);
    return geometry_1.subtract(geometry_1.multiply(w, FRICTION), geometry_1.multiply(u, RESTITUTION));
}
exports.bounce = bounce;
//# sourceMappingURL=physics.js.map