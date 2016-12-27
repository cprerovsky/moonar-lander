"use strict";
var midpoint_1 = require('./src/midpoint');
console.log(midpoint_1.default(2, 1));
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
// function preload() {
//     game.load.image('arrow', './lunar-lander.png');
//     game.load.image('stars', './stars.jpg');
//     game.load.physics('landscape', '', {
//         "landscape": [
//             {
//                 "density": 2, "friction": 0, "bounce": 0,
//                 "shape": [0, 600, 0, 570, 800, 500, 800, 600]
//             }
//         ]
//     })
// }
// let sprite: Phaser.Sprite;
// var bmd;
// let cursors: Phaser.CursorKeys;
// function create() {
//     cursors = game.input.keyboard.createCursorKeys();
//     //	Enable p2 physics
//     game.physics.startSystem(Phaser.Physics.P2JS);
//     game.stage.backgroundColor = '#000000';
//     //  You can also create an empty Polygon:
//     // let landscape = new Phaser.Polygon(
//     //     new Phaser.Point(0, 600),
//     //     new Phaser.Point(0, 570),
//     //     new Phaser.Point(800, 560),
//     //     new Phaser.Point(800, 600)
//     // );
//     // let graphics = game.add.graphics(0, 0);
//     // graphics.beginFill(0xFF33ff);
//     // graphics.drawPolygon(landscape.points);
//     // graphics.endFill();
//     let back = game.add.sprite(0, 0, 'stars');
//     game.physics.p2.enable(back, true);
//     let bBody = (back.body as Phaser.Physics.P2.Body);
//     bBody.clearShapes();
//     bBody.loadPolygon('landscape', 'landscape');
//     bBody.fixedRotation = true;
//     bBody.data.gravityScale = 0;
//     bBody.x = 400;
//     bBody.y = 300;
//     bmd = game.add.bitmapData(800, 600);
//     bmd.context.fillStyle = '#ffffff';
//     var bg = game.add.sprite(0, 0, bmd);
//     game.physics.p2.gravity.y = 100;
//     game.physics.p2.restitution = 0.4;
//     sprite = game.add.sprite(400, 100, 'arrow');
//     game.physics.p2.enable(sprite);
//     sprite.body.fixedRotation = false;
//     (sprite.body as Phaser.Physics.P2.Body).onBeginContact.add(function (body, bodyB, shapeA, shapeB, equation) {
//         // http://stackoverflow.com/questions/23587975/detect-impact-force-in-phaser-with-p2js
//         //  This callback is sent 5 arguments:
//     //  
//     //  The Phaser.Physics.P2.Body it is in contact with. *This might be null* if the Body was created directly in the p2 world.
//     //  The p2.Body this Body is in contact with.
//     //  The Shape from this body that caused the contact.
//     //  The Shape from the contact body.
//     //  The Contact Equation data array.
//     //  
//     //  The first argument may be null or not have a sprite property, such as when you hit the world bounds.
//         console.log(equation);
//     }, this);
//     // stars
//     let size = 0;
//     for (let i = 0; i < 100; i++) {
//         size = (Math.random() > 0.8) ? 2 : 1;
//         bmd.context.fillStyle = '#ffffff';
//         bmd.context.fillRect(Math.random() * 800, Math.random() * 600, 1, 1);
//     }
//     game.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
//     game.scale.scaleFactor = new Phaser.Point(2, 2);
//     game.input.onDown.add(gofull, this);
// }
// function gofull() {
//     if (game.scale.isFullScreen) {
//         game.scale.stopFullScreen();
//     }
//     else {
//         game.scale.startFullScreen(false);
//     }
// }
// function update() {
//     bmd.context.fillStyle = '#555500';
//     bmd.context.fillRect(sprite.x, sprite.y, 1, 1);
//     let body: Phaser.Physics.P2.Body = sprite.body;
//     if (cursors.up.isDown) {
//         body.thrust(200);
//     }
//     if (cursors.left.isDown) {
//         body.rotateLeft(20);
//     }
//     if (cursors.right.isDown) {
//         body.rotateRight(20);
//     }
// }
// function render() { }
//# sourceMappingURL=index.js.map