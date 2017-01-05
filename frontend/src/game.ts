import { Commands } from './commands';
import { Lander } from './lander';
import * as seedrandom from 'seedrandom';
import { terrain, flag } from './terrain';
import { Vector, Geometry } from './geometry';
import { sky } from './render';

enum GamePhase {
        INITIALIZING,
        HOST_CONFIRMED,
        STARTED
}

export class GameState {
    public players: { [key: string]: PlayerMsg } = {}
    public landers: { [key: string]: Lander } = {}
    public commands: Commands = []
    public phase: GamePhase = GamePhase.INITIALIZING
    constructor(public readonly ctx: CanvasRenderingContext2D,
        public readonly rng: seedrandom.prng,
        public readonly fgTerrain: Geometry,
        public readonly bgTerrain: Geometry,
        public readonly flagPosition: Vector,
        public readonly skybox: ImageData,
        public readonly ws?: WebSocket) { }
}

export function setup(ctx: CanvasRenderingContext2D, seed: string) {
    let rng = seedrandom(seed);
    let ws = new WebSocket("ws://localhost:4711");
    ws.onmessage = function (this: WebSocket, msg: MessageEvent) {
        handleMessage(this, msg, state);
    };
    ws.onclose = function (this: WebSocket, ev: CloseEvent) {
        console.log('WebSocket connection closed: ' + ev.reason);
    };
    ws.onerror = console.error;
    let fgTerrain = terrain(10000, 350, rng, 9, 4);
    let bgTerrain = terrain(2500, 350, rng, 8, 3).map((p) => new Vector(p.x * 2, p.y + 50));
    let skybox = sky(3500, 800);
    let flagPosition = flag(fgTerrain, rng);
    let state = new GameState(ctx, rng, fgTerrain, bgTerrain, flagPosition, skybox, ws);
    return state;
}

export function start(state: GameState) { }

function handleMessage(ws: WebSocket, msg: MessageEvent, state: GameState) {
    let data = JSON.parse(msg.data);
    if (state.phase === GamePhase.INITIALIZING && data.host === true) {
        state.phase = GamePhase.HOST_CONFIRMED;
    } else if (state.phase === GamePhase.HOST_CONFIRMED && isPlayerMsg(data)) {
        state.players[data.token] = data;
        // TODO send player game information
    } else if (state.phase === GamePhase.HOST_CONFIRMED && isCommandsMsg(data)) {
        state.commands = state.commands.concat(data.commands);
    } else {
        console.error(`Unable to handle message data ${data} in game phase ${state.phase}`);
    }
}

/// --- typeguards & interfaces ---
interface PlayerMsg {
    token: string
    name: string
}

function isPlayerMsg(data: any): data is PlayerMsg {
    return (<PlayerMsg>data).token !== undefined && 
        (<PlayerMsg>data).name !== undefined;
}

interface CommandsMsg {
    token: string
    commands: Commands
}

function isCommandsMsg(data: any): data is CommandsMsg {
    return (<CommandsMsg>data).token !== undefined && 
        (<CommandsMsg>data).commands !== undefined;
}

interface HostConfirmMsg {
    host: boolean
}
