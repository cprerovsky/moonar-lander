import { Vector, add, LANDER_GEOMETRY, translate, Geometry } from './geometry';
import { rotate, angle, position, accelerate, collide } from './physics';

export type EngineState = "off" | "half" | "full";
export type RotationDirection = "off" | "cw" | "ccw";

const THRUST = 0.1;

export class Lander {
    constructor(
        public readonly position: Vector,
        public readonly velocity: Vector,
        public readonly angle: number,
        public readonly rotation: RotationDirection,
        public readonly rotationSpeed: number,
        public readonly engine: EngineState) { }
}

export function tick(lander: Lander, terrainGeometry: Geometry): Lander {
    let nrotationSpeed = rotate(lander.rotation, lander.rotationSpeed);
    let nangle = angle(lander.angle, lander.rotationSpeed);
    let nposition = position(add(lander.position, lander.velocity));
    let nvelocity = accelerate(lander.velocity, THRUST, lander.angle, lander.engine);
    let landerGeometry = LANDER_GEOMETRY.map((v) => translate(v, nposition, nangle));
    return collide(
        new Lander(nposition, nvelocity, nangle, lander.rotation, nrotationSpeed, lander.engine),
        landerGeometry,
        terrainGeometry);
}
