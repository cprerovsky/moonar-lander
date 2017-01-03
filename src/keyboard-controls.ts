import { Lander } from './lander';
import { RotationDirection, EngineState } from './lander';
import { Commands, Command } from './commands';


export function initKeyboardControls(commands: Commands) {
    document.addEventListener('keyup', (e) => keyup(e, commands));
    document.addEventListener('keydown', (e) => keydown(e, commands));
}

function keyup(event, commands: Commands) {
    switch (event.keyCode) {
        case 37:
        case 39:
            // Right Arrow key
            commands.push(new Command(null, "off"));
            break;
        case 38:
        case 40:
            // Up Arrow key
            commands.push(new Command("off"));
            break;
    }
}

function keydown(event, commands: Commands) {
    switch (event.keyCode) {
        case 37:
            // Left Arrow key
            commands.push(new Command(null, "ccw"));
            break;
        case 39:
            // Right Arrow key
            commands.push(new Command(null, "cw"));
            break;
        case 38:
            // Up Arrow key
            commands.push(new Command("full"));
            break;
        case 40:
            // Down
            commands.push(new Command("half"));
            break;
    }
}
