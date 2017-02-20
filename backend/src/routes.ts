import GAME from './game';
import { Level } from './level';
import * as express from 'express';

export class Routes {
    public readonly game = express.Router();
    public readonly level = express.Router();
    constructor() {
        this.game.get('/:seed', async (req, res) => {
            let state = GAME.setup(new Level(req.params['seed']));
            setTimeout(() => { GAME.start(state) }, 100);
            res.status(200).end();
        });
        this.level.get('/:seed', async (req, res) => {
            res.send(new Level(req.params['seed']));
        });
    }
}


