import { Command } from './commands';
import { add, Geometry, LANDER_GEOMETRY, length, translate, Vector } from './geometry';
import { accelerate, angle, collide, rotate } from './physics';

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
        public readonly player: string,
        public readonly color: string,
        public readonly position: Vector,
        public readonly velocity: Vector,
        public readonly angle: number,
        public readonly tick: number = 0,
        public readonly rotation: RotationDirection = 'off',
        public readonly rotationSpeed: number = 0,
        public readonly engine: EngineState = 'off',
        public readonly fuel: number = 1000,
        public readonly crashed: boolean = false,
        public readonly landed: boolean = false,
        public readonly touchdown: boolean = false) { }
}

/**
 * let the lander run through a full tick; update values and apply physics
 */
export function tick(tickNo: number, commands: Command[], lander: Lander, terrainGeometry: Geometry): Lander {
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
        ncrashed = lander.crashed || length(nvelocity) > 1;
    }
    let nlanded = lander.landed || isLanded(ntouchdown, lander.engine, lander.rotation, nangle, nvelocity);
    return {
        ...lander,
        tick: tickNo,
        position: nposition,
        rotationSpeed: nrotationSpeed,
        velocity: nvelocity,
        angle: nangle,
        fuel: nfuel,
        crashed: ncrashed,
        landed: nlanded,
        touchdown: ntouchdown
    }
}

/**
 * check if the lander has landed
 */
function isLanded(touchdown: boolean,
    engine: EngineState, rotation: RotationDirection, angle: number, velocity: Vector): boolean {
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
function execute(commands: Command[], lander: Lander): Lander {
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
    return { ...lander, rotation: rotation, engine: engine, fuel: fuel }
}
