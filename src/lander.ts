import { Vector, add, LANDER_GEOMETRY, translate, Geometry } from './geometry';
import { rotate, angle, position, accelerate, collide } from './physics';

export type EngineState = "off" | "half" | "full";
export type RotationDirection = "off" | "cw" | "ccw";

const THRUST = 0.1;

export default class Lander {
    constructor(
        public position: Vector,
        public velocity: Vector,
        public angle: number,
        public rotation: RotationDirection,
        public rotationSpeed: number,
        public engine: EngineState) { }
}

export function tick(lander: Lander, terrainGeometry: Geometry): Lander {
    lander.rotationSpeed = rotate(lander.rotation, lander.rotationSpeed);
    lander.angle = angle(lander.angle, lander.rotationSpeed);
    lander.position = position(add(lander.position, lander.velocity));
    lander.velocity = accelerate(lander.velocity, THRUST, lander.angle, lander.engine);

    let landerGeometry = LANDER_GEOMETRY.map((v) => translate(v, lander.position, lander.angle));
    collide(lander, landerGeometry, terrainGeometry);
    return new Lander(lander.position, lander.velocity, lander.angle, lander.rotation, lander.rotationSpeed, lander.engine);
}
