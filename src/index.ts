import Lander from "./lander";
import { Vector } from './geometry';
import { tick } from './lander';
import { terrain } from './terrain';
import * as seedrandom from 'seedrandom';
import { sky, render } from './render';
import { initKeyboardControls, applyCommands } from './keyboard-contols';

let canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let ctx = canvas.getContext("2d");
let rng = seedrandom("test");

let fgTerrain = terrain(10000, 350, rng, 9, 4);
let bgTerrain = terrain(2500, 350, rng, 8, 3).map((p) => new Vector(p.x * 2, p.y + 50));
let skybox = sky(3500, 800);
let lander = new Lander(new Vector(1000, 300), new Vector(0, 0), 0, "off", 0, "off");
initKeyboardControls(lander);

setInterval(() => lander = tick(applyCommands(lander), fgTerrain), 25);

(function nextFrame() {
    requestAnimationFrame((t) => {
        render(ctx, lander.position, lander, fgTerrain, bgTerrain, skybox);
        nextFrame();
    });
})();
