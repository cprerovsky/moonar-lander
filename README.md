# Moonar Lander

A [Lunar Lander](https://en.wikipedia.org/wiki/Lunar_Lander_(1979_video_game)) clone, controlled via WebSockets. To get a grasp of what the game is about, try the [Atari Arcade Lunar Lander](https://www.atari.com/arcade/lunar_lander).

## Development State

The game is currently in ```BETA```

Core game features and mechanics are still subject to change. A stable version is expected
by March 2017.

## Requirements
- NodeJS v6.7.0+
- git or Docker

## Docker
```docker run -p 4711:4711 -d blacktarmac/moonar-lander```

## Installing from GIT
- clone the project
```git clone git@github.com:cprerovsky/moonar-lander.git```
- install dependencies
```npm install```
- run
```npm run watch```

## Getting Started
- open [http://localhost:4711](http://localhost:4711) in your browser
- connect your client(s) to ws://localhost:4711
- update the seed to your liking
- click "Multiplayer"

# Implementing a Client

A simple, crappy example client can be found at
[https://github.com/cprerovsky/moonar-lander/blob/master/frontend/static/client.js](https://github.com/cprerovsky/moonar-lander/blob/master/frontend/static/client.js).
WebSockets are available in a wide variety of programming languages - you are free to choose.

## Overview

A game of Moonar Lander requires
- a game host (see "Installing" and "Getting Started")
- one or more game clients, preferrably implemented by you

Your goal is to fly your ```lander``` to the flag and land as close to the flag as possible.

## Connecting to a game

Once the backend server is listening, you can connect to the game using WebSockets.

```
ws://localhost:4711
```

After establishing a connection you need to send your player name
```
{ "player": "Slim Shady" }
```

When the multiplayer button is pressed in the UI or a GET request to ```/game/:seed``` is
sent, your client will receive the level info:

```
{
    "seed": "hello1",
    "terrain": [{ "x": 0, "y": 0 }, { "x": 22.471910112359552, "y": 54.097081681473 }, { "x": 44.943820224719104, "y": 72.21046855307998 }, { "x": 67.41573033707866, "y": 93.33997027987462 }, { "x": 89.88764044943821, "y": 99.84459689392959 }],
    "flagPosition": { "x": 4179.775280898877, "y": 25.67618939220219 },
    "startPosition": { "x": 7644.389915733377, "y": 518.0994963520216 },
    "startVelocity": { "x": -1.4393545245604147, "y": -2.003063837677062 },
    "startAngle": 0.09796041374749012
}
```

- ```seed``` is the seed value the current game was initialized with
- ```terrain``` contains an array of points describing the level geometry, where y is elevation. These points are connected with straight lines to form the landscape.
- ```flagPosition``` position the flag is located at
- ```startPosition``` position the game will put your lander when starting
- ```startVelocity``` initial velocity vector of your lander
- ```startAngle``` initial angle your lander will be rotated to in radians

## Game Start

100ms after the level info you will receive the game start message, which signals the start of the match:

```
{
    "game": "start",
    "players":[ ... ]
}
```

The message also contains other player names and colors, to be used by the UI.

You can begin sending commands now.

## Status Information

The host will send you status information about your lander with every tick. A tick is the time unit the game's physics engine operates on and usually lasts 25ms±2ms. The status 
information you will receive looks like this:

```
{ 
    "player": "Slim Shady",
    "color": "rgb(255,186,102)",
    "position": { "x": 7641.511206684257, "y": 514.0833686766675 },
    "velocity": { "x": -1.4427288896172508, "y": -1.9882268794220246 },
    "angle": 0.09656041374749012,
    "tick": 1,
    "rotation": "cw",
    "rotationSpeed": 0,
    "engine": "full",
    "fuel": 998.85,
    "crashed": false,
    "landed": false,
    "touchdown": false 
}
```

- ```player```: your name
- ```color```: the color that has been assigned to your lander
- ```position```: your current position
- ```velocity```: your current velocity
- ```angle```: your rotation angle in radiens (*not degrees*!)
- ```tick```: current tick number the game engine has finished processing
- ```rotation```: state of your rotation thrusters, which can be one of the following:
    - ```off```: thrusters are switched off
    - ```cw```: thrusters are rotating the lander clockwise 
    - ```ccw```: thrusters are rotatinng the lander counter-clockwise
- ```rotationSpeed```: the angular speed you are currently rotating with. This rotation speed
is added to your angle on every tick
- ```engine```: the state of your main engine which can be one of:
    - ```off```: your main engine is off and gravity will just do it's thing
    - ```half```: your main engine is running at half throttle, which is a bit more economic than going full throttle
    - ```full```: your main engine is running at full throttle
- ```fuel```: amount of fuel left in your tank. rotation thrusters and your main engine both
use fuel. If you run out of fuel you ~~will surely die~~ will not be able to rotate or use your
main engine anymore. 
- ```crashed```: boolean, whether you have crashed. Crashing will render you unable to control the lander.
- ```landed```: boolean, whether you have landed safely. Gently touching down the lander close to the flag
will score maximum points!
- ```touchdown```: boolean, whether you are currently touching down on the surface. Switch off engine and
rotation to land.

## Commanding Your Lander

As long as the game is running you can send new commands to your lander:

```
{
    "player": "Slim Shady",
    "commands": [
        { "engine": "full", "rotation": "cw" },
        { "rotation": "ccw", "tick": 20 },
        { "rotation": "cw", "engine": "off", "tick": 25 }
    ]
}
```

The command messages **always** need to contain your token. A command can contain the following
keys:

- ```engine```: allowing you to switch the engine to ```off```, ```half``` or ```full```
- ```rotation```: switching the engine to ```off```, ```cw```, or ```ccw```
- ```tick```: the tick this command should be executed at. If you omit this key your command
will be executed right at the next tick.

## Successfully Landing Your Lander

Successfully landing your lander is about gently touching down on the surface. You need to
maintain a minimal speed of descent. When your lander is about to touch down you need to
switch off the engine and rotation for the landing to be successful. Touching down too fast
will bounce the lander off the surface. You need to keep your lander upright at a maximum
angle of 0.785398rad (45°).

### Important Side Node on Lander Geometry

The lander position you receive with the status information message on every tick locates the
center of mass of your lander. The geometry of the lander looks as follows:

```
{ "x": -6, "y": -8 },
{ "x": -5, "y": 8 },
{ "x": 5, "y": 8 },
{ "x": 6, "y": -8 }
```

So, at an angle of 0 radiens your lander will extend 8 points below it's current position. If
the flag is located at an y-value of 20, your lander will touchdown with an y-position of 28 at
an angle of 0.

### Landing Area

The flag is located anywhere on the map. You need to find a suitable landing spot yourself. It
might not be possible to land in close proximity to the flag, depending on the map.

## Ending the Game

Ideally you end the game by winning it. When all landers have landed, crashed or are out of fuel
the game ends. The lander landing closest to the flag will score the most points. Landing within
ten points of the flag will score you a point multiplier, if you managed to land within two minutes.
Crashing your lander will bring a severe score penalty, while conserving fuel will add some points.

When the game has ended you will receive a short message, which also includes the points scored:

```{ "game": "over", "points": [ ... ] }```
