import midpoint from './midpoint';
import { Point } from './geometry';
import * as seedrandom from 'seedrandom';

export default class Terrain {
    public geometry: Point[] = [];
    public flagGeometry: Point[] = [];
    
    constructor(sceneWidth: number, public maxHeight: number, rng: seedrandom.prng, midpointInit: number, midpointSub: number, flag: boolean = true) {
        let heights = midpoint(midpointInit, midpointSub, rng); 
        let widthStep = sceneWidth / (heights.length - 1);
        heights.map((h, i) => {
            this.geometry.push(new Point(
                i * widthStep,
                Math.sin(i / 50) * h * maxHeight / 2 + maxHeight / 2 + 10
            ));
        });
        this.geometry[0].y = this.geometry[this.geometry.length - 1].y = 0;
        if (flag) this.placeFlag(this.geometry[50]);
    }

    private placeFlag(at: Point) {
        FLAG_GEOMETRY.map(p => {
            this.flagGeometry.push(new Point(at.x + p.x, at.y + p.y));
        });
    }
}

const FLAG_GEOMETRY = [
    new Point(0, 0),
    new Point(0, 25),
    new Point(15, 20),
    new Point(0, 15)
];




