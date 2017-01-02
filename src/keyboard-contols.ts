import { Lander } from './lander';
import { RotationDirection, EngineState } from './lander';

// UGH, internal state :(
let rotation: RotationDirection;
let engine: EngineState;

export function initKeyboardControls(lander: Lander) {
    rotation = lander.rotation;
    engine = lander.engine;
    document.addEventListener('keyup', (e) => keyup(e));
    document.addEventListener('keydown', (e) => keydown(e));
}

export function applyCommands(lander: Lander): Lander {
    return new Lander(lander.position, lander.velocity, lander.angle, rotation, lander.rotationSpeed, engine);
}

function keyup(event) {
    switch (event.keyCode) {
        case 37:
        case 39:
            // Right Arrow key
            rotation = "off";
            break;
        case 38:
        case 40:
            // Up Arrow key
            engine = "off";
            break;
    }
}

function keydown(event) {
    switch (event.keyCode) {
        case 37:
            // Left Arrow key
            rotation = "ccw";
            break;
        case 39:
            // Right Arrow key
            rotation = "cw";
            break;
        case 38:
            // Up Arrow key
            engine = "full";
            break;
        case 40:
            // Down
            engine = "half";
            break;
    }
}
