import { Vector, dot, Geometry, subtract, length, normalA, multiply } from './geometry';
import { EngineState, RotationDirection } from './lander';
import { isOverlap } from './geometry';
import { Lander } from './lander';

const MAX_ROTATION_SPEED = 0.2
const ROTATION_ACCELERATION = 0.0015
const ROTATION_DAMPING = 0.0001
const FRICTION = 0.3
const RESTITUTION = 0.7
const GRAVITY = 0.01

/**
 * represents the outcome of a collision
 */
export class CollisionResult {
    constructor(
        public readonly velocity: Vector,
        public readonly position: Vector,
        public readonly rotationSpeed: number
    ) {}
}

/**
 * collision detection between lander vehicle and ground geometry
 */
export function collide(position: Vector, velocity: Vector, landerGeometry: Geometry, groundGeometry: Geometry): CollisionResult {
    let collisions = isOverlap(landerGeometry, groundGeometry);
    if (collisions.length === 0) {
        return null;
    } else {
        let wallVector = subtract(collisions[0].segmentEnd, collisions[0].segmentStart)
        let nvelocity = bounce(velocity, wallVector);
        // stop motion at all if lander is moving super slow
        if (length(velocity) < 0.2) nvelocity = new Vector(0, 0);
        // attempt to correct y-position to not get stuck in terrain
        let npostition = new Vector(position.x, position.y + 0.3);
        // update rotation based on impact
        let nrotationSpeed = 0;
        if (collisions[0].point.x < position.x) {
            nrotationSpeed -= 0.03 * length(velocity);
        } else {
            nrotationSpeed += 0.03 * length(velocity);
        }
        return new CollisionResult(nvelocity, npostition, nrotationSpeed);
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
export function accelerate(velocity: Vector, thrust: number, angle: number, engine: EngineState, landed: boolean): Vector {
    let vx = velocity.x;
    let vy = velocity.y;
    if (engine !== "off") {
        let t = (engine === "full") ? thrust : thrust * 0.6;
        vx = velocity.x + t * Math.sin(-angle);
        vy = velocity.y + t * Math.cos(angle);
    }
    // gravity is only applied until the lander has landed
    if (!landed) vy -= GRAVITY;
    return new Vector(vx, vy);
}

/**
 * calculate resulting speed vector when bouncing off a wall
 */
export function bounce(vector: Vector, wall: Vector): Vector {
    let normal = normalA(wall);
    let u = multiply(normal, dot(vector, normal) / dot(normal, normal))
    let w = subtract(vector, u);
    return subtract(multiply(w, FRICTION), multiply(u, RESTITUTION));
}
