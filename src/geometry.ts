export class Vector {
    constructor(public x: number = 0, public y: number = 0) { }
    rotate(pivot: Vector, angle: number) {
        // http://stackoverflow.com/questions/2259476/rotating-a-point-about-another-point-2d
        // answer by six face
        let sinA = Math.sin(angle);
        let cosA = Math.cos(angle);
        return new Vector(
            cosA * (this.x - pivot.x) - sinA * (this.y - pivot.y) + pivot.x,
            sinA * (this.x - pivot.x) + cosA * (this.y - pivot.y) + pivot.y
        );
    }
}

/**
 * checks if a overlaps with b
 * returns the indices of a overlapping with b 
 */
export function isOverlap(lander: Vector[], terrain: Vector[]): number[] {
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
        if (point.y >= y) {
            collisions.push(i);
        }
    });
    return collisions;
}
