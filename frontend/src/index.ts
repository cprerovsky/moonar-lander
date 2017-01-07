import { Vector } from './geometry';
import { Lander, tick } from './lander';
import { terrain, flag } from './terrain';
import * as seedrandom from 'seedrandom';
import { sky, render } from './render';
import { initKeyboardControls } from './keyboard-controls';
import { Commands, Command } from './commands';
import { setup, start } from './game';

let canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let ctx = canvas.getContext("2d");

let game = setup(ctx, "hello12");
setTimeout(() => { 
    start(game, ctx);
}, 5000);

// let lander = new Lander(
//     'clemens',
//     new Vector(1000, 300),
//     new Vector(0, 0),
//     0,
//     "off",
//     0,
//     "off",
//     1000);
// let commands: Commands = [
    // new Command("full", "cw"),
    // new Command(null, "off", 7),
    // new Command("off", "ccw", 80),
    // new Command(null, "off", 86),
    // new Command("half", null, 200),
    // new Command("off", null, 400),
    // new Command("full", null, 450),
    // new Command("off", "cw", 550),
    // new Command(null, "off", 555),
    // new Command("full", null, 650),
    // new Command("off", null, 800),
    // new Command("full", null, 1100),
    // new Command("off", null, 1300)
// ];
// initKeyboardControls((command: Command) => {
//     if (command) {
//         commands = commands.concat(command);
//     }
// });

// let tickNo = 0;
// setInterval(() => {
//     tickNo++;
//     let exec = commands.filter((c) => !c.tick || c.tick <= tickNo);
//     lander = tick(tickNo, exec, lander, fgTerrain);
//     if (tickNo % 5 === 0) updateUi(lander);
//     commands = commands.filter((c) => c.tick > tickNo);
// }, 10);

// (function nextFrame() {
//     requestAnimationFrame((t) => {
//         render(ctx, lander.position, lander, fgTerrain, bgTerrain, skybox, flagPosition);
//         nextFrame();
//     });
// })();
