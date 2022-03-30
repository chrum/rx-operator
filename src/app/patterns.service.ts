import {Inject, Injectable} from '@angular/core';
import {MentronomeService} from './services/mentronome.service';
import {Pattern} from './definitions';
import {METRONOME_SERVICE} from './tokens';
import {SoundService} from './sound.service';

@Injectable({
    providedIn: 'root'
})
export class PatternsService {
    private _data: Array<Pattern> = [];


    constructor(
        @Inject(METRONOME_SERVICE) private _metronome: MentronomeService,
        private _sound: SoundService
    ) {
        this._metronome.signal$
            .subscribe((step) => {
                this._data.forEach((pattern) => {
                    if (!pattern.mute && pattern?.steps[step]) {
                        if (pattern.player.loaded) {
                            pattern.player.start();
                        }
                    }
                });
            });
    }

    initializePattern(pattern: number, sound: string): Pattern {
        if (!this._data[pattern]) {
            const player = this._sound.createPatternPlayer(sound);
            this._data[pattern] = {
                player,
                rate: 1,
                soundName: sound,
                steps: {}
            };
        }

        return this._data[pattern];
    }

    getPattern(pattern: number): Pattern|null {
        if (this._data[pattern]) {
            return this._data[pattern];
        }

        return null;
    }

    setSound(pattern: number, sound: string): void {
        this._data[pattern].player = this._sound.createPatternPlayer(sound);
        this._data[pattern].player.playbackRate = this._data[pattern].rate;
        this._data[pattern].soundName = sound;
    }

    setRate(pattern: number, rate: number): void {
        this._data[pattern].player.playbackRate = rate;
        this._data[pattern].rate = rate;
    }

    toggleMute(pattern: number, mute: boolean): void {
        this._data[pattern].mute = mute;
    }

    clearPattern(pattern: number): void {
        const steps = this._data[pattern].steps;
        for (const idx in steps) {
            if (steps.hasOwnProperty(idx)) {
                steps[idx] = false;
            }
        }
    }

    fillPattern(pattern: number, fields: Array<number>): void {
        const steps = this._data[pattern].steps;
        for (const field of fields) {
            steps[field] = true;
        }
    }


    setStep(pattern: number, step: number, state: boolean): void {
        this._data[pattern].steps[step] = state;
    }
}


