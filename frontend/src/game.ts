import { Commands, Command } from './commands';
import { Lander, tick } from './lander';
import * as seedrandom from 'seedrandom';
import { terrain, flag } from './terrain';
import { Vector, Geometry, landerFlameGeometry, length, subtract } from './geometry';
import { sky, render } from './render';
import { uniqueColor } from './color';
import UI from './ui';

/**
 * the game state holds all game information
 */
export class GameState {
    public players: PlayerMsg[] = []
    public landers: Lander[] = []
    public commands: Commands = []
    public phase: GamePhase = GamePhase.INITIALIZING
    constructor(public readonly ctx: CanvasRenderingContext2D,
        public readonly fgTerrain: Geometry,
        public readonly bgTerrain: Geometry,
        public readonly flagPosition: Vector,
        public readonly skybox: ImageData,
        public readonly ws?: WebSocket) { }
}

module GAME {
    /**
     * setup a new game
     */
    export function setup(ctx: CanvasRenderingContext2D, seed: string, openCB?: Function) {
        let ws = new WebSocket(`ws://${location.hostname}:${location.port}`);
        ws.onopen = () => {
            console.log('WebSocket connection established');
            if (openCB) openCB();
        };
        ws.onmessage = function (this: WebSocket, msg: MessageEvent) {
            handleMessage(this, msg, state);
        };
        ws.onclose = function (this: WebSocket, ev: CloseEvent) {
            console.log('WebSocket connection closed', ev);
        };
        ws.onerror = console.error;
        let fgTerrain = terrain(10000, seed);
        let bgTerrain = terrain(2500, seed, 8, 3).map((p) => new Vector(p.x * 2, p.y + 50));
        let skybox = sky(3500, 800);
        let flagPosition = flag(fgTerrain);
        let state = new GameState(ctx, fgTerrain, bgTerrain, flagPosition, skybox, ws);
        return state;
    }

    /**
     * start a game and maintain the game loop
     */
    export function start(state: GameState) {
        state.phase = GamePhase.STARTED;
        send(state.ws, 'broadcast', '', { game: 'start' });
        loop(0, state);
    }

    /**
     * cleanup after the game is over
     */
    export function teardown(state: GameState) {
        state.phase = GamePhase.TEARDOWN;
        UI.reset();
        send(state.ws, 'broadcast', '', { game: 'over' });
        send(state.ws, 'disconnect', '*');
    }
}
export default GAME;

/**
 * game loop
 */
function loop(tickNo: number, state: GameState) {
    state.landers = state.landers.map((lander) => {
        let cmds = state.commands.filter(
            (c) => (!c.tick || c.tick <= tickNo) && c.token === lander.token);
        return tick(tickNo, cmds, lander, state.fgTerrain)
    });
    state.commands = state.commands.filter((c) => c.tick > tickNo);
    UI.update(tickNo, state.landers, state.flagPosition);
    requestAnimationFrame(() => render(state.ctx, calculateFocus(state.flagPosition, state.landers), state.landers, state.fgTerrain, state.bgTerrain, state.skybox, state.flagPosition));
    if (state.phase === GamePhase.STARTED && isGameOver(state.landers, state.flagPosition)) {
        state.phase = GamePhase.OVER;
        UI.gameover(state.players, points(state.landers, state.flagPosition));
    }
    state.landers.map((l) => send(state.ws, 'to', l.token, { tick: tickNo, lander: l }));
    if (state.phase !== GamePhase.TEARDOWN) setTimeout(() => loop(++tickNo, state), 25);
};

/**
 * check whether the game is over
 */
function isGameOver(landers: Lander[], flagPos: Vector): boolean {
    return landers.filter(lander => {
        if (lander.landed && length(subtract(flagPos, lander.position)) <= 5) {
            // immediate win, if landed close enugh to flag
            return true;
        } if (lander.crashed
            || lander.fuel === 0
            || lander.landed) {
            return false;
        } else {
            return true;
        }
    }).length === 0;
}

/**
 * calculate the camera focus point
 */
function calculateFocus(flag: Vector, landers: Lander[]): Vector {
    return new Vector(
        landers.reduce((p, c) => {
            if (Math.abs(flag.x - c.position.x) < Math.abs(flag.x - p.position.x)) {
                return c;
            } else {
                return p;
            }
        }).position.x
        , 0);
}

/**
 * handle incoming messages from clients
 */
function handleMessage(ws: WebSocket, msg: MessageEvent, state: GameState) {
    let data = JSON.parse(msg.data);
    if (state.phase === GamePhase.INITIALIZING && data.host === true) {
        state.phase = GamePhase.HOST_CONFIRMED;
        console.log('HOST confirmed');
    } else if (state.phase === GamePhase.HOST_CONFIRMED && isPlayerMsg(data)) {
        data.color = uniqueColor(data.name);
        state.players = state.players.concat(data);
        let position = startPosition(state.fgTerrain);
        console.log(position, state.fgTerrain[7]);
        let velocity = startVelocity(state.fgTerrain);
        let angle = seedrandom(JSON.stringify(state.fgTerrain[21]))() * 0.7;
        angle *= (velocity.x >= 0) ? 1 : -1;
        state.landers = state.landers.concat(new Lander(
            data.token,
            data.color,
            position,
            velocity,
            angle,
            "off",
            0,
            "off",
            1000,
            false,
            false,
            false));
        UI.addPlayer(data.token, data.name, data.color);
        send(state.ws, 'to', data.token, {
            terrain: state.fgTerrain,
            flag: state.flagPosition
        });
    } else if (state.phase === GamePhase.STARTED && isCommandsMsg(data)) {
        state.commands = state.commands.concat(
            data.commands.map(
                cmd => new Command(data.token, cmd.engine, cmd.rotation, cmd.tick))
        );
    } else {
        console.error(`Dropped message in ${GamePhase[state.phase]}`, data);
    }
}

/**
 * calculate points for each lander
 */
function points(landers: Lander[], flag: Vector): Points {
    return landers.reduce((p, l) => {
        let points = 7000 - length(subtract(l.position, flag));
        points += Math.floor(l.fuel);
        if (l.crashed) {
            points = points / 10;
        }
        if (points < 0) points = 0;
        p[l.token] = Math.round(points);
        return p;
    }, {});
}

/**
 * send a message over websocket
 */
function send(ws: WebSocket, cmd: 'broadcast' | 'to' | 'disconnect', cval: string, data?: any) {
    ws.send(`${cmd}:${cval}
${JSON.stringify(data)}`);
}

/**
 * generate a start position for landers
 */
export function startPosition(terrain: Geometry): Vector {
    console.log(terrain[7].y);
    return initVector(JSON.stringify(terrain[7]), 8000, 400, 1000, terrain[7].y + 100);
}

/**
 * generate a start position for landers
 */
function startVelocity(terrain: Geometry): Vector {
    return initVector(JSON.stringify(terrain[13]), 4, 4, -2, -3);
}

/**
 * generates an initialization vector from a seed within x- and y-limits
 * adding x- and y-offset
 */
function initVector(seed: string, xLimit: number, yLimit: number, xOffset: number = 0, yOffset: number = 0): Vector {
    let rng = seedrandom(seed);
    return new Vector(
        xLimit * rng() + xOffset,
        yLimit * rng() + yOffset
    );
}

/// --- typeguards & interfaces ---
/**
 * holds all phases of the game
 */
enum GamePhase {
    INITIALIZING,
    HOST_CONFIRMED,
    STARTED,
    OVER,
    TEARDOWN
}

/**
 * incoming player message with which a player registers for a game
 */
export interface PlayerMsg {
    token: string
    name: string
    color?: string
}

/**
 * typeguard for PlayerMsg
 */
function isPlayerMsg(data: any): data is PlayerMsg {
    return (<PlayerMsg>data).token !== undefined &&
        (<PlayerMsg>data).name !== undefined;
}

/**
 * a command msg from a player containing lander commands
 */
interface CommandsMsg {
    token: string
    commands: Commands
}

/**
 * typeguard for CommandsMsg
 */
function isCommandsMsg(data: any): data is CommandsMsg {
    return (<CommandsMsg>data).token !== undefined &&
        (<CommandsMsg>data).commands !== undefined;
}

/**
 * the msg we receive if the host status was confirmed
 */
interface HostConfirmMsg {
    host: boolean
}

/**
 * holds the points for players
 */
export interface Points { [key: string]: number }