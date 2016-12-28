import Lander from "./lander";
import draw from './draw';
import { Vector } from './geometry';
import Physics from './physics';

let canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
let context = canvas.getContext("2d");
let groundGeometry = [new Vector(0, 650), new Vector(800, 650)];
let physics = new Physics(groundGeometry);
let lander = new Lander(physics);

function updateCanvas() {
    // Clear entire screen
    context.clearRect(0, 0, canvas.width, canvas.height);

    lander.tick();

    draw(context, lander.geometry, "rgb(240,240,240)");
    draw(context, groundGeometry, "rgb(240,240,240)");

    context.font = "16px monospace";
    context.fillStyle = "white";
    context.fillText("angle: " + lander.angle, 20, 20);
    context.fillText("x: " + lander.position.x, 20, 40);
    context.fillText("y: " + lander.position.y, 20, 60);
    context.fillText("vx: " + lander.velocity.x, 20, 80);
    context.fillText("vy: " + lander.velocity.y, 20, 100);

    requestAnimationFrame(updateCanvas);
}

function keyLetGo(event) {
    switch (event.keyCode) {
        case 37:
        case 39:
            lander.rotate = "off";
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
            lander.rotate = "left";
            break;
        case 39:
            // Right Arrow key
            lander.rotate = "right";
            break;
        case 38:
            // Up Arrow key
            lander.engine = "full";
            break;
    }
}

document.addEventListener('keydown', keyPressed);

updateCanvas();

