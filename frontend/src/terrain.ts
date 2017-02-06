import { Vector, Geometry } from './geometry';
import * as seedrandom from 'seedrandom';

/**
 * generates terrain geometry
 */
export function terrain(width: number, rng: seedrandom.prng, midpointInit: number = 9, midpointSub: number = 4): Geometry {
    let heights = midpoint(midpointInit, midpointSub, rng);
    let maxHeight = 200 + 300 * rng();
    let widthStep = width / (heights.length - 1);
    // scale midpoint displaced heights down
    let heightScaleFactor = rng();
    let sin1f = 10 * rng();
    let sin2f = 50 * rng();
    let sin3f = 130 * rng();
    // TODO maybe add bump with gaussian normal curve e^-0.5*x^2
    heights = heights
        // .map((h, i) => 0.5)
        // .map(sineWave(sin1f))
        .map(sineWave(sin2f))
        .map(sineWave(sin3f));
    let geometry: Geometry = [];
    heights.map((h, i) => {
        geometry.push(new Vector(
            i * widthStep,
            h * maxHeight + 20
        ));
    });
    // set first and last point to zero height
    geometry[0] = new Vector(0, 0);
    geometry[geometry.length - 1] = new Vector(geometry[geometry.length - 1].x, 0);
    return geometry;
}

/**
 * returns a sine wave function for terrain generation
 */
function sineWave(waveLengthFactor: number) {
    return (h, i) => {
        return (Math.sin(i / waveLengthFactor) / 2 + 0.5) * h;
    }
}

/**
 * simple midpoint displacement implementation
 * @param numStartVals number of starting points for the terrain
 * @param iterations number of iterations to divide the terrain through
 * @return midpoint displaced array
 */
function midpoint(numStartVals: number, iterations: number, rng: seedrandom.prng): Array<number> {
    let arr: Array<number> = [];
    for (let i = 0; i < numStartVals; i++) {
        arr.push(rng());
    }
    let origArr = arr;
    let mdArr = [];
    let decayFactor = 0.5;
    let midval = 0;
    for (let i = 0; i < iterations; i++) {
        origArr.map((val, j) => {
            if (j === 0) {
                mdArr.push(val);
                return;
            }
            midval = (val + origArr[j - 1]) / 2 +
                (rng() - 0.5) * decayFactor;
            if (midval > 1) midval = 1;
            mdArr.push(midval);
            mdArr.push(val);
        });
        origArr = mdArr;
        decayFactor *= 1.1;
    }

    return origArr;
}


/**
 * find a spot on the terrain to place the flag
 */
export function flag(rng: seedrandom.prng, terrain: Geometry): Vector {
    let LIMIT = 10;
    return terrain[Math.round(rng() * (terrain.length - LIMIT)) + LIMIT / 2];
}