import { Point } from './geometry';
import Lander from './lander';
import Terrain from './terrain';

export default class Renderer {
    private view: Point
    
    public render(ctx: CanvasRenderingContext2D, lander: Lander, terrain: Terrain) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.draw(ctx, lander.geometry, "rgb(240,240,240)", true);
        this.draw(ctx, lander.flameGeometry, "rgb(255,240,100)");
        this.draw(ctx, terrain.geometry, "rgb(240,240,240)");
    }

    private draw(ctx: CanvasRenderingContext2D, geometry: Point[], strokeStyle: string, closePath: boolean = false) {
        if (geometry.length === 0) return;
        ctx.beginPath();
        geometry.map((p, i) => {
            if (i === 0) {
                ctx.moveTo(p.x, this.translate(p.y, ctx));
            } else {
                ctx.lineTo(p.x, this.translate(p.y, ctx));
            }
        });
        if (closePath) ctx.lineTo(geometry[0].x, this.translate(geometry[0].y, ctx));
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * translate world y coordinates to drawing coordinates
     */
    private translate(y: number, ctx: CanvasRenderingContext2D): number {
        return ctx.canvas.height - y;
    }
}