import { Vector } from './geometry';
import { Lander, tick } from './lander';
import { terrain, flag } from './terrain';
import * as seedrandom from 'seedrandom';
import { sky, render } from './render';
import { initKeyboardControls, applyCommands } from './keyboard-contols';
import { Commands, Command } from './commands';

let canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let ctx = canvas.getContext("2d");
let rng = seedrandom("test");
let fgTerrain = terrain(10000, 350, rng, 9, 4);
let bgTerrain = terrain(2500, 350, rng, 8, 3).map((p) => new Vector(p.x * 2, p.y + 50));
let skybox = sky(3500, 800);
let lander = new Lander(new Vector(1000, 300), new Vector(0, 0), 0, "off", 0, "off");
let flagPosition = flag(fgTerrain, rng);
let commands: Commands = [
    new Command("full", "cw"),
    new Command(null, "off", 7),
    new Command("off", "ccw", 80),
    new Command(null, "off", 86),
    new Command("half", null, 200),
    new Command("off", null, 400),
    new Command("full", null, 450),
    new Command("off", null, 550)
];
// initKeyboardControls(lander);

let tickNo = 0;
setInterval(() => {
    tickNo++;
    let exec = commands.filter((c) => !c.tick || c.tick <= tickNo);
    lander = tick(tickNo, exec, lander, fgTerrain);
    commands = commands.filter((c) => c.tick > tickNo);
}, 10);

(function nextFrame() {
    requestAnimationFrame((t) => {
        render(ctx, lander.position, lander, fgTerrain, bgTerrain, skybox, flagPosition);
        nextFrame();
    });
})();
