import { Lander } from './lander';
import { length } from './geometry';

const R_TO_DEG = 180 / Math.PI;

export function updateUi (lander: Lander) {
    $(`#${lander.pilot} .position`, `${Math.floor(lander.position.x)}, ${Math.floor(lander.position.y)}`);
    $(`#${lander.pilot} .fuel`, `${Math.floor(lander.fuel)}`);
    // TODO why the heck is radians to deg conversion negative?
    $(`#${lander.pilot} .angle`, Math.floor(-lander.angle * R_TO_DEG));
}

let ELEMENTS_CACHE: { [key: string]: HTMLElement; } = {};

function $(query: string, inner?: string | number):HTMLElement {
    let el = ELEMENTS_CACHE[query] || document.querySelector(query) as HTMLElement;
    if (inner) el.innerHTML = inner + "";
    if (!ELEMENTS_CACHE[query]) ELEMENTS_CACHE[query] = el;
    return el;
}