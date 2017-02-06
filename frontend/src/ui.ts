import { Lander } from './lander';
import { length, Vector, subtract } from './geometry';
import { GameState, Points, PlayerMsg } from './game';
import { terrain, flag } from './terrain';
import * as seedrandom from 'seedrandom';
import { preview } from './render';
import { Level } from './level';

module UI {
    /**
     * initialize ui bindings
     */
    export function init(ctx: CanvasRenderingContext2D,
        openCB: (level: Level) => void,
        startCB: () => void,
        startSinglePlayerCB: (level: Level) => void,
        cancelCB: () => void) {
        let level: Level;
        resize(ctx);
        window.addEventListener('resize', () => { resize(ctx); });
        /*
         * main menu
         */
        // open game
        $('#main #open').addEventListener('click', () => {
            $('#main').classList.add('state-open');
            $('#main #seed').setAttribute('readonly', 'true');
            openCB(level);
        });
        // start singleplayer game
        $('#main #start-singleplayer').addEventListener('click', () => {
            $('#main').classList.add('hidden');
            startSinglePlayerCB(level);
        });
        // start game
        $('#main #start').addEventListener('click', () => {
            $('#main').classList.add('hidden');
            $('#main').classList.remove('state-open');
            $('#main #seed').removeAttribute('readonly');
            startCB();
        });
        // cancel starting game
        $('#main #cancel').addEventListener('click', () => {
            $('#main').classList.remove('state-open');
            $('#main #seed').removeAttribute('readonly');
            cancelCB();
        });
        // seed input scaling
        function seedChange() {
            let seed: string = ($('#main #seed') as any).value;
            let w = seed.length * 12;
            if (w > 400) w = 400;
            $('#main #seed').style.width = w + 'px';
            level = new Level(seed);
            preview(ctx, level);
        }
        $('#main #seed').addEventListener('keyup', seedChange);
        seedChange();

        /*
         * game over menu
         */
        $('#gameover #teardown').addEventListener('click', () => {
            $('#gameover').classList.add('hidden');
            $('#main').classList.remove('hidden');
            cancelCB();
        });
    }

    /**
     * update canvas size
     */
    export function resize(ctx: CanvasRenderingContext2D) {
        ctx.canvas.width = document.documentElement.clientWidth;
        ctx.canvas.height = document.documentElement.clientHeight;
    }

    export function addPlayer(token: string, name: string, color: string) {
        let html = `<li id="${token}" class="player">
    <p class="pilot" style="color: ${color}">${name} <span class="on"></span></p>
    <p>dist <span class="dist"></span></p>
    <p>fuel <span class="fuel"></span></p>
</li>`;
        $('#ui').innerHTML += html;
    }

    /**
     * update the ui
     */
    export function update(tick: number, landers: Lander[], flagPosition: Vector) {
        if (tick % 5 === 0) return;
        landers.map((l) => {
            if (l.landed) {
                $(`#${l.token}`).classList.add('landed');
            } else {
                $(`#${l.token}`).classList.remove('landed');
            }
            if (l.crashed) {
                $(`#${l.token}`).classList.add('crashed');
            } else {
                $(`#${l.token}`).classList.remove('crashed');
            }
            $(`#${l.token} .dist`, Math.floor(length(subtract(flagPosition, l.position))));
            $(`#${l.token} .fuel`, round(l.fuel, 0) + '');
        });
    }

    /**
     * display gameover modal
     */
    export function gameover(players: PlayerMsg[], points: Points) {
        let html = players.sort((a, b) => {
            return points[b.token] - points[a.token];
        }).reduce((html, player) => {
            return html +
                `<li><span style="color: ${player.color}">${player.name}</span>
                    ${points[player.token]}</li>`;
        }, '');
        $('#gameover .results', html);
        $('#gameover').classList.remove('hidden');
    }

    /**
     * reset the game ui
     */
    export function reset() {
        $('#ui').innerHTML = '';
    }

    /**
     * round number n to p places
     */
    function round(n: number, p: number): number {
        let places = Math.pow(10, p);
        return (Math.floor(n * places) / places);
    }
}
export default UI;

/**
 * element cache for $ to improve lookup performance
 */
let ELEMENTS_CACHE: { [key: string]: HTMLElement; } = {};

/**
 * jquery like dom selector shortcut
 */
function $(query: string, inner?: string | number): HTMLElement {
    let el = ELEMENTS_CACHE[query] || document.querySelector(query) as HTMLElement;
    if (inner) el.innerHTML = inner + "";
    if (!ELEMENTS_CACHE[query]) ELEMENTS_CACHE[query] = el;
    return el;
}