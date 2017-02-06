import { Vector, add, LANDER_GEOMETRY, translate, Geometry, length } from './geometry';
import { rotate, angle, accelerate, collide } from './physics';
import { Commands } from './commands';

/**
 * states the engine can have
 */
export type EngineState = "off" | "half" | "full";

/**
 * states rotation engines can have
 */
export type RotationDirection = "off" | "cw" | "ccw";

/**
 * thrust of the main engine
 */
const THRUST = 0.035;

/**
 * represents a lander
 */
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
        public readonly landed: boolean,
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
    let nvelocity = accelerate(lander.velocity, THRUST, nangle, lander.engine, lander.landed);
    let nfuel = burn(lander.fuel, lander.engine, lander.rotation);
    let ncrashed = lander.crashed;
    let collisionResult = collide(
        nposition,
        nvelocity,
        LANDER_GEOMETRY.map((v) => translate(v, nposition, nangle)),
        terrainGeometry);
    let ntouchdown: boolean = false;
    if (collisionResult) {
        nposition = collisionResult.position;
        nvelocity = collisionResult.velocity;
        nrotationSpeed = collisionResult.rotationSpeed;
        ntouchdown = true;
        ncrashed = lander.crashed || length(nvelocity) > 1;
    }
    let nlanded = lander.landed || isLanded(ntouchdown, lander.engine, lander.rotation, nangle, nvelocity);
    return new Lander(lander.token,
        lander.color,
        nposition,
        nvelocity,
        nangle,
        lander.rotation,
        nrotationSpeed,
        lander.engine,
        nfuel,
        ncrashed,
        nlanded,
        ntouchdown
    );
}

/**
 * check if the lander has landed
 */
function isLanded(touchdown: boolean, engine: EngineState, rotation: RotationDirection, angle: number, velocity: Vector): boolean {
    return touchdown &&
        engine === 'off' &&
        rotation === 'off' &&
        Math.abs(angle) < 0.785398 && // 45°
        Math.abs(velocity.x) < 0.1 &&
        Math.abs(velocity.y) < 0.1;
}

/**
 * burn fuel from the tank
 */
function burn(fuel: number, engine: EngineState, rotation: RotationDirection) {
    let f = fuel;
    if (engine === "half") {
        f -= 0.45;
    } else if (engine === "full") {
        f -= 1;
    }
    if (rotation !== "off") {
        f -= 0.15;
    }
    if (f <= 0) {
        f = 0;
    }
    // TODO: fuel must not be less than 0
    return f;
}

/**
 * execute commands for a lander
 */
function execute(commands: Commands, lander: Lander): Lander {
    let engine = lander.engine;
    let rotation = lander.rotation;
    let fuel = lander.fuel;
    if (fuel < 0) fuel = 0;
    if (fuel === 0 || lander.crashed) {
        engine = "off";
        rotation = "off";
    } else {
        commands.map((c) => {
            if (c.engine) engine = c.engine;
            if (c.rotation) rotation = c.rotation;
        });
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
        lander.landed,
        lander.touchdown);
}
