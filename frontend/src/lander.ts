import { Vector, add, LANDER_GEOMETRY, translate, Geometry } from './geometry';
import { rotate, angle, accelerate, collide } from './physics';
import { Commands } from './commands';

export type EngineState = "off" | "half" | "full";
export type RotationDirection = "off" | "cw" | "ccw";

const THRUST = 0.025;

export class Lander {
    constructor(
        public readonly token: string,
        public readonly color: string,
        public readonly position: Vector,
        public readonly velocity: Vector,
        public readonly angle: number,
        public readonly rotation: RotationDirection,
        public readonly rotationSpeed: number,
        public readonly engine: EngineState,
        public readonly fuel: number,
        public readonly crashed: boolean,
        public readonly touchdown: boolean) { }
}

/**
 * let the lander run through a full tick; update values and apply physics
 */
export function tick(no: number, commands: Commands, lander: Lander, terrainGeometry: Geometry): Lander {
    lander = execute(commands, lander);
    let nrotationSpeed = rotate(lander.rotation, lander.rotationSpeed);
    let nangle = angle(lander.angle, nrotationSpeed);
    let nposition = add(lander.position, lander.velocity);
    let nvelocity = accelerate(lander.velocity, THRUST, nangle, lander.engine);
    let landerGeometry = LANDER_GEOMETRY.map((v) => translate(v, nposition, nangle));
    let fuel = burn(lander.fuel, lander.engine);
    return collide(
        new Lander(lander.token, lander.color, nposition, nvelocity, nangle, lander.rotation, nrotationSpeed, lander.engine, fuel, lander.crashed, lander.touchdown),
        landerGeometry,
        terrainGeometry);
}

/**
 * check if the lander has landed
 */
export function landed(lander: Lander): boolean {
    return lander.touchdown &&
        lander.engine === 'off' &&
        lander.rotation === 'off' &&
        Math.abs(lander.angle) < 0.785398 &&
        Math.abs(lander.velocity.x) < 0.1 &&
        Math.abs(lander.velocity.y) < 0.1;
}

/**
 * burn fuel from the tank
 */
function burn(fuel: number, engine: EngineState) {
    let f = fuel;
    if (engine === "half") {
        f -= 0.45;
    } else if (engine === "full") {
        f -= 1;
    }
    if (f <= 0) {
        f = 0;
    }
    return f;
}

/**
 * execute commands for a lander
 */
function execute(commands: Commands, lander: Lander): Lander {
    if (lander.crashed) return lander;
    let engine = lander.engine;
    let rotation = lander.rotation;
    let fuel = lander.fuel;
    if (lander.fuel > 0) {
        commands.map((c) => {
            if (c.engine) engine = c.engine;
            if (c.rotation) rotation = c.rotation;
            console.log(c);
        });
    } else {
        engine = "off";
        rotation = "off";
        fuel = 0;
    }
    return new Lander(
        lander.token,
        lander.color,
        lander.position,
        lander.velocity,
        lander.angle,
        rotation,
        lander.rotationSpeed,
        engine,
        fuel,
        lander.crashed,
        lander.touchdown);
}
