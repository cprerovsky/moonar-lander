import { EngineState, RotationDirection, Lander, tick } from './lander';

/**
 * a lander command object as sent from a game client
 */
export class ClientCommand {
    constructor(
        public readonly engine?: EngineState,
        public readonly rotation?: RotationDirection,
        public readonly tick?: number
    ) { }    
}

/**
 * a lander command object as stored in state
 * this one adds the token so it can be referenced to a lander
 */
export class Command extends ClientCommand {
    constructor(
        public readonly token: string,
        public readonly engine?: EngineState,
        public readonly rotation?: RotationDirection,
        public readonly tick?: number
    ) {
        super(engine, rotation, tick);
        this.token = token;
    }
}

export type Commands = Command[];
