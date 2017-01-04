import * as path from 'path';
import * as express from 'express';
import * as http from 'http';
import { Server as WebSocketServer } from 'uws';
let app = express();

app.use(express.static(path.join(__dirname + '/../../frontend/static', '/')));
app.use(express.static(path.join(__dirname + '/../../frontend/build', '/build')));

let server = http.createServer(app);
server.listen(4711);

let wss = new WebSocketServer({ server: server });

wss.on('connection', function (ws) {
    if (!hasGameHost(wss)) {
        ws['GAME_HOSE'] = true;
    } else {
        ws['TOKEN'] = token();
        ws.send(JSON.stringify(token));
    }
    // ws.on('message', );
    // ws.send('something');
});

function hasGameHost(wss: WebSocketServer): boolean {
    return wss.clients.filter(ws => !!ws['GAME_HOST']).length === 1;
}


/**
 * generate a random token
 * http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 */
function token(): string {
    let text = "";
    let set = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 20; i++) {
        text += set.charAt(Math.floor(Math.random() * set.length));
    }
    return text;
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