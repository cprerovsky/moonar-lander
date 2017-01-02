import midpoint from './midpoint';
import { Vector, Geometry } from './geometry';
import * as seedrandom from 'seedrandom';

export function terrain(width: number, height: number, rng: seedrandom.prng, midpointInit: number, midpointSub: number): Geometry {
    let heights = midpoint(midpointInit, midpointSub, rng);
    let widthStep = width / (heights.length - 1);
    let geometry: Geometry = [];
    heights.map((h, i) => {
        geometry.push(new Vector(
            i * widthStep,
            Math.sin(i / 50) * h * height / 2 + height / 2 + 10
        ));
    });
    geometry[0].y = geometry[geometry.length - 1].y = 0;
    return geometry;
}

/**
 * find a valid spot on the terrain to place the flag
 */
export function flag(terrain: Geometry, rng: seedrandom.prng): Vector {
    let LIMIT = 10;
    return terrain[ Math.round(rng() * (terrain.length - LIMIT)) - LIMIT / 2];
}