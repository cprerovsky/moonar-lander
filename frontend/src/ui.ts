import { Lander } from './lander';
import { length } from './geometry';

module UI {
    export function addPlayer(token: string, name: string, color: string) {
        let html = `<li id="${token}" class="player">
    <p class="pilot" style="color: ${color}">${name}</p>
</li>`;
        $('#ui').innerHTML += html;
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