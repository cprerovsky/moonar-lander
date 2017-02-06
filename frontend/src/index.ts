import { Vector } from './geometry';
import GAME from './game';
import UI from './ui';
import { GameState } from './game';
import { init } from './keyboard';

let canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
let ctx = canvas.getContext("2d");
let state: GameState;

UI.init(ctx,
    (level) => { state = GAME.setup(ctx, level); },
    () => { GAME.start(state); },
    (level) => {
        state = GAME.setup(ctx, level, () => {
            init(() => { GAME.start(state); });
        });
    },
    () => { GAME.teardown(state); state = null; }
);
