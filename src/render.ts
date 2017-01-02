import { Vector, Geometry, translate, LANDER_GEOMETRY, LANDER_FLAME_GEOMETRY } from './geometry';
import { Lander } from './lander';

interface DrawOptions {
    stroke?: string
    fill?: string
    closePath?: boolean
    gradient?: {
        y: number
        colors: string[]
    },
    parallax?: number
}

const GREY = "rgb(240,240,240)";

/**
 * genreates a skybox
 */
export function sky(width: number, height: number): ImageData {
    let canvas = document.createElement('canvas');
    canvas.width = width; // 3500
    canvas.height = height; // 800
    let ctx = canvas.getContext('2d');
    for (let i = 0; i < 1000; i++) {
        let x = Math.random() * width;
        let yinit = Math.random();
        let y = yinit * (height - 200);
        let c = Math.floor(200 - yinit * 180);
        let s = Math.random() * 3;
        ctx.fillStyle = `rgb(${c},${c},${c})`;
        ctx.fillRect(x, y, s, s);
    }
    return ctx.getImageData(0, 0, 3500, ctx.canvas.height);
}

export function render(ctx: CanvasRenderingContext2D, focus: Vector, lander: Lander, fgTerrain: Geometry, bgTerrain: Geometry, sky: ImageData) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let off = (focus.x - ctx.canvas.width / 2) / 4;
    ctx.putImageData(sky,
        -off, 0,
        off, 0,
        ctx.canvas.width, ctx.canvas.height
    );
    draw(ctx, bgTerrain, focus, { stroke: "rgb(50,50,50)", fill: "black", parallax: 0.5 });
    draw(ctx, fgTerrain, focus, { stroke: GREY, fill: "black" });
    // draw(ctx, terrain.flagGeometry, { stroke: GREY, fill: "black" });
    draw(ctx, LANDER_GEOMETRY.map((v) => translate(v, lander.position, lander.angle)), focus, { stroke: GREY, fill: "black", closePath: true });
    draw(ctx, LANDER_FLAME_GEOMETRY.map((v) => translate(v, lander.position, lander.angle)), focus, { stroke: GREY });
}

function draw(ctx: CanvasRenderingContext2D, geometry: Geometry, focus: Vector, opts: DrawOptions) {
    if (geometry.length === 0) return;
    let prx = opts.parallax || 1;
    ctx.beginPath();
    geometry.map((p, i) => {
        if (i === 0) {
            ctx.moveTo(tx(p.x, ctx, focus.x, prx), ty(p.y, ctx));
        } else {
            ctx.lineTo(tx(p.x, ctx, focus.x, prx), ty(p.y, ctx));
        }
    });
    if (opts.closePath) {
        ctx.lineTo(tx(geometry[0].x, ctx, focus.x, prx), ty(geometry[0].y, ctx));
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
function tx(x: number, ctx: CanvasRenderingContext2D, focusX: number, parallax: number): number {
    return x - focusX * parallax + (ctx.canvas.width / 2);
}
function ty(y: number, ctx: CanvasRenderingContext2D): number {
    return ctx.canvas.height - y;
}
