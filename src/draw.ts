import { Point } from './geometry';

export default function updateCanvas (ctx: CanvasRenderingContext2D, geometry: Point[], strokeStyle: string, closePath: boolean = false) {
    if (geometry.length === 0) return;
    ctx.beginPath();
    geometry.map((p, i) => {
        if (i === 0) {
            ctx.moveTo(p.x, translate(p.y, ctx));
        } else {
            ctx.lineTo(p.x, translate(p.y, ctx));
        }
    });
    if (closePath) ctx.lineTo(geometry[0].x, translate(geometry[0].y, ctx));
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
    ctx.closePath();
}

/**
 * translate world y coordinates to drawing coordinates
 */
function translate(y: number, ctx: CanvasRenderingContext2D): number {
    return ctx.canvas.height - y;
}