import { Vector, Point, dot } from './geometry';
import { EngineState, RotationDirection } from './lander';
import { isOverlap } from './geometry';
import Lander from './lander';

export default class Physics {

    public MAX_ROTATION_SPEED = 0.2
    public ROTATION_DAMPING = 0.0002
    public ROTATION_ACCELERATION = 0.002
    public FRICTION = 0.2
    public RESTITUTION = 0.8
    public GRAVITY = 0.02

    constructor(public groundGeometry: Point[]) { }

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
            lander.position.y += 0.2;

            if (lander.velocity.x > this.FRICTION) {
                lander.velocity.x -= this.FRICTION;
            } else if (lander.velocity.x < -this.FRICTION) {
                lander.velocity.y += this.FRICTION;
            } else {
                lander.velocity.x = 0;
            }
        }
    }

    /**
     * create a new position from an existing position and velocity
     */
    travel(position: Point, velocity: Vector): Vector {
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
                return (rotationSpeed <= this.MAX_ROTATION_SPEED) ?
                    rotationSpeed - this.ROTATION_ACCELERATION : rotationSpeed;
            case "ccw":
                return (rotationSpeed >= -this.MAX_ROTATION_SPEED) ?
                    rotationSpeed + this.ROTATION_ACCELERATION : rotationSpeed;
            case "off":
                return (rotationSpeed > 0) ?
                    rotationSpeed - this.ROTATION_DAMPING : rotationSpeed + this.ROTATION_DAMPING;
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
            let t = (engine === "full") ? thrust : thrust * 0.6;
            vx = velocity.x + t * Math.sin(-angle);
            vy = velocity.y + t * Math.cos(angle);
        }
        vy -= this.GRAVITY;
        return new Vector(vx, vy);
    }

    /**
     * calculate resulting speed vector when bouncing off a wall
     */
    public bounceAngle(vector: Vector, wall: Vector, friction: number = 1, restitution: number = 1): Vector {
        let normal = wall.normalA();
        let u = normal.multiply(dot(vector, normal) / dot(normal, normal));
        let w = vector.subtract(u);
        return w.multiply(friction).subtract(u.multiply(restitution));

        // --- TEST IMPLEMENTATION FOR REFERENCE ---
        // let origin = new Point();
        // let v = new Vector(400, 300);
        // draw(ctx, [origin, v], "white");

        // let off = new Point(400, 0);
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
}
