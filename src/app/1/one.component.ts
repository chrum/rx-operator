import {Component, OnInit} from '@angular/core';
import {interval} from 'rxjs';
import {Options} from '@angular-slider/ngx-slider';
import {filter, switchMap} from 'rxjs/operators';

@Component({
    selector: 'app-one',
    templateUrl: './one.component.html',
    styleUrls: ['./one.component.scss']
})
export class OneComponent {
    bpm = 120;
    bpmOptions: Options = {
        floor: 20,
        ceil: 218
    };
    public paused = true;

    public signal = 0;

    constructor() {
        interval(500)
            .pipe(
                filter(() => !this.paused)
            )
            .subscribe((signal) => {
                this.signal = signal;
            });
    }

    play(): void {
        this.paused = false;
    }

    pause(): void {
        this.paused = true;
    }

    bpmChanged(): void {
        const newPeriod = 60000 / this.bpm;
        console.log('New period', newPeriod);
    }
}
