import { Point } from './geometry';
import Lander from './lander';
import Terrain from './terrain';

export interface DrawOptions {
    stroke?: string
    fill?: string
    closePath?: boolean
    gradient?: {
        y: number
        colors: string[]
    }
}

const GREY = "rgb(240,240,240)";

export default class Renderer {
    private focus: Point
    private sky: ImageData

    private initSky() {
        let canvas = document.createElement('canvas');
        canvas.width = 3500;
        canvas.height = 800;
        let ctx = canvas.getContext('2d');
        for (let i=0; i<1000; i++) {
            let x = Math.random() * 3500;
            let yinit = Math.random();
            let y = yinit * (ctx.canvas.height - 200);
            let c = Math.floor(200 - yinit * 180);
            let s = Math.random() * 3;
            ctx.fillStyle = `rgb(${c},${c},${c})`;
            ctx.fillRect(x, y, s, s);
        }
        this.sky = ctx.getImageData(0, 0, 3500, ctx.canvas.height);
    }

    public render(ctx: CanvasRenderingContext2D, lander: Lander, terrain: Terrain) {
        if (!this.sky) this.initSky();
        this.focus = lander.position();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        let off = (this.focus.x - ctx.canvas.width / 2) / 4;
        ctx.putImageData(this.sky,
            -off, 0,
            off,  0, 
            ctx.canvas.width, ctx.canvas.height
        );
        this.draw(ctx, lander.geometry, { stroke: GREY, fill: "black", closePath: true });
        this.draw(ctx, lander.flameGeometry, { stroke: GREY });
        this.draw(ctx, terrain.geometry, { stroke: GREY, fill: "black" });
        this.draw(ctx, terrain.flagGeometry, { stroke: GREY, fill: "black" });
    }

    private draw(ctx: CanvasRenderingContext2D, geometry: Point[], opts: DrawOptions) {
        if (geometry.length === 0) return;
        ctx.beginPath();
        geometry.map((p, i) => {
            if (i === 0) {
                ctx.moveTo(this.tx(p.x, ctx), this.ty(p.y, ctx));
            } else {
                ctx.lineTo(this.tx(p.x, ctx), this.ty(p.y, ctx));
            }
        });
        if (opts.closePath) {
            ctx.lineTo(this.tx(geometry[0].x, ctx), this.ty(geometry[0].y, ctx));
        }
        if (opts.fill) {
            ctx.fillStyle = opts.fill;
            ctx.fill();
        }
        if (opts.stroke) {
            ctx.strokeStyle = opts.stroke;
            ctx.stroke();
        }
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