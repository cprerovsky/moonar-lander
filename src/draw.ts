import Vector from './vector';

export default function updateCanvas (ctx: CanvasRenderingContext2D, geometry: Vector[], strokeStyle: string) {
    ctx.beginPath();

    geometry.map((p, i) => {
        if (i === 0) {
            ctx.moveTo(p.x, p.y);
        } else {
            ctx.lineTo(p.x, p.y);
        }
    });
    ctx.lineTo(geometry[0].x, geometry[0].y);
    ctx.strokeStyle = "rgb(240,240,240)";
    ctx.stroke();
    ctx.closePath();
}