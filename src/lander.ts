const GRAVITY = -0.02;

export class Vector {
    constructor(public x: number = 0, public y: number = 0) { }
    rotate(pivot: Vector, angle: number) {
        // http://stackoverflow.com/questions/2259476/rotating-a-point-about-another-point-2d
        // answer by six face
        let sinA = Math.sin(angle);
        let cosA = Math.cos(angle);
        return new Vector(
            cosA * (this.x - pivot.x) - sinA * (this.y - pivot.y) + pivot.x,
            sinA * (this.x - pivot.x) + cosA * (this.y - pivot.y) + pivot.y
        );
    }
}

export default class Lander {
    width = 12
    height = 16
    thrust = 0.1
    position = new Vector(250, 250);
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

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();

        let bl = this.getPoint("bl");
        let tl = this.getPoint("tl");
        let tr = this.getPoint("tr");
        let br = this.getPoint("br");

        ctx.moveTo(bl.x, bl.y);
        ctx.lineTo(tl.x, tl.y);
        ctx.lineTo(tr.x, tr.y);
        ctx.lineTo(br.x, br.y);
        ctx.lineTo(bl.x, bl.y);
        ctx.strokeStyle = "grey";
        ctx.stroke();

        // ctx.rect(this.width * -0.5, this.height * -0.5, this.width, this.height);
        ctx.closePath();

        // Draw the flame if engine is on
        // if (this.engine !== "off") {
        //     ctx.beginPath();
        //     ctx.moveTo(this.width * -0.5, this.height * 0.5);
        //     ctx.lineTo(this.width * 0.5, this.height * 0.5);
        //     ctx.lineTo(0, this.height * 0.5 + Math.random() * 10);
        //     ctx.lineTo(this.width * -0.5, this.height * 0.5);
        //     ctx.closePath();
        //     ctx.fillStyle = "orange";
        //     ctx.fill();
        // }
    }
}