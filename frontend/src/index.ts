import { Vector } from './geometry';
import { setup, start } from './game';

let canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let ctx = canvas.getContext("2d");

let game = setup(ctx, "hello12");
setTimeout(() => { 
    start(game, ctx);
}, 5000);


// initKeyboardControls((command: Command) => {
//     if (command) {
//         commands = commands.concat(command);
//     }
// });
