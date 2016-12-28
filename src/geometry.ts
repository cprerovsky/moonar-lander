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
export function isOverlap (a: Vector[], b: Vector[]): number[] {
        let collisions: number[] = [];
        a.map((ap, i) => {
            b.map((bp, j) => {
                if (ap.y >= bp.y) {
                    collisions.push(i);
                }
            });
        });
        return collisions;
}
