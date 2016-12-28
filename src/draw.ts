import { Vector } from './geometry';

export default function updateCanvas (ctx: CanvasRenderingContext2D, geometry: Vector[], strokeStyle: string, closePath: boolean = false) {
    ctx.beginPath();

    geometry.map((p, i) => {
        if (i === 0) {
            ctx.moveTo(p.x, p.y);
        } else {
            ctx.lineTo(p.x, p.y);
        }
    });
    if (closePath) ctx.lineTo(geometry[0].x, geometry[0].y);
    ctx.strokeStyle = "rgb(240,240,240)";
    ctx.stroke();
    ctx.closePath();
}