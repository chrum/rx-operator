import {PitchShift, Player} from 'tone';

export interface Steps {
    [key: number]: boolean;
}

export interface Pattern {
    player: Player;
    rate: number;
    soundName: any;
    steps: Steps;
    mute?: boolean;
}




