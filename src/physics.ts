import { Vector, dot, Geometry, subtract, length, normalA, multiply } from './geometry';
import { EngineState, RotationDirection } from './lander';
import { isOverlap } from './geometry';
import Lander from './lander';

const MAX_ROTATION_SPEED = 0.2
const ROTATION_DAMPING = 0.0001
const ROTATION_ACCELERATION = 0.002
const FRICTION = 0.3
const RESTITUTION = 0.7
const GRAVITY = 0.02

/**
 * collision detection between lander vehicle and ground geometry
 */
export function collide(lander: Lander, landerGeometry: Geometry, groundGeometry: Geometry) {
    let collisions = isOverlap(landerGeometry, groundGeometry);
    if (collisions.length !== 0) {
        let wallVector = subtract(collisions[0].segmentEnd, collisions[0].segmentStart)
        lander.velocity = this.bounce(lander.velocity, wallVector, this.FRICTION, this.RESTITUTION);
        // stop motion at all if lander is moving super slow
        if (length(lander.velocity) < 0.2) lander.velocity = new Vector(0, 0);
        // attempt to correct y-position to not get stuck in terrain
        lander.position.y += 0.3;
        // update rotation based on impact
        if (collisions[0].point.x < lander.position.x) {
            lander.rotationSpeed -= 0.03 * length(lander.velocity);
        } else {
            lander.rotationSpeed += 0.03 * length(lander.velocity);
        }
    }
}

/**
 * update rotation speed
 */
export function rotate(rotation: RotationDirection, rotationSpeed: number): number {
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

/**
 * update rotation angle
 */
export function angle(angle: number, rotation: number) {
    return angle + rotation;
}

/**
 * use the engine to accelerate. returns a new velocity vector
 */
export function accelerate(velocity: Vector, thrust: number, angle: number, engine: EngineState): Vector {
    let vx = velocity.x;
    let vy = velocity.y;
    if (engine !== "off") {
        let t = (engine === "full") ? thrust : thrust * 0.6;
        vx = velocity.x + t * Math.sin(-angle);
        vy = velocity.y + t * Math.cos(angle);
    }
    vy -= GRAVITY;
    return new Vector(vx, vy);
}

export function position(newPos?: Vector): Vector {
    return newPos.x > 5 ? newPos : new Vector(5, newPos.y);
}

/**
 * calculate resulting speed vector when bouncing off a wall
 */
export function bounce(vector: Vector, wall: Vector): Vector {
    let normal = normalA(wall);
    let u = multiply(normal, dot(vector, normal) / dot(normal, normal))
    let w = subtract(vector, u);
    return subtract(multiply(w, FRICTION), multiply(u, RESTITUTION));

    // --- TEST IMPLEMENTATION FOR REFERENCE ---
    // let origin = new Vector();
    // let v = new Vector(400, 300);
    // draw(ctx, [origin, v], "white");

    // let off = new Vector(400, 0);
    // let wall = new Vector(50, 200);
    // draw(ctx, [off, wall.add(off)], "grey");

    // let n = wall.normalA();
    // let wallOff = wall.add(off);
    // draw(ctx, [wallOff, n.add(wallOff)], "red");

    // let u = n.multiply(dot(v, n) / dot(n, n));
    // draw(ctx, [wallOff, u.add(wallOff)], "blue");

    // let w = v.subtract(u);
    // draw(ctx, [wallOff, w.add(wallOff)], "green");

    // // So the velocity after the collision is v′ = f w − r u
    // let va = w.subtract(u);
    // draw(ctx, [wallOff, va.add(wallOff)], "pink");
}
