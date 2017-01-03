import { Lander } from './lander';
import { RotationDirection, EngineState } from './lander';
import { Commands, Command } from './commands';


export function initKeyboardControls(cb: Function) {
    document.addEventListener('keyup', (e) => { cb(keyup(e)) });
    document.addEventListener('keydown', (e) => { cb(keydown(e)) })
}

function keyup(event: KeyboardEvent): Command {
    switch (event.keyCode) {
        case 37:
        case 39:
            // Right Arrow key
            return new Command(null, "off");
        case 38:
        case 40:
            // Up Arrow key
            return new Command("off");
    }
}

function keydown(event: KeyboardEvent): Command {
    switch (event.keyCode) {
        case 37:
            // Left Arrow key
            return new Command(null, "ccw");
        case 39:
            // Right Arrow key
            return new Command(null, "cw");
        case 38:
            // Up Arrow key
            return new Command("full");
        case 40:
            // Down
            return new Command("half");
    }
}
