import midpoint from './midpoint';
import { Point } from './geometry';

export default class Terrain {
    public geometry: Point[] = [];
    constructor(sceneWidth: number, public maxHeight: number) {
        let heights = midpoint(6, 4); 
        let widthStep = sceneWidth / (heights.length - 1);
        heights.map((h, i) => {
            this.geometry.push(new Point(
                i * widthStep,
                Math.sin(i / 50) * h * maxHeight / 2 + maxHeight / 2 + 10
            ));
        });
    }
}