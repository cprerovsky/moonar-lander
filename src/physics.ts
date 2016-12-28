import { Vector } from './geometry';
import { EngineState, RotationDirection } from './lander';
import { isOverlap } from './geometry';
import Lander from './lander';

let MAX_ROTATION_SPEED = 0.2;
let ROTATION_DAMPING = 0.0002;
let ROTATION_ACCELERATION = 0.002;

export default class Physics {
    constructor(public groundGeometry: Vector[], public gravity: number = -0.02) { }

    /**
     * collision detection between lander vehicle and ground geometry
     */
    collide(lander: Lander) {
        let collisions = isOverlap(lander.geometry, this.groundGeometry);
        if (collisions.length !== 0) {
            if (lander.velocity.y > 0.5) {
                lander.velocity.y *= -0.6;
            } else {
                lander.velocity.y = 0;
            }
            lander.position.y -= 0.2;
        }
    }

    /**
     * create a new position from an existing position and velocity
     */
    travel(position: Vector, velocity: Vector): Vector {
        return new Vector(
            position.x + velocity.x,
            position.y + velocity.y
        );
    }

    /**
     * update rotation speed
     */
    rotate(rotation: RotationDirection, rotationSpeed: number): number {
        switch (rotation) {
            case "cw":
                return (rotationSpeed <= MAX_ROTATION_SPEED) ?
                    rotationSpeed + ROTATION_ACCELERATION : rotationSpeed;
            case "ccw":
                return (rotationSpeed >= -MAX_ROTATION_SPEED) ?
                    rotationSpeed - ROTATION_ACCELERATION : rotationSpeed;
            case "off":
                return (rotationSpeed > 0) ?
                    rotationSpeed - ROTATION_DAMPING : rotationSpeed + ROTATION_DAMPING;
        }
    }

    /**
     * update rotation angle
     */
    angle(angle: number, rotation: number) {
        return angle + rotation;
    }

    /**
     * use the engine to accelerate. returns a new velocity vector
     */
    accelerate(velocity: Vector, thrust: number, angle: number, engine: EngineState): Vector {
        let vx = velocity.x;
        let vy = velocity.y;
        if (engine !== "off") {
            vx = velocity.x + thrust * Math.sin(-angle) * -1;
            vy = velocity.y + thrust * Math.cos(angle) * -1;
        }
        vy -= this.gravity;
        return new Vector(vx, vy);
    }
}
