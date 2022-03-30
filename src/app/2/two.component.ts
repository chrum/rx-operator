import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, interval, Subject, timer} from 'rxjs';
import {Options} from '@angular-slider/ngx-slider';
import {debounce, debounceTime, filter, switchMap} from 'rxjs/operators';
import {SOUNDS, SoundService} from '../sound.service';

@Component({
    selector: 'app-two',
    templateUrl: './two.component.html',
    styleUrls: ['./two.component.scss']
})
export class TwoComponent {
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
                switchMap((period) => interval(period)),
                filter(() => !this.paused)
            )
            .subscribe((signal) => {
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
