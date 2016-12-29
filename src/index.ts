import Lander from "./lander";
import draw from './draw';
import { Vector, Point, dot } from './geometry';
import Physics from './physics';
import { RotationDirection } from './lander';
import Terrain from './terrain';
import KeyboardControls from './keyboard-contols';

let canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
let ctx = canvas.getContext("2d");
let terrain = new Terrain(canvas.width);
let physics = new Physics(terrain.geometry);
let lander = new Lander(physics);
let last = 0;
let fpsHistory = [];
function updateCanvas() {
    let ms = (new Date()).getTime() - last;
    fpsHistory.push(ms);
    if (fpsHistory.length > 100) fpsHistory.shift();
    let msSum;
    let fps = 1000 / (fpsHistory.reduce((a, b) => a + b) / fpsHistory.length);

    // Clear entire screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lander.tick();

    draw(ctx, lander.geometry, "rgb(240,240,240)", true);
    draw(ctx, lander.flameGeometry, "rgb(255,240,100)");
    draw(ctx, terrain.geometry, "rgb(240,240,240)");

    ctx.font = "16px monospace";
    ctx.fillStyle = "white";
    let l = 0;
    // ctx.fillText("fps: " + fps, 20, ++l*20);
    ctx.fillText("angle: " + lander.angle, 20, ++l*20);
    // ctx.fillText("rotationSpeed: " + lander.rotationSpeed, 20, ++l*20);
    // ctx.fillText("x: " + lander.position.x, 20, ++l * 20);
    // ctx.fillText("y: " + lander.position.y, 20, ++l * 20);
    // ctx.fillText("vx: " + lander.velocity.x, 20, ++l * 20);
    // ctx.fillText("vy: " + lander.velocity.y, 20, ++l * 20);
    ctx.fillText("spd: " + lander.velocity.length(), 20, ++l * 20);

    requestAnimationFrame(updateCanvas);
    last = (new Date()).getTime();
}

new KeyboardControls(lander);

updateCanvas();
