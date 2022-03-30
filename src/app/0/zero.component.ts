import {Component} from '@angular/core';
import {interval} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'app-zero',
    templateUrl: './zero.component.html',
    styleUrls: ['./zero.component.scss']
})
export class ZeroComponent {
    public paused = true;

    public signal = 0;

    constructor() {

    }


    play(): void {
        this.paused = false;
    }

    pause(): void {
        this.paused = true;
    }
}
