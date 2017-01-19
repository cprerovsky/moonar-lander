import { Vector } from './geometry';
import GAME from './game';
import UI from './ui';
import { GameState } from './game';

let canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let ctx = canvas.getContext("2d");
let state: GameState;

UI.init((seed) => { state = GAME.setup(ctx, seed); },
    () => { GAME.start(state); },
    () => { GAME.teardown(state); state = null; });
