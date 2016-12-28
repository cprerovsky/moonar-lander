import { Point } from './geometry';

export default function updateCanvas (ctx: CanvasRenderingContext2D, geometry: Point[], strokeStyle: string, closePath: boolean = false) {
    if (geometry.length === 0) return;
    ctx.beginPath();
    geometry.map((p, i) => {
        if (i === 0) {
            ctx.moveTo(p.x, p.y);
        } else {
            ctx.lineTo(p.x, p.y);
        }
    });
    if (closePath) ctx.lineTo(geometry[0].x, geometry[0].y);
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
    ctx.closePath();
}