import { initializeGameServer } from './gameserver';
import { Routes } from './routes';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';

let routes = new Routes();
let app = express();

app.use('/', express.static(path.join(__dirname, '/../../frontend/static')));
app.use('/build', express.static(path.join(__dirname, '/../../build/frontend')));
app.use('/game', routes.game);
app.use('/level', routes.level);

let server = http.createServer(app);
server.listen(4711);
initializeGameServer(server);