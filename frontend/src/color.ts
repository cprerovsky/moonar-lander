import * as seedrandom from 'seedrandom';

let COLOR_CACHE: { [key: string]: string; } = {};

/**
 * generate a color from a name
 */
export function uniqueColor(name: string): string {
    if (!COLOR_CACHE[name]) {
        let rng = seedrandom(name);
        let rgb = hslToRgb(rng(), 1, 0.7);
        COLOR_CACHE[name] = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    }
    return COLOR_CACHE[name];
}

/**
 * from http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h: number, s: number, l: number) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * convert hue value to rgb
 */
function hue2rgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}