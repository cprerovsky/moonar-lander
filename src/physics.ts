import { Vector } from './geometry';
import { EngineState } from './lander';
import { isOverlap } from './geometry';
import Lander from './lander';

export default class Physics {
    constructor(public groundGeometry: Vector[], public gravity: number = -0.02) {}
    
    /**
     * collision detection between lander vehicle and ground geometry
     */
    collide(lander: Lander) {
        let collisions = isOverlap(lander.geometry, this.groundGeometry);
        if (collisions.length !== 0) {
            lander.velocity.y *= -0.6; 
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
     * update rotation
     */
    rotate(angle: number, rotation: "left" | "right" | "off"): number {
        switch (rotation) {
            case "off":
                return angle;
            case "right":
                return angle + Math.PI / 180;
            case "left":
                return angle - Math.PI / 180;
        }
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
