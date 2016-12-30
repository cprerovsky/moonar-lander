import { Point } from './geometry';
import Lander from './lander';
import Terrain from './terrain';

export default class Renderer {
    private focus: Point

    public render(ctx: CanvasRenderingContext2D, lander: Lander, terrain: Terrain) {
        this.focus = lander.position();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.draw(ctx, lander.geometry, "rgb(240,240,240)", true);
        this.draw(ctx, lander.flameGeometry, "rgb(240,240,240)");
        this.draw(ctx, terrain.geometry, "rgb(240,240,240)");
        this.draw(ctx, terrain.flagGeometry, "rgb(240,240,240)");
    }

    private draw(ctx: CanvasRenderingContext2D, geometry: Point[], strokeStyle: string, closePath: boolean = false) {
        if (geometry.length === 0) return;
        ctx.beginPath();
        geometry.map((p, i) => {
            if (i === 0) {
                ctx.moveTo(this.tx(p.x, ctx), this.ty(p.y, ctx));
            } else {
                ctx.lineTo(this.tx(p.x, ctx), this.ty(p.y, ctx));
            }
        });
        if (closePath) ctx.lineTo(this.tx(geometry[0].x, ctx), this.ty(geometry[0].y, ctx));
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * translate world x coordinates to drawing coordinates
     */
    private tx(x: number, ctx: CanvasRenderingContext2D): number {
        return x - this.focus.x + (ctx.canvas.width / 2);
    }
    private ty(y: number, ctx: CanvasRenderingContext2D): number {
        return ctx.canvas.height - y;
    }
}