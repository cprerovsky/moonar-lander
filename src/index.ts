import Lander from "./lander";
import draw from './draw';
import Vector from './vector';

let canvas:HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
let context = canvas.getContext("2d");

let spaceship = new Lander();
let floor = {
    geometry: [
        new Vector(0, 650),
        new Vector(800, 650)
    ]
}

function updateCanvas() {
    // Clear entire screen
    context.clearRect(0, 0, canvas.width, canvas.height);

    spaceship.tick();

    draw(context, spaceship.geometry, "rgb(240,240,240)");
    draw(context, floor.geometry, "rgb(240,240,240)");

    // context.font = "16px monospace";
    // context.fillStyle = "white";
    // context.fillText("angle: " + spaceship.angle, 20, 20);
    // context.fillText("x: " + spaceship.position.x, 20, 40);
    // context.fillText("y: " + spaceship.position.y, 20, 60);
    // context.fillText("vx: " + spaceship.velocity.x, 20, 80);
    // context.fillText("vy: " + spaceship.velocity.y, 20, 100);
    
    requestAnimationFrame(updateCanvas);
}

function keyLetGo(event) {
    switch (event.keyCode) {
        case 37:
        case 39:
            spaceship.rotate = "off";
            break;
        case 38:
            // Up Arrow key
            spaceship.engine = "off";
            break;
    }
}

document.addEventListener('keyup', keyLetGo);

function keyPressed(event) {
    switch (event.keyCode) {
        case 37:
            // Left Arrow key
            spaceship.rotate = "left";
            break;
        case 39:
            // Right Arrow key
            spaceship.rotate = "right";
            break;
        case 38:
            // Up Arrow key
            spaceship.engine = "full";
            break;
    }
}

document.addEventListener('keydown', keyPressed);

updateCanvas();

