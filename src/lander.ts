import { Vector, Point } from './geometry';
import Physics from './physics';

export type EngineState = "off" | "half" | "full";

export type RotationDirection = "off" | "cw" | "ccw";

export default class Lander {
    width = 12
    height = 16
    thrust = 0.1
    position = new Point(250, 250)
    angle = 0
    rotation: RotationDirection = "off"
    rotationSpeed = 0
    velocity = new Vector(0, 0)
    engine: EngineState = "off"
    geometry: Point[] = []
    flameGeometry: Point[] = []

    constructor(public physics: Physics) { }

    public tick() {
        this.rotationSpeed = this.physics.rotate(this.rotation, this.rotationSpeed);
        this.angle = this.physics.angle(this.angle, this.rotationSpeed);
        this.position = this.physics.travel(this.position, this.velocity);
        this.velocity = this.physics.accelerate(this.velocity, this.thrust, this.angle, this.engine);
        this.geometry = [
            this.getPoint("bl"),
            this.getPoint("tl"),
            this.getPoint("tr"),
            this.getPoint("br")
        ];
        this.updateFlame();

        this.physics.collide(this);
    }

    protected updateFlame() {
        if (this.engine === "off") {
            this.flameGeometry = [];
            return;
        }

        this.flameGeometry = [
            new Point(
                this.position.x + this.width / 3,
                this.position.y + this.height / -2)
                .rotate(this.position, this.angle),
            new Point(
                this.position.x,
                this.position.y + this.height * -(0.7 + Math.random()))
                .rotate(this.position, this.angle),
            new Point(
                this.position.x + this.width / -3,
                this.position.y + this.height / -2)
                .rotate(this.position, this.angle)
        ];
    }

    protected getPoint(name: "bl" | "tl" | "tr" | "br"): Vector {
        switch (name) {
            case "bl":
                return new Point(
                    this.position.x + this.width / -2,
                    this.position.y + this.height / -2)
                    .rotate(this.position, this.angle);
            case "br":
                return new Point(
                    this.position.x + this.width / 2,
                    this.position.y + this.height / -2)
                    .rotate(this.position, this.angle);
            case "tl":
                return new Point(
                    this.position.x + this.width / -2.4,
                    this.position.y + this.height / 2)
                    .rotate(this.position, this.angle);
            case "tr":
                return new Point(
                    this.position.x + this.width / 2.4,
                    this.position.y + this.height / 2)
                    .rotate(this.position, this.angle);
        }
    }

}
