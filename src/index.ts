import Lander from "./lander";
import draw from './draw';
import { Vector } from './geometry';
import Physics from './physics';
import { RotationDirection } from './lander';
import Terrain from './terrain';

let canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
let context = canvas.getContext("2d");
let terrain = new Terrain(canvas.width, canvas.height);
let physics = new Physics(terrain.geometry);
let lander = new Lander(physics);

function updateCanvas() {
    // Clear entire screen
    context.clearRect(0, 0, canvas.width, canvas.height);

    lander.tick();

    draw(context, lander.geometry, "rgb(240,240,240)", true);
    draw(context, lander.flameGeometry, "rgb(0,240,255)");
    draw(context, terrain.geometry, "rgb(240,240,240)");

    context.font = "16px monospace";
    context.fillStyle = "white";
    let l = 0;
    // context.fillText("angle: " + lander.angle, 20, ++l*20);
    // context.fillText("rotationSpeed: " + lander.rotationSpeed, 20, ++l*20);
    // context.fillText("x: " + lander.position.x, 20, ++l*20);
    // context.fillText("y: " + lander.position.y, 20, ++l*20);
    context.fillText("vx: " + lander.velocity.x, 20, ++l*20);
    // context.fillText("vy: " + lander.velocity.y, 20, ++l*20);

    requestAnimationFrame(updateCanvas);
}

function keyLetGo(event) {
    switch (event.keyCode) {
        case 37:
        case 39:
            // Right Arrow key
            lander.rotation = "off";
            break;
        case 38:
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
    }
}

document.addEventListener('keydown', keyPressed);

updateCanvas();

