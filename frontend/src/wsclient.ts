import { Messages } from '../../backend/src/messages';
import { render, setLevel } from './render';
import UI from './ui';
import { Vector } from '../../backend/src/geometry';

export module WSClient {
    let ctx: CanvasRenderingContext2D;
    let ws: WebSocket;

    export function init(ctx: CanvasRenderingContext2D) {
        ws = new WebSocket(location.href.replace('http', 'ws'));
        ws.onmessage = (ev) => {
            onMessage(ev.data, ctx);
        };
        ws.onopen = (ev) => {
            console.log('WS connection opened', ev);
            // request upgrade to viewer connection
            ws.send(JSON.stringify({ viewer: true }));
        };
        ws.onclose = (ev) => {
            console.log('WS connection closed', ev);
        };
        ws.onerror = (ev) => {
            console.error(ev);
        }
    }
}
let flagPosition: Vector;

function onMessage(msgstr: string, ctx: CanvasRenderingContext2D) {
    let msg: Messages.PlayersMsg | Messages.LevelMsg | Messages.GameStartMsg | Messages.LandersMsg | Messages.GameOverMsg = JSON.parse(msgstr);
    if (Messages.isPlayersMsg(msg)) {
        UI.setPlayers(msg);
    } else if (Messages.isLevelMsg(msg)) {
        setLevel(msg);
        flagPosition = msg.flagPosition;
    } else if (Messages.isLandersMsg(msg)) {
        render(ctx, msg.landers);
        UI.update(msg.landers, flagPosition);
    } else if (Messages.isGameStartMsg(msg)) {
        UI.setPlayers(msg);
    } else if (Messages.isGameOverMsg(msg)) {
        UI.gameover(msg);
    }
}

