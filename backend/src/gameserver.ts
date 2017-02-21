import { Level } from './level';
import { Lander } from './lander';
import { ClientCommand, Command } from './commands';
import { Server } from 'http';
import { Server as WebSocketServer } from 'ws';
import { Messages } from './messages';

let WSS: WebSocketServer;
let CommandsBuffer: Command[] = []
export const KEYS = {
    PLAYER: 'PLAYER',
    VIEWER: 'VIEWER'
}

/**
 * boot the websocket server
 */
export function initializeGameServer(server: Server) {
    try {
        WSS = new WebSocketServer({ server: server });
        WSS.on('connection', (ws) => {
            log(`connection from ${ws['upgradeReq']['headers']['origin']}`);
            ws.on('error', (err) => onError);
            ws.on('message', (data) => onMessage(WSS, ws, data))
            ws.on('close', () => {
                let player = ws[KEYS.PLAYER];
                if (ws[KEYS.VIEWER]) player = 'VIEWER';
                log(`"${player}" from ${ws['upgradeReq']['headers']['origin']} disconnected`);
                sendPlayersToViewer();
            });
        });
        WSS.on('error', (err) => onError);
    } catch (e) {
        onError(e);
    }
}

/**
 * get all players currently connected to the game server
 */
export function getPlayers(): string[] {
    return WSS.clients
        .filter((ws: WebSocket) => !!ws[KEYS.PLAYER])
        .reduce((arr, ws) => {
            return arr.concat(ws[KEYS.PLAYER]);
        }, []);
}

/**
 * fetches all commands from the CommandsBuffer and empties it afterwards
 */
export function fetchCommands(): Command[] {
    let r = [...CommandsBuffer];
    CommandsBuffer = [];
    return r;
}

/**
 * get WebSockets for all players
 */
function getPlayerWebSockets(): WebSocket[] {
    return (WSS.clients as WebSocket[]).filter((ws) => !!ws[KEYS.PLAYER]);
}

/**
 * get WebSocket for a specific player
 */
function getPlayerWebSocket(player: string): WebSocket[] {
    return (WSS.clients as WebSocket[]).filter((ws) => ws[KEYS.PLAYER] === player);
}

/**
 * get viewer socket
 */
function getViewerSocket(): WebSocket[] {
    return (WSS.clients as WebSocket[]).filter((ws) => !!ws[KEYS.VIEWER]);
}

function onMessage(wss: WebSocketServer, ws: WebSocket, data: any) {
    try {
        let message = JSON.parse(data);
        // key "commands" must be checked first, as every command message will also have a
        // "player" key which would trigger setPlayer() all the time.
        if (message['commands']) {
            (message['commands'] as ClientCommand[]).map((ccommand) => {
                CommandsBuffer.push({ ...ccommand, player: ws[KEYS.PLAYER] });
            });
        } else if (message['player']) {
            if (isValidPlayerName(message['player'])) {
                setPlayer(wss, ws, message['player']);
                sendPlayersToViewer();
            } else {
                ws.close(1009, 'Invalid player name: must be a valid html4 element id');
            }
        } else if (message['viewer']) {
            makeViewer(wss, ws);
        }
        console.log(data);
    } catch (e) {
        onError(e);
    }
}

function isValidPlayerName(name: string): boolean {
    return !!name.match(/^[A-Za-z]+[\w\-\:\.]*$/);
}

/**
 * make this websocket a the viewer
 */
function makeViewer(wss: WebSocketServer, ws: WebSocket) {
    let isOtherViewer = wss.clients.filter((ws: WebSocket) => ws[KEYS.VIEWER]).length > 0;
    if (isOtherViewer) {
        ws.close(409, 'Another viewer is already connected');
    } else {
        ws[KEYS.VIEWER] = true;
    }
}

/**
 * assign a player to a websocket
 */
function setPlayer(wss: WebSocketServer, ws: WebSocket, player: string) {
    let isUnique = wss.clients.filter((ws: WebSocket) => ws[KEYS.PLAYER] === player).length === 0;
    if (isUnique && player.length > 0) {
        ws[KEYS.PLAYER] = player;
    } else {
        ws.close(1008, `Player "${player}" is already taken or an empty string.`);
    }
}

function log(msg: string) {
    console.log(`[${(new Date()).toISOString()} WSS] ${msg}`);
}

function onError(e) {
    console.error(`[${(new Date()).toISOString()} WSS]`, e);
}

/**
 * send infos about players to viewer websocket
 */
export function sendPlayersToViewer() {
    send(getViewerSocket(), {
        players: getPlayerWebSockets().reduce((p, c) => p.concat(c[KEYS.PLAYER]), [])
    });
}

/**
 * send level info to everybody
 */
export function sendLevelInfo(level: Level) {
    send(WSS.clients, level);
}

/**
 * send game start info
 */
export function sendGameStart(landers: Lander[]) {
    send(WSS.clients, { game: 'start', players: landers.reduce((p, lander) => {
        return p.concat({
            player: lander.player,
            color: lander.color
        });
    }, []) });
}

/**
 * send lander info to all players and the viewer
 */
export function sendLanderInfo(landers: Lander[]) {
    landers.map((lander) => send(getPlayerWebSocket(lander.player), lander));
    send(getViewerSocket(), { landers: landers });
}

/**
 * broadcast points info to all players
 */
export function sendGameOverMsg(points: Messages.GameOverMsg) {
    send(WSS.clients, points);
}

/**
 * send msg to all websockets
 */
function send(to: WebSocket[], msg: Messages.PlayersMsg | Messages.LevelMsg | Messages.GameStartMsg | Messages.LanderMsg | Messages.LandersMsg | Messages.GameOverMsg) {
    try {
        to.map(ws => ws.send(JSON.stringify(msg)));
    } catch (e) {
        console.error(e);
    }
}
