import { Lander } from './lander';
import { length, Vector, subtract } from './geometry';

module UI {
    export function addPlayer(token: string, name: string, color: string) {
        let html = `<li id="${token}" class="player">
    <p class="pilot" style="color: ${color}">${name} <span class="on"></span></p>
    <p>dist <span class="dist">.</span></p>
    <p>fuel <span class="fuel">.</span></p>
    <p>angl <span class="angle">.</span></p>
    <p>sped <span class="speed">.</span></p>
</li>`;
        $('#ui').innerHTML += html;
    }

    /**
     * update the ui
     */
    export function update(tick: number, landers: Lander[], flagPosition: Vector) {
        if (tick % 5 === 0) return;
        landers.map((l) => {
            $(`#${l.token} .dist`, Math.floor(length(subtract(flagPosition, l.position))));
            $(`#${l.token} .fuel`, Math.floor(l.fuel));
            $(`#${l.token} .speed`, `${round(l.velocity.x, 3)}, ${round(l.velocity.y, 3)}`);
            $(`#${l.token} .angle`, round(l.angle, 3));
            $(`#${l.token} .on`, l.engine !== 'off' || l.rotation !== 'off' ? '&squf;' : '&nbsp;');
        });
    }

    export function reset() {
        $('#ui').innerHTML = '';
    }

    export type Menu = 'gameover';

    export function show(menu: Menu) {
        $(`#${menu}`).classList.remove('hidden');
    }

    export function hide(menu: Menu) {
        $(`#${menu}`).classList.add('hidden');
    }

    function round(n: number, p: number): number {
        let places = Math.pow(10, p);
        return (Math.floor(n * places) / places);
    }
}

export default UI;

let ELEMENTS_CACHE: { [key: string]: HTMLElement; } = {};

function $(query: string, inner?: string | number): HTMLElement {
    let el = ELEMENTS_CACHE[query] || document.querySelector(query) as HTMLElement;
    if (inner) el.innerHTML = inner + "";
    if (!ELEMENTS_CACHE[query]) ELEMENTS_CACHE[query] = el;
    return el;
}