import {Component} from '@angular/core';
import {BehaviorSubject, interval, timer} from 'rxjs';
import {Options} from '@angular-slider/ngx-slider';
import {debounceTime, filter, scan, switchMap} from 'rxjs/operators';
import {SOUNDS, SoundService} from '../sound.service';

@Component({
    selector: 'app-three',
    templateUrl: './three.component.html',
    styleUrls: ['./three.component.scss']
})
export class ThreeComponent {
    bpm = 120;
    bpmOptions: Options = {
        floor: 20,
        ceil: 218
    };

    private _period$ = new BehaviorSubject<number>(500);

    public paused = true;
    public signal = 0;

    constructor(private _sound: SoundService) {
        this._period$
            .pipe(
                debounceTime(100),
                switchMap((period) => timer(0, period)),
                filter(() => !this.paused)
            )
            .subscribe((signal) => {
                this._sound.play(SOUNDS.Metronome);
                this.signal = signal;
            });

        this._sound.init();
    }

    play(): void {
        this.paused = false;
    }

    pause(): void {
        this.paused = true;
    }

    bpmChanged(): void {
        const newPeriod = 60000 / this.bpm;
        this._period$.next(newPeriod);
    }
}
