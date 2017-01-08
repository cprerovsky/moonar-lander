import { Vector, Geometry, translate, LANDER_GEOMETRY, landerFlameGeometry, FLAG_GEOMETRY, add, length } from './geometry';
import { Lander } from './lander';
import { uniqueColor } from './color';
import { Store } from './game';

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
const MED_GREY = "rgb(150,150,150)";
const DARK_GREY = "rgb(50,50,50)";

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
        let c = Math.round(200 - yinit * 180);
        let s = Math.random() * 3;
        ctx.fillStyle = `rgb(${c},${c},${c})`;
        ctx.fillRect(x, y, s, s);
    }
    return ctx.getImageData(0, 0, 3500, ctx.canvas.height);
}

// good lord, this is horrible - please refactor me!
let circles: number[] = [0];
/**
 * render state to the canvas
 */
export function render(ctx: CanvasRenderingContext2D, focus: Vector, landers: Lander[], fgTerrain: Geometry, bgTerrain: Geometry, sky: ImageData, flagPosition: Vector) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let off = (focus.x - ctx.canvas.width / 2) / 4;
    ctx.putImageData(sky,
        -off, 0,
        off, 0,
        ctx.canvas.width, ctx.canvas.height
    );
    draw(ctx, bgTerrain, focus, { stroke: DARK_GREY, fill: "black", parallax: 0.5 });
    draw(ctx, FLAG_GEOMETRY.map((v) => add(v, flagPosition)), focus, { stroke: GREY, fill: "black" });
    // poor man's implementation of radar blips
    circles = circles.map((r) => {
        let c = 100 - Math.floor(100 / 5000 * r);
        circle(ctx, flagPosition, focus, r, `rgb(${c},${c},${c})`);
        return (r <= 200) ? ++r : r + r / 200;
    }).filter((r, i, a) => {
        return r < 5000;
    });
    if (circles[circles.length - 1] === 200) circles.push(0);
    draw(ctx, fgTerrain, focus, { stroke: GREY, fill: "black" });
    landers.map((lander) => {
        draw(ctx, LANDER_GEOMETRY.map((v) => 
            translate(v, lander.position, lander.angle)),
            focus, { stroke: lander.color, fill: "black", closePath: true });
        if (lander.engine !== "off") {
            draw(ctx, landerFlameGeometry(lander.engine).map((v) =>
                translate(v, lander.position, lander.angle)),
                focus, { stroke: lander.color });
        }
    });
}

function circle(ctx: CanvasRenderingContext2D, center: Vector, focus: Vector, radius: number, strokeStyle: string) {
    ctx.beginPath();
    ctx.arc(tx(center.x, ctx, focus.x), ty(center.y, ctx), radius, 0, Math.PI * 2);
    ctx.strokeStyle = strokeStyle;
    // ctx.setLineDash([3, 20]);
    ctx.stroke();
    ctx.closePath();
}

function draw(ctx: CanvasRenderingContext2D, geometry: Geometry, focus: Vector, opts: DrawOptions) {
    if (geometry.length === 0) return;
    let prx = opts.parallax || 1;
    ctx.beginPath();
    ctx.setLineDash([]);
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
function tx(x: number, ctx: CanvasRenderingContext2D, focusX: number, parallax: number = 1): number {
    return x - focusX * parallax + (ctx.canvas.width / 2);
}
function ty(y: number, ctx: CanvasRenderingContext2D): number {
    return ctx.canvas.height - y;
}
