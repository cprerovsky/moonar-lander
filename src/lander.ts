import { Vector } from './geometry';
import Physics from './physics';

export type EngineState = "off" | "half" | "full";

export type RotationState = "off" | "left" | "right";

export default class Lander {
    width = 12
    height = 16
    thrust = 0.1
    position = new Vector(250, 250);
    geometry: Vector[] = [];
    angle = 0
    velocity = new Vector();
    engine: EngineState = "off";
    rotate: RotationState = "off";

    constructor(public physics: Physics) { }

    public tick() {
        this.angle = this.physics.rotate(this.angle, this.rotate);
        this.position = this.physics.travel(this.position, this.velocity);
        this.velocity = this.physics.accelerate(this.velocity, this.thrust, this.angle, this.engine);
        this.geometry = [
            this.getPoint("bl"),
            this.getPoint("tl"),
            this.getPoint("tr"),
            this.getPoint("br")
        ];
        // this.physics.collide(this);
    }

    protected getPoint(name: "bl" | "tl" | "tr" | "br"): Vector {
        switch (name) {
            case "bl":
                return new Vector(
                    this.position.x + this.width / -2,
                    this.position.y + this.height / 2)
                    .rotate(this.position, this.angle);
            case "br":
                return new Vector(
                    this.position.x + this.width / 2,
                    this.position.y + this.height / 2)
                    .rotate(this.position, this.angle);
            case "tl":
                return new Vector(
                    this.position.x + this.width / -2.4,
                    this.position.y + this.height / -2)
                    .rotate(this.position, this.angle);
            case "tr":
                return new Vector(
                    this.position.x + this.width / 2.4,
                    this.position.y + this.height / -2)
                    .rotate(this.position, this.angle);
        }
    }

}

        // Draw the flame if engine is on
        // if (this.engine !== "off") {
        //     ctx.beginPath();
        //     ctx.moveTo(this.width * -0.5, this.height * 0.5);
        //     ctx.lineTo(this.width * 0.5, this.height * 0.5);
        //     ctx.lineTo(0, this.height * 0.5 + Math.random() * 10);
        //     ctx.lineTo(this.width * -0.5, this.height * 0.5);
        //     ctx.closePath();
        //     ctx.strokeStyle = "orange";
        //     ctx.stroke();
        // }
