import { Commands, Command } from './commands';
import { Lander, tick } from './lander';
import * as seedrandom from 'seedrandom';
import { terrain, flag } from './terrain';
import { Vector, Geometry, landerFlameGeometry, length, subtract } from './geometry';
import { sky, render } from './render';
import { uniqueColor } from './color';
import UI from './ui';
import { Level } from './level';

// time a tick takes in the game
const TICK_TIME = 25;

// time allowed to score maximum points with a perfect landing
const MAX_POINTS_MS = 120000;

/**
 * the game state holds all game information
 */
export class GameState {
    public players: PlayerMsg[] = []
    public landers: Lander[] = []
    public commands: Commands = []
    public phase: GamePhase = GamePhase.INITIALIZING
    constructor(public readonly ctx: CanvasRenderingContext2D,
        public readonly level: Level,
        public readonly bgTerrain: Geometry,
        public readonly skybox: ImageData,
        public readonly ws?: WebSocket) { }
}

module GAME {
    /**
     * setup a new game
     */
    export function setup(ctx: CanvasRenderingContext2D, level: Level, openCB?: Function) {
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
        let bgTerrain = terrain(2500, seedrandom(level.seed + 'BG'), 8, 3).map((p) => new Vector(p.x * 2, p.y + 50));
        let skybox = sky(3500, 800);
        let state = new GameState(ctx, level, bgTerrain, skybox, ws);
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
        return tick(tickNo, cmds, lander, state.level.terrain)
    });
    state.commands = state.commands.filter((c) => c.tick > tickNo);
    UI.update(tickNo, state.landers, state.level.flagPosition);
    requestAnimationFrame(() => render(state.ctx, calculateFocus(state.level.flagPosition, state.landers), state.landers, state.level.terrain, state.bgTerrain, state.skybox, state.level.flagPosition));
    if (state.phase === GamePhase.STARTED && isGameOver(state.landers, state.level.flagPosition)) {
        state.phase = GamePhase.OVER;
        UI.gameover(state.players, points(state.landers, state.level.flagPosition, tickNo));
    }
    state.landers.map((l) => send(state.ws, 'to', l.token, { tick: tickNo, lander: l }));
    if (state.phase !== GamePhase.TEARDOWN) setTimeout(() => loop(++tickNo, state), TICK_TIME);
};

/**
 * check whether the game is over
 */
function isGameOver(landers: Lander[], flagPos: Vector): boolean {
    return landers.filter(lander => {
        if (lander.crashed
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
        state.landers = state.landers.concat(new Lander(
            data.token,
            data.color,
            state.level.startPosition,
            state.level.startVelocity,
            state.level.startAngle,
            "off",
            0,
            "off",
            1000,
            false,
            false,
            false));
        UI.addPlayer(data.token, data.name, data.color);
        send(state.ws, 'to', data.token, {
            terrain: state.level.terrain,
            flag: state.level.flagPosition
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
function points(landers: Lander[], flag: Vector, tick: number): Points {
    return landers.reduce((p, l) => {
        let points = 5000 - length(subtract(l.position, flag));
        points += l.fuel;
        if (l.landed && length(subtract(flag, l.position)) <= 10) {
            let multiplier = 2 - tick / (MAX_POINTS_MS / TICK_TIME);
            if (multiplier < 1) multiplier = 1;
            points *= multiplier;
        } else if (l.crashed) {
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