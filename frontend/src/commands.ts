import { EngineState, RotationDirection, Lander } from './lander';
export class Command {
    constructor(
        public readonly token: string,
        public readonly engine?: EngineState,
        public readonly rotation?: RotationDirection,
        public readonly tick?: number
    ) { }
}

export type Commands = Command[];
