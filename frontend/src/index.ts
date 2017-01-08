import { Vector } from './geometry';
import { setup, start } from './game';

let canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let ctx = canvas.getContext("2d");

let game = setup(ctx, "hello12");
document.getElementById('start').onclick = function (this, ev) {
    console.log('starting game');
    start(game, ctx);
};

// initKeyboardControls((command: Command) => {
//     if (command) {
//         commands = commands.concat(command);
//     }
// });
