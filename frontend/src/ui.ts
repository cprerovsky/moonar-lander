import { Lander } from './lander';
import { length, Vector, subtract } from './geometry';
import { Times, TIMES_MAX } from './game';

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

    export function update(landers: Lander[], flagPosition: Vector) {
        landers.map((l) => {
            $(`#${l.token} .dist`, Math.floor(length(subtract(flagPosition, l.position))));
            $(`#${l.token} .fuel`, Math.floor(l.fuel));
            $(`#${l.token} .speed`, `${round(l.velocity.x, 3)}, ${round(l.velocity.y, 3)}`);
            $(`#${l.token} .angle`, round(l.angle, 3));
            $(`#${l.token} .on`, l.engine !== 'off' || l.rotation !== 'off' ? '&squf;' : '&nbsp;');
        });
    }

    function round(n: number, p: number): number {
        let places = Math.pow(10, p);
        return (Math.floor(n * places) / places);
    }


    export function reset() {
        $('#ui').innerHTML = '';
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