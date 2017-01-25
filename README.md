# Moonar Lander

A [Lunar Lander](https://en.wikipedia.org/wiki/Lunar_Lander_(1979_video_game)) clone, controlled via WebSockets.

## Development State

The game is currently in ```EARLY ACCESS```

Core game features and mechanics are still subject to change. A stable version is expected
by March 2017.

## Open Todos

Open todos sorted by priority

* allow clients to delete commands
* flag positioning in terrain preview is inconsistent with actual positioning
* improve comments
* add indicators for offscreen landers
* improve terrain generation
* add trails for landers
* reimplement client-server protocol to change to host
* add auto game mode that starts automatically when enough clients connect
* add docker container

## Requirements
- NodeJS v6.7.0+
- git

## Installing from GIT
- clone the project
```git clone git@github.com:cprerovsky/moonar-lander.git```
- install dependencies
```npm install```

## Getting Started
- open [http://localhost:4711](http://localhost:4711) in your browser
- click "open game" to host a new game
- open [http://localhost:4711/clients.html](http://localhost:4711/clients.html) in your browser
- click "add client" to add game clients
- change back to the "Moonar Lander" tab
- click "start game" to start the game host
- watch the stupid demo clients battle it out

# Implementing a Client

A simple, crappy example client can be found at
[http://localhost:4711/client.js](http://localhost:4711/client.js).
WebSockets are available in a wide variety of programming languages - you are free to choose.

## Overview

A game of Moonar Lander requires
- a game host (see "Installing" and "Getting Started")
- one or more game clients, preferrably implemented by you

Your goal is to fly your ```lander``` to the flag and land as close to the flag as possible.

## Connecting to the Host

Once the game host has opened a new game, you can connect to the game using WebSockets.

```ws://localhost:4711```

After successfully connecting you will receive a token message with your identification
token.

```{ "token": "[YOUR_TOKEN]" }```

You need to provide this token with every message you send to the server.
The server will also send a message with the terrain information and the flag position:

```
{"terrain":[{"x":0,"y":0},{"x":22.471910112359552,"y":186.160381387663},
// ... a whole load of data points have been left out here
{"x":10000,"y":0}],"flag":{"x":5910.112359550562,"y":66.68545650329696}}
```

The ```terrain``` key contains the terrain information - an array of x- and y-coordinates,
where ```x = 0``` equals the leftmost position on the screen and ```y = 0``` equals the bottom
of the screen. The data points are sorted by x-coordinates.

The ```flag``` key contains the position where the ```flag``` connects to the ground. You
want to land as close as possible to this location.

## Game Start

As soon as the game is started by clicking the "Start Game" button you will receive the
following message:

```{ "game": "start" }```

## Status Information

The host will send you status information about your lander with every tick. A tick is the 
time unit the game's physics engine operates on and usually lasts 25ms±2ms. The status 
information you will receive looks like this:

```
{
    "tick":0,
    "lander":{
        "token":"TJ7swUSAHrjfP3HKH5U3",
        "color":"rgb(255,102,154)",
        "position":{"x":1000,"y":600},
        "velocity":{"x":0,"y":-0.01},
        "angle":0.0001,
        "rotation":"off",
        "rotationSpeed":0.0001,
        "engine":"off",
        "fuel":1000,
        "crashed":false,
        "landed":false,
        "touchdown":false
    }
}
```

The ```tick``` key contains the current tick the game is in.

The ```lander``` key contains all the information about your lander, which was already updated
by the physics engine in this tick:

- ```token```: your token
- ```color```: the color that has been assigned to your lander
- ```position```: your current position
- ```velocity```: your current velocity
- ```angle```: your rotation angle in radiens (*not degrees*!)
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
    "token": "[YOUR_TOKEN]",
    commands: [
        { "engine": "full", "rotation": "cw" },
        { "rotation": "ccw", "tick": 20 },
        { "rotation": "cw", "engine": "off", tick: 25 }
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

Ideally you end the game by winning it. The conditions for winning the game are determined as
follows:

1) The first lander landing in very close proximity (5 units) to the flag will **immediately** win
the game. Positions and status of other landers does *not* affect the outcome of the game in
this scenario.
2) When all landers have landed, crashed or are out of fuel the game ends. The lander landing
closest to the flag will score the most points. Crashing your lander will bring a severe
score penalty, while conserving fuel will add some points.

When the game has ended you will receive a short message:

```{ "game": "over" }```
