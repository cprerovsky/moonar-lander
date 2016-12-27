import Vector from './vector';

const GRAVITY = -0.02;

export default class Lander {
    width = 12
    height = 16
    thrust = 0.1
    position = new Vector(250, 250);
    geometry: Vector[] = [];
    angle = 0
    velocity = new Vector();
    engine: "off" | "half" | "full"
    rotate: "off" | "left" | "right"

    constructor() {
        this.engine = "off";
        this.rotate = "off";
    }

    public tick() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.rotate === "right") {
            this.angle += Math.PI / 180 * 0.5;
        }
        else if (this.rotate === "left") {
            this.angle -= Math.PI / 180 * 0.5;
        }

        if (this.engine !== "off") {
            this.velocity.x += this.thrust * Math.sin(-this.angle) * -1;
            this.velocity.y += this.thrust * Math.cos(this.angle) * -1;
        }
        this.velocity.y -= GRAVITY;
        this.geometry = [
            this.getPoint("bl"),
            this.getPoint("tl"),
            this.getPoint("tr"),
            this.getPoint("br")
        ];
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
