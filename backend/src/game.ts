import { uniqueColor } from './color';
import { setTimeout } from 'timers';
import { Command } from './commands';
import { fetchCommands, getPlayers } from './gameserver';
import { length, subtract, Vector } from './geometry';
import { Lander, tick } from './lander';
import { Level } from './level';
import { flag } from './terrain';
import { sendGameStart, sendLanderInfo, sendLevelInfo, sendPlayersToViewer, sendGameOverMsg } from './gameserver';
import { Messages } from './messages'

// time a tick takes in the game
const TICK_TIME = 25;

// time allowed to score maximum points with a perfect landing
const MAX_POINTS_MS = 120000;

/**
 * the game state holds all game information
 */
export class GameState {
    constructor(public readonly level: Level,
        public landers: Lander[] = [],
        public commands: Command[] = []) { }
}

module GAME {
    /**
     * setup a new game
     */
    export function setup(level: Level): GameState {
        let landers: Lander[] = getPlayers().map((name) =>
            new Lander(
                name,
                uniqueColor(name),
                level.startPosition,
                level.startVelocity,
                level.startAngle
            ));
        sendLevelInfo(level);
        return new GameState(level, landers, []);
    }

    /**
     * start a game and maintain the game loop
     */
    export function start(state: GameState) {
        console.log(`Game start ${state.level.seed}`);
        sendGameStart(state.landers);
        loop(0, state);
    }

    function teardown() {
    }
}
export default GAME;

/**
 * game loop
 */
function loop(tickNo: number, state: GameState) {
    state.commands = state.commands.concat(fetchCommands());
    state.landers = state.landers.map((lander) => {
        let cmds = state.commands.filter((c) => (!c.tick || c.tick <= tickNo) && c.player === lander.player);
        return tick(tickNo, cmds, lander, state.level.terrain)
    });
    state.commands = state.commands.filter((c) => c.tick > tickNo);
    if (isGameOver(state.landers, state.level.flagPosition)) {
        let pts = points(state.landers, state.level.flagPosition, tickNo);
        sendLanderInfo(state.landers);
        sendGameOverMsg(pts);
        console.log(pts);
    } else {
        if (tickNo % 40 === 0) console.log(`tick ${tickNo}`);
        sendLanderInfo(state.landers);
        setTimeout(() => loop(++tickNo, state), TICK_TIME);
    }
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
 * calculate points for each lander
 */
function points(landers: Lander[], flag: Vector, tick: number): Messages.GameOverMsg {
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
        p.points = p.points.concat({
            name: l.player,
            points: Math.round(points)
        });
        return p;
    }, new Messages.GameOverMsg());
}
