import Lander from "./lander";
import draw from './draw';
import { Vector } from './geometry';
import Physics from './physics';
import { RotationDirection } from './lander';
import Terrain from './terrain';

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
    ctx.fillText("fps: " + fps, 20, ++l*20);
    // ctx.fillText("angle: " + lander.angle, 20, ++l*20);
    // ctx.fillText("rotationSpeed: " + lander.rotationSpeed, 20, ++l*20);
    ctx.fillText("x: " + lander.position.x, 20, ++l*20);
    ctx.fillText("y: " + lander.position.y, 20, ++l*20);
    ctx.fillText("vx: " + lander.velocity.x, 20, ++l*20);
    ctx.fillText("vy: " + lander.velocity.y, 20, ++l*20);

    requestAnimationFrame(updateCanvas);
    last = (new Date()).getTime();
}

function keyLetGo(event) {
    switch (event.keyCode) {
        case 37:
        case 39:
            // Right Arrow key
            lander.rotation = "off";
            break;
        case 38:
        case 40:
            // Up Arrow key
            lander.engine = "off";
            break;
    }
}

document.addEventListener('keyup', keyLetGo);

function keyPressed(event) {
    switch (event.keyCode) {
        case 37:
            // Left Arrow key
            lander.rotation = "ccw";
            break;
        case 39:
            // Right Arrow key
            lander.rotation = "cw";
            break;
        case 38:
            // Up Arrow key
            lander.engine = "full";
            break;
        case 40:
            // Down
            lander.engine = "half";
            break;
    }
}

document.addEventListener('keydown', keyPressed);
updateCanvas();

// let v = { x: 300, y: 100 };
// let vna = { x: -v.y, y: v.x }; // normal vector a
// let vnb = { x: v.y, y: -v.x }; // normal vector b

// ctx.beginPath();
// ctx.moveTo(0, 0);
// ctx.lineTo(v.x, v.y);
// ctx.strokeStyle = "white";
// ctx.stroke();
// ctx.closePath();

// ctx.beginPath();
// ctx.moveTo(v.x, v.y);
// ctx.lineTo(vna.x + v.x, vna.y + v.y);
// ctx.strokeStyle = "red";
// ctx.stroke();
// ctx.closePath();

// ctx.beginPath();
// ctx.moveTo(v.x, v.y);
// ctx.lineTo(vnb.x + v.x, vnb.y + v.y);
// ctx.strokeStyle = "orange";
// ctx.stroke();
// ctx.closePath();
