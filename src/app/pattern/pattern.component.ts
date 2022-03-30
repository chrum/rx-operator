import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Pattern, Steps} from '../definitions';
import {PatternsService} from '../patterns.service';
import {SoundService} from '../sound.service';
import {Options} from '@angular-slider/ngx-slider';

@Component({
    selector: 'app-pattern',
    templateUrl: './pattern.component.html',
    styleUrls: ['./pattern.component.scss']
})
export class PatternComponent implements OnInit, OnDestroy {
    public patternFields = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    private _patternNum: number;
    @Input() set patternNum(value: number) {
        this._patternNum = value;
        let pattern = this._patterns.getPattern(this._patternNum);
        if (!pattern) {
            pattern = this._patterns.initializePattern(this._patternNum, this.selectedSound);
        }

        this.selectedSound = pattern.soundName;
        this.rate = pattern.rate;
        this.steps = pattern.steps;
        this.mute = !!pattern.mute;
    }
    @Input() signal$: Observable<number>;
    public signalPosition: number;
    private _signalSub: Subscription;

    public mute = false;

    public steps: Steps = {};
    public sounds = this._sound.availableSounds;
    public selectedSound = this.sounds[0];

    public rate = 1;
    public rateOptions: Options = {
        floor: 0,
        ceil: 2,
        step: 0.01
    };

    constructor(
        private _patterns: PatternsService,
        private _sound: SoundService
    ) {
    }

    ngOnInit(): void {
        this._signalSub = this.signal$.subscribe((signalPosition) => {
            this.signalPosition = signalPosition;
        });
    }

    ngOnDestroy(): void {
        this._signalSub.unsubscribe();
    }

    clear(): void {
        this._patterns.clearPattern(this._patternNum);
    }

    fill(): void {
        this._patterns.fillPattern(this._patternNum, this.patternFields);
    }

    toggleMute(): void {
        this.mute = !this.mute;
        this._patterns.toggleMute(this._patternNum, this.mute);
    }

    toggleStep(step: number, state: boolean): void {
        this._patterns.setStep(this._patternNum, step, state);
    }

    changeSound(): void {
        this._patterns.setSound(this._patternNum, this.selectedSound);
    }

    pitchChanged(): void {
        this._patterns.setRate(this._patternNum, this.rate);
    }

}
