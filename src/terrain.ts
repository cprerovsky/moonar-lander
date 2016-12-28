import midpoint from './midpoint';
import { Vector } from './geometry';

export default class Terrain {
    public geometry: Vector[] = [];
    constructor(sceneWidth: number, sceneHeight: number, public maxHeight: number = 200) {
        let heights = midpoint(4, 2);
        let widthStep = sceneWidth / (heights.length - 1);
        heights.map((h, i) => {
            this.geometry.push(new Vector(
                i * widthStep,
                sceneHeight - h * maxHeight
            ));
        });
    }
}