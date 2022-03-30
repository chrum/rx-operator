interface TockOptions {
    interval: number;
    callback(): void;
    complete?(): void;
}

declare class Tock {
    constructor(options: TockOptions);
    start(): void;
    stop(): void;
}
