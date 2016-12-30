import Lander from "./lander";
import { Vector, Point, dot } from './geometry';
import Physics from './physics';
import { RotationDirection } from './lander';
import Terrain from './terrain';
import KeyboardControls from './keyboard-contols';
import Renderer from './renderer';
import * as seedrandom from 'seedrandom';

let canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
let ctx = canvas.getContext("2d");
let rng = seedrandom("test");

let terrain = new Terrain(10000, 350, rng);
let physics = new Physics(terrain.geometry);
let lander = new Lander(physics);
let renderer = new Renderer();
new KeyboardControls(lander);

setInterval(() => lander.tick(), 25);

(function nextFrame() {
    requestAnimationFrame((t) => {
        renderer.render(ctx, lander, terrain)
        nextFrame();
    });
})();
