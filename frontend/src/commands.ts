import { EngineState, RotationDirection, Lander, tick } from './lander';
export class ClientCommand {
    constructor(
        public readonly engine?: EngineState,
        public readonly rotation?: RotationDirection,
        public readonly tick?: number
    ) { }    
}

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
