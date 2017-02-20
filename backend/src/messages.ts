import { Lander } from './lander';
import { Level } from './level';

export module Messages {
    export type PlayersMsg = { players: string[] };
    export function isPlayersMsg(o: any): o is PlayersMsg { return !!o.players; };
    export type LevelMsg = Level;
    export function isLevelMsg(o: any): o is LevelMsg { return !!o.terrain; };
    export type GameStartMsg = { game: string, players: { player: string, color: string }[] };
    export function isGameStartMsg(o: any): o is GameStartMsg { return o.game === 'start'; };
    export type LanderMsg = Lander;
    export type LandersMsg = { landers: Lander[] };
    export function isLandersMsg(o: any): o is LandersMsg { return !!o.landers; };
    export class GameOverMsg {
        game: string = 'over';
        points: {
            name: string;
            points: number;
        }[] = [];
    }
    export function isGameOverMsg(o: any): o is GameOverMsg { return o.game === 'over'; };
}
