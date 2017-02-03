import { ClientCommand } from './commands';
/**
 * initialize keyboard controls, connect player, then invoke callback
 */
export function init(cb: Function) {
    let ws = new WebSocket(`ws://${location.hostname}:${location.port}`);
    let keyupListener, keydownListener;

    ws.onmessage = (msg) => {
        // turn away thine eyes for setTimeout hath overome me
        // I know how ugly this is but I'm too lazy to callback
        setTimeout(() => {
            let data = JSON.parse(msg.data);
            if (data.token) {
                let token = data.token;
                ws.send(JSON.stringify({ token: token, name: 'Player 1' }));
                keyupListener = (e) => { send(ws, token, keyup(e)) };
                keydownListener = (e) => { send(ws, token, keydown(e)) };
                document.addEventListener('keyup', keyupListener);
                document.addEventListener('keydown', keydownListener);
                setTimeout(cb, 200); // aaaand one more time
            }
        }, 200);
    }
    ws.onclose = () => {
        document.removeEventListener('keyup', keyupListener);
        document.removeEventListener('keydown', keydownListener);
    }
}

function send(ws: WebSocket, token: string, cmd: ClientCommand) {
    ws.send(JSON.stringify({ token: token, commands: [cmd] }));
}

function keyup(event: KeyboardEvent): ClientCommand {
    switch (event.keyCode) {
        case 37:
        case 39:
            // Right Arrow key
            return { rotation: "off" };
        case 38:
        case 40:
            // Up Arrow key
            return { engine: "off" };
    }
}

function keydown(event: KeyboardEvent): ClientCommand {
    switch (event.keyCode) {
        case 37:
            // Left Arrow key
            return { rotation: "ccw" };
        case 39:
            // Right Arrow key
            return { rotation: "cw" };
        case 38:
            // Up Arrow key
            return { engine: "full" };
        case 40:
            // Down
            return { engine: "half" };
    }
}