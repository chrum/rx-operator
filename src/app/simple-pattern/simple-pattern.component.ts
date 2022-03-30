import {Component, Input} from '@angular/core';
import {Steps} from '../definitions';
import {PatternsService} from '../patterns.service';
import {SoundService} from '../sound.service';
import * as Tone from 'tone';

@Component({
    selector: 'app-simple-pattern',
    templateUrl: './simple-pattern.component.html',
    styleUrls: ['./simple-pattern.component.scss']
})
export class SimplePatternComponent {
    public patternFields = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    @Input() set signal(value: number) {
        this.signalPosition = value;
        if (this._enabled[value]) {
            if (this._player.loaded) {
                this._player.start();
            }
        }
    }
    public signalPosition: number;

    public steps: Steps = {};
    public sounds = this._sound.availableSounds;
    public selectedSound = this.sounds[0];

    private _enabled: {[key: number]: boolean} = {};
    private _player: Tone.Player;

    constructor(
        private _patterns: PatternsService,
        private _sound: SoundService
    ) {
        this._player = this._sound.createPatternPlayer(this.selectedSound);
    }

    toggleStep(step: number, state: boolean): void {
        this._enabled[step] = state;
    }

    changeSound(): void {
        if (this._player) {
            this._player.dispose();
        }
        this._player = this._sound.createPatternPlayer(this.selectedSound);
    }

}
