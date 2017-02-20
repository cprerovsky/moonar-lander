import { WSClient } from './wsclient';
import { init } from './keyboard';
import UI from './ui';

let canvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement;
let ctx = canvas.getContext('2d');
WSClient.init(ctx);
UI.init(ctx);
