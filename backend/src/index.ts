import { WebSocketServer } from 'ws';
import * as path from 'path';
import * as express from 'express';
import * as http from 'http';
let app = express();

app.use(express.static(path.join(__dirname + '/../../frontend/static', '/')));
app.use(express.static(path.join(__dirname + '/../../frontend/build', '/build')));

let server = http.createServer(app);
server.listen(80);

let wss = new WebSocketServer({ server: server });
wss.on('connection', function (ws) {
    ws.on('message', function (msg) {
        ws.send(msg);
    });
});
