import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {SOUNDS, SoundService} from '../sound.service';
import {MentronomeService} from '../services/mentronome.service';
import {Options} from '@angular-slider/ngx-slider';
import * as Tone from 'tone';
import {filter} from 'rxjs/operators';
import {METRONOME_SERVICE} from '../tokens';
import {ControllerService} from '../services/controller.service';
import {PatternsService} from '../patterns.service';

const VOL_STEP = 2;
const VOL_RANGE = 100;

@Component({
    selector: 'app-composer-full',
    templateUrl: './composer-full.component.html',
    styleUrls: ['./composer-full.component.scss']
})
export class ComposerFullComponent implements OnInit {
    public metronomeOn = false;
    public get externalEnabled(): boolean { return this._controller.isExternalControllerEnabled; }

    currentPattern = 1;
    bpm = 120;
    bpmOptions: Options = {
        floor: 20,
        ceil: 218
    };
    volume = 50;
    patternVolume = 50;
    volumeOptions: Options = {
        floor: 0,
        ceil: VOL_RANGE
    };

    delay = 0;
    delayOptions: Options = {
        floor: 0,
        ceil: 1000,
        step: 1
    };

    public paused$ = this._metronome.paused$;
    public signal$ = this._metronome.signal$;

    constructor(
        private _sound: SoundService,
        private _pattern: PatternsService,
        private _controller: ControllerService,
        @Inject(METRONOME_SERVICE) private _metronome: MentronomeService
    ) {
        this.volumeChanged();
        this.bpmChanged();

        this._controller.gainLeft$
            .subscribe((value) => {
                this.volume = value * VOL_RANGE;
                this.volumeChanged();
            });


        this._controller.volumeLeft$
            .subscribe((value) => {
                this.patternVolume = value * VOL_RANGE;
                this.patternVolumeChanged();
            });

        this._controller.filterLowLeft$.subscribe((value) => this._sound.setFilter('low', value));
        this._controller.filterHighLeft$.subscribe((value) => this._sound.setFilter('high', value));

        this._controller.playLeft$.subscribe((play) => play ? this.play() : this.pause());
    }

    ngOnInit(): void {
        this._metronome.signal$
            .pipe(filter(() => this.metronomeOn))
            .subscribe(() => {
                this._sound.play(SOUNDS.Metronome);
            });
    }

    bpmChanged(): void {
        this._metronome.setBpm(this.bpm);
    }

    delayChanged(): void {
        this._metronome.changeDelay(this.delay);
    }

    volumeChanged(): void {
        Tone.Destination.volume.value = this.volume - 50;
    }

    patternVolumeChanged(): void {
        this._sound.setPatternVolume(this.patternVolume - 50);
    }

    changeBpm(diff: number): void {
        this.bpm = this.bpm + diff;
        this.bpmChanged();
    }

    changeVolume(diff: number): void {
        this.volume = this.volume + diff;
        this.volumeChanged();
    }

    changeTempo(tempo: number): void {
        this._metronome.changeInterval(tempo);
    }

    play(): void {
        this._metronome.start();
    }

    pause(): void {
        this._metronome.pause();
    }

    cue(): void {
        this._metronome.cue();
    }
}
