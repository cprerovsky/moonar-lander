import Lander from "./lander";

let canvas: any = document.getElementById("game");
let context = (canvas as any).getContext("2d");

let spaceship = new Lander();



function drawFloor() {
    context.strokeStyle = 'red';
    context.strokeRect(0, 650, 800, 50);
}

function draw() {
    // Clear entire screen
    context.clearRect(0, 0, canvas.width, canvas.height);

    spaceship.tick();

    // Begin drawing
    spaceship.draw(context);
    drawFloor();
    context.font = "16px monospace";
    context.fillStyle = "white";
    context.fillText("angle: " + spaceship.angle, 20, 20);
    context.fillText("x: " + spaceship.position.x, 20, 40);
    context.fillText("y: " + spaceship.position.y, 20, 60);
    context.fillText("vx: " + spaceship.velocity.x, 20, 80);
    context.fillText("vy: " + spaceship.velocity.y, 20, 100);
    
    requestAnimationFrame(draw);
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

draw();

