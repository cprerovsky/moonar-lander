import { Lander } from './lander';

export function updateUi (lander: Lander) {
    $(`#${lander.pilot} .fuel`, Math.floor(lander.fuel));
    let fuelgauge = $(`#${lander.pilot} .fuelmeter .gauge`);
    fuelgauge.style.width = lander.fuel / 10 + "%";
}

let ELEMENTS_CACHE: { [key: string]: HTMLElement; } = {};

function $(query: string, inner?: string | number):HTMLElement {
    let el = ELEMENTS_CACHE[query] || document.querySelector(query) as HTMLElement;
    if (inner) el.innerHTML = inner + "";
    if (!ELEMENTS_CACHE[query]) ELEMENTS_CACHE[query] = el;
    return el;
}