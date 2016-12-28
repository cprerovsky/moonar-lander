/**
 * represents a 2d vector
 */
export class Point {
    constructor(public x: number = 0, public y: number = 0) { }

    /**
     * rotate the vector around a pivot point and return a new result vector
     */
    rotate(pivot: Point, angle: number): Vector {
        // http://stackoverflow.com/questions/2259476/rotating-a-point-about-another-point-2d
        // answer by six face
        let sinA = Math.sin(angle);
        let cosA = Math.cos(angle);
        return new Vector(
            cosA * (this.x - pivot.x) - sinA * (this.y - pivot.y) + pivot.x,
            sinA * (this.x - pivot.x) + cosA * (this.y - pivot.y) + pivot.y
        );
    }
    
    /**
     * generate a result vector by adding v
     */
    public add(v: Point): Vector {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    /**
     * multiply by n
     */
    public multiply(n: number): Vector {
        return new Vector(this.x * n, this.y * n);
    }

    /**
     * subtract vector v
     */
    public subtract(v: Point): Vector {
        return new Vector(this.x - v.x, this.y - v.y);
    }
}

/**
 * represents a point on a 2d surface
 */
export class Vector extends Point {
    /**
     * generates the Normal A Vector
     */
    public normalA(): Vector {
        return new Vector(-this.y, this.x);
    }

    /**
     * generates the Normal B Vector
     */
    public normalB(): Vector {
        return new Vector(this.y, -this.x);
    }
}



/**
 * checks if a overlaps with b
 * returns the indices of a overlapping with b 
 */
export function isOverlap(lander: Point[], terrain: Point[]): number[] {
    let collisions: number[] = [];
    let segmentWidth = terrain[1].x;
    lander.map((point, i) => {
        // first find corresponding terrain segment for x-pos of lander
        let segment = Math.floor(point.x / segmentWidth);
        let a = terrain[segment];
        let b = terrain[segment + 1];
        // interpolate the segments y-value for the landers x-pos
        let relativeX = (point.x - a.x) / (b.x - a.x);
        let y = a.y + (b.y - a.y) * relativeX;
        // check if the lander overlaps
        if (point.y <= y) {
            collisions.push(i);
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