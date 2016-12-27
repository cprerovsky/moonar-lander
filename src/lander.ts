const GRAVITY = -0.02;

export class Vector {
    constructor(public x: number = 0, public y: number = 0) { }
    rotate(angle) {
        return new Vector(
            this.y * Math.sin(angle) + this.x * Math.cos(angle),
            this.y * Math.cos(angle) - this.x * Math.sin(angle)
        );
    }
}

export default class Lander {
    width = 12
    height = 16
    thrust = 0.1
    position = new Vector(50, 50);
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
    }

    protected getPoint(name: "bl" | "ul" | "ur" | "br"): Vector {
        switch (name) {
            case "bl":
                return new Vector(
                    this.position.x + this.width / -2,
                    this.position.y + this.height / 2)
                    .rotate(this.angle);
            case "br":
                return new Vector(
                    this.position.x + this.width / 2,
                    this.position.y + this.height / 2)
                    .rotate(this.angle);
            case "ul":
                return new Vector(
                    this.position.x + this.width / -2.4,
                    this.position.y + this.height / -2)
                    .rotate(this.angle);
            case "ur":
                return new Vector(
                    this.position.x + this.width / 2.4,
                    this.position.y + this.height / -2)
                    .rotate(this.angle);
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);

        ctx.moveTo(this.width / -2, this.height / 2);
        ctx.lineTo(this.width / -2.4, this.height / -2);
        ctx.lineTo(this.width / 2.4, this.height / -2);
        ctx.lineTo(this.width / 2, this.height / 2);
        ctx.fillStyle = "grey";
        ctx.fill();

        // ctx.rect(this.width * -0.5, this.height * -0.5, this.width, this.height);
        ctx.closePath();

        // Draw the flame if engine is on
        if (this.engine !== "off") {
            ctx.beginPath();
            ctx.moveTo(this.width * -0.5, this.height * 0.5);
            ctx.lineTo(this.width * 0.5, this.height * 0.5);
            ctx.lineTo(0, this.height * 0.5 + Math.random() * 10);
            ctx.lineTo(this.width * -0.5, this.height * 0.5);
            ctx.closePath();
            ctx.fillStyle = "orange";
            ctx.fill();
        }
        ctx.restore();

    }
}