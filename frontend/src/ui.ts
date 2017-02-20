import { preview } from './render';
import { Level } from '../../backend/src/level';
import { Messages } from '../../backend/src/messages';
import { Lander } from '../../backend/src/lander';
import { Vector, length, subtract } from '../../backend/src/geometry';

module UI {
    /**
     * initialize ui bindings
     */
    export function init(ctx: CanvasRenderingContext2D) {
        resize(ctx);
        window.addEventListener('resize', () => { resize(ctx); });
        /*
         * main menu
         */
        $('#main #start-multiplayer').addEventListener('click', () => {
            let seed = ($('#main #seed') as any).value;
            $('#main').classList.add('hidden');
            $('#main').classList.remove('state-open');
            $('#main #seed').removeAttribute('readonly');
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `/game/${seed}`);
            xhr.send();
        });

        function seedChange() {
            let seed: string = ($('#main #seed') as any).value;
            let w = seed.length * 12;
            if (seed) {
                let req = new XMLHttpRequest();
                req.open('GET', `/level/${seed}`);
                req.addEventListener('load', function (e) {
                    preview(ctx, JSON.parse(this.responseText) as Level)
                });
                req.send();
            }
            if (w > 400) w = 400;
            $('#main #seed').style.width = w + 'px';
        }
        $('#main #seed').addEventListener('keyup', seedChange);
        seedChange();

        /*
         * game over menu
         */
        $('#gameover #teardown').addEventListener('click', () => {
            $('#gameover').classList.add('hidden');
            $('#main').classList.remove('hidden');
        });
    }

    /**
     * update canvas size
     */
    export function resize(ctx: CanvasRenderingContext2D) {
        ctx.canvas.width = document.documentElement.clientWidth;
        ctx.canvas.height = document.documentElement.clientHeight;
    }

    /**
     * update player display in the ui
     */
    export function setPlayers(players: Messages.PlayersMsg | Messages.GameStartMsg) {
        if (Messages.isGameStartMsg(players)) {
            $('#ui').innerHTML = players.players.reduce((p, player) => {
                return p +
                    `<li id="${player.player}" class="player">
    <p class="pilot" style="color: ${player.color}">${player.player} <span class="on"></span></p>
    <p>dist <span class="dist"></span></p>
    <p>fuel <span class="fuel"></span></p>
</li>`;
            }, '');
        } else {
            $('#ui').innerHTML = players.players.reduce((p, player) => p + `<li id="${player}" class="player"><p class="pilot">${player}</p></li>`, '');
        }
    }

    /**
     * update the ui
     */
        export function update(landers: Lander[], flagPosition: Vector) {
        landers.map((l) => {
            if (l.landed) {
                $(`#${l.player}`).classList.add('landed');
            } else {
                $(`#${l.player}`).classList.remove('landed');
            }
            if (l.crashed) {
                $(`#${l.player}`).classList.add('crashed');
            } else {
                $(`#${l.player}`).classList.remove('crashed');
            }
            $(`#${l.player} .dist`, Math.floor(length(subtract(flagPosition, l.position))));
            $(`#${l.player} .fuel`, round(l.fuel, 0) + '');
        });
    }

    /**
     * display gameover modal
     */
    export function gameover(msg: Messages.GameOverMsg) {
        let html = msg.points.sort((a, b) => {
            return b.points - a.points;
        }).reduce((html, player) => {
            return html +
                `<li>${player.name} ${player.points}</li>`;
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