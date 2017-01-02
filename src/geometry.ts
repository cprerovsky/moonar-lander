import { EngineState } from './lander';
/**
 * represents a 2d vector
 */
export class Vector {
    constructor(public x: number, public y: number) { }
}

export class Collision {
    constructor(public point: Vector, public segmentStart: Vector, public segmentEnd: Vector) { }
}

export type Geometry = Vector[];

/**
 * rotate the point around a pivot point and return a new result vector
 */
export function rotate(point: Vector, pivot: Vector, angle: number): Vector {
    // http://stackoverflow.com/questions/2259476/rotating-a-point-about-another-point-2d
    // answer by six face
    let sinA = Math.sin(angle);
    let cosA = Math.cos(angle);
    return new Vector(
        cosA * (point.x - pivot.x) - sinA * (point.y - pivot.y) + pivot.x,
        sinA * (point.x - pivot.x) + cosA * (point.y - pivot.y) + pivot.y
    );
}

/**
 * generate a result vector by adding v
 */
export function add(v: Vector, a: Vector): Vector {
    return new Vector(v.x + a.x, v.y + a.y);
}

/**
 * multiply by n
 */
export function multiply(v: Vector, n: number): Vector {
    return new Vector(v.x * n, v.y * n);
}

/**
 * subtract vector s from v
 */
export function subtract(v: Vector, s: Vector): Vector {
    return new Vector(v.x - s.x, v.y - s.y);
}

/**
 * generates the Normal A Vector
 */
export function normalA(v: Vector): Vector {
    return new Vector(-v.y, v.x);
}

/**
 * generates the Normal B Vector
 */
export function normalB(v: Vector): Vector {
    return new Vector(v.y, -v.x);
}

/**
 * calculates the vector length
 */
export function length(v: Vector): number {
    return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
}

/**
 * checks if lander geometry overlaps with terrain
 * returns the indices of a overlapping with b 
 */
export function isOverlap(lander: Vector[], terrain: Vector[]): Collision[] {
    let collisions: Collision[] = [];
    let segmentWidth = terrain[1].x;
    lander.map((point, i) => {
        // first find corresponding terrain segment for x-pos of lander
        let segment = Math.round(point.x / segmentWidth);
        let a: Vector, b: Vector;
        if (segment < 0) {
            a = new Vector(point.x - 1, terrain[0].y);
            b = terrain[0];
        } else if (segment >= terrain.length) {
            a = terrain[terrain.length - 1];
            b = new Vector(point.x + 1, terrain[terrain.length - 1].y);
        } else {
            a = terrain[segment] || terrain[segment + 1];
            b = terrain[segment + 1] || terrain[segment];
        }
        // interpolate the segments y-value for the landers x-pos
        let relativeX = (point.x - a.x) / (b.x - a.x);
        let y = a.y + (b.y - a.y) * relativeX;
        // check if the lander overlaps
        if (point.y <= y) {
            collisions.push(new Collision(point, a, b));
        }
    });
    return collisions;
}

/**
 * calculate the dotproduct of the vectors
 */
export function dot(a: Vector, b: Vector): number {
    return a.x * b.x + a.y * b.y;
}

/**
 * translate vector by moving it by offset and rotating by angle around offset
 */
export function translate(vector: Vector, offset: Vector, angle: number) {
    return rotate(add(vector, offset), offset, angle);
}

/**
 * create a randomly sized flame geometry
 */
export function landerFlameGeometry(engine: EngineState): Geometry {
    if (engine === "off") return [];
    let height = 0;
    if (engine === "half") {
        height = 10 * -(0.7 + Math.random());
    } else if (engine === "full") {
        height = 16 * -(0.7 + Math.random());
    }
    return LANDER_FLAME_GEOMETRY.map((v, i) => {
        if (i === 1) {
            return new Vector(v.x, height);
        } else {
            return v;
        }
    });
}

export const LANDER_GEOMETRY: Geometry = [
    new Vector(-6, -8),
    new Vector(-5, 8),
    new Vector(5, 8),
    new Vector(6, -8)
];

const LANDER_FLAME_GEOMETRY: Geometry = [
    new Vector(4, -8),
    new Vector(0, -16), // p.y + this.height * -(0.7 + Math.random()))
    new Vector(-4, -8),
];

export const FLAG_GEOMETRY = [
    new Vector(0, 0),
    new Vector(0, 25),
    new Vector(15, 20),
    new Vector(0, 15)
];
