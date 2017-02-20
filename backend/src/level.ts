import { Geometry, Vector } from './geometry';
import { flag, terrain } from './terrain';
import * as seedrandom from 'seedrandom';

/**
 * represents a level with all init values for landers
 */
export class Level {
    public readonly terrain: Geometry
    public readonly background: Geometry
    public readonly flagPosition: Vector
    public readonly startPosition: Vector
    public readonly startVelocity: Vector
    public readonly startAngle: number

    constructor(public readonly seed: string) {
        let rng = seedrandom(seed);
        this.terrain = terrain(10000, rng);
        this.background = terrain(2500, rng, 8, 3).map((p) => new Vector(p.x * 2, p.y + 50));
        this.flagPosition = flag(rng, this.terrain);
        this.startPosition = startPosition(rng);
        this.startVelocity = startVelocity(rng);
        this.startAngle = (this.startVelocity.x >= 0) ? rng() * 0.7 : -rng() * -0.7;
    }
}

/**
 * generate a start position for landers
 */
function startPosition(rng: seedrandom.prng): Vector {
    return initVector(rng, 8000, 400, 1000, 500);
}

/**
 * generate a start position for landers
 */
function startVelocity(rng: seedrandom.prng): Vector {
    return initVector(rng, 4, 4, -2, -3);
}

/**
 * generates an initialization vector from a seed within x- and y-limits
 * adding x- and y-offset
 */
function initVector(rng: seedrandom.prng, xLimit: number, yLimit: number, xOffset: number = 0, yOffset: number = 0): Vector {
    return new Vector(
        xLimit * rng() + xOffset,
        yLimit * rng() + yOffset
    );
}













            // let seed: string = ($('#main #seed') as any).value;
            // let w = seed.length * 12;
            // if (w > 400) w = 400;
            // $('#main #seed').style.width = w + 'px';
            // let rng = seedrandom(seed);
            // let pt = terrain(10000, seed);
            // let flagPosition = flag(seed, pt);
            // let startPos = startPosition(seed);
            // previewTerrain(ctx, pt, flagPosition, startPos);
