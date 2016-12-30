import Lander from "./lander";
import { Vector, Point, dot } from './geometry';
import Physics from './physics';
import { RotationDirection } from './lander';
import Terrain from './terrain';
import KeyboardControls from './keyboard-contols';
import Renderer from './renderer';

let canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
let ctx = canvas.getContext("2d");
let terrain = new Terrain(5000, 300);
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
