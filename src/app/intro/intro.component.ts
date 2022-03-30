import {Component, OnInit} from '@angular/core';
import {SoundService} from '../sound.service';
import {Router} from '@angular/router';
import * as Tone from 'tone';

@Component({
    selector: 'app-intro',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {

    constructor(
        private _sound: SoundService,
        private _router: Router
    ) {
    }

    ngOnInit(): void {
    }


    start(): void {
        this._sound.init();
        Tone.start();
        this._router.navigate(['/composer']);
    }
}
