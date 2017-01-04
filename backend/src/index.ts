import * as path from 'path';
import * as express from 'express';
import * as http from 'http';
import { Server as WebSocketServer } from 'ws';
let app = express();

app.use(express.static(path.join(__dirname + '/../../frontend/static', '/')));
app.use(express.static(path.join(__dirname + '/../../frontend/build', '/build')));

let server = http.createServer(app);
server.listen(4711);

let wss = new WebSocketServer({ server: server });

class KEYS {
    public static HOST = 'host'
    public static TOKEN = 'token'
}

wss.on('connection', function (ws) {
    if (!hasHostSocket(wss)) {
        ws[KEYS.HOST] = true;
        ws.send(JSON.stringify({ host: true }));
        console.log('connect host');
    } else {
        let t = token();
        console.log('connect client ' + t);
        ws[KEYS.TOKEN] = t;
        ws.send(JSON.stringify({ token: t }));
    }

    ws.on('message', (data) => message(wss, ws, data));
    ws.on('error', (e) => console.log(e));
});

function message(wss: WebSocketServer, ws: WebSocket, data: any) {
    console.log('message' + data);
    if (ws[KEYS.HOST]) {
        let hc = toHostCommand(data);
        switch (hc.cmd) {
            case 'to':
                clientSocket(wss, hc.val).send(hc.data);
                break;
            case 'broadcast':
                wss.broadcast(data);
                break;
        }
    } else {
        hostSocket(wss).send(data);
    }
}

function hasHostSocket(wss: WebSocketServer): boolean {
    return wss.clients.filter((ws) => !!ws[KEYS.HOST]).length === 1;
}

function hostSocket(wss: WebSocketServer): WebSocket {
    return wss.clients.filter((ws) => !!ws[KEYS.HOST])[0];
}

function clientSocket(wss: WebSocketServer, token: string): WebSocket {
    return wss.clients.filter((ws) => ws[KEYS.TOKEN] === token)[0];
}

class HostCommand {
    constructor(public readonly cmd: 'to' | 'broadcast',
        public readonly val: string,
        public readonly data: string) { }
}

function toHostCommand(msg) {
    let parts = msg.split('\n');
    let cmdval = parts[0].split(':');
    return new HostCommand(cmdval[0], cmdval[1], parts[1]);
}

/**
 * generate a random token
 * http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 */
function token(): string {
    let token = "";
    let set = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 20; i++) {
        token += set.charAt(Math.floor(Math.random() * set.length));
    }
    return token;
}

// C > S
/*

> token:\n
> register:clemens-blablabla

< token:asdf

turn into a single gameinfo:
< terrain:{ terrain: [{3,7}, ... ]}
< flag:{1,2}
< lander:{ ... }

< game:start

> token:asdf\n
> commands: [ { engine: "half", rotate: "cw", ... }, ... ] }

< lander:{ position: ..., velocity: ... }

> commands: ...

...

< game:over
< won:true
< crashed:true
*/