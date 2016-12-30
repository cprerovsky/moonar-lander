import { Vector, Point } from './geometry';
import Physics from './physics';

export type EngineState = "off" | "half" | "full";

export type RotationDirection = "off" | "cw" | "ccw";

export default class Lander {
    width = 12
    height = 16
    thrust = 0.1
    private _position = new Point(1000, 300)
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
        this.position(this.physics.travel(this.position(), this.velocity));
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

    public position(newPos?: Point): Point {
        if (newPos) {
            this._position = newPos.x > 5 ? newPos : new Point(5, newPos.y);
        }
        return this._position;
    }

    protected updateFlame() {
        if (this.engine === "off") {
            this.flameGeometry = [];
            return;
        }

        let p = this.position();
        this.flameGeometry = [
            new Point(
                p.x + this.width / 3,
                p.y + this.height / -2)
                .rotate(p, this.angle),
            new Point(
                p.x,
                p.y + this.height * -(0.7 + Math.random()))
                .rotate(p, this.angle),
            new Point(
                p.x + this.width / -3,
                p.y + this.height / -2)
                .rotate(p, this.angle)
        ];
    }

    protected getPoint(name: "bl" | "tl" | "tr" | "br"): Vector {
        let p = this.position();
        switch (name) {
            case "bl":
                return new Point(
                    p.x + this.width / -2,
                    p.y + this.height / -2)
                    .rotate(p, this.angle);
            case "br":
                return new Point(
                    p.x + this.width / 2,
                    p.y + this.height / -2)
                    .rotate(p, this.angle);
            case "tl":
                return new Point(
                    p.x + this.width / -2.4,
                    p.y + this.height / 2)
                    .rotate(p, this.angle);
            case "tr":
                return new Point(
                    p.x + this.width / 2.4,
                    p.y + this.height / 2)
                    .rotate(p, this.angle);
        }
    }

}
