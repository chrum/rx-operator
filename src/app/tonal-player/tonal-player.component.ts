import {Component, OnInit} from '@angular/core';
import {MAX_FREQS, SoundService} from '../sound.service';
import * as Tone from 'tone';
import {Options} from '@angular-slider/ngx-slider';
import {ControllerService} from '../services/controller.service';

const ROLLOFF = -96;

@Component({
    selector: 'app-tonal-player',
    templateUrl: './tonal-player.component.html',
    styleUrls: ['./tonal-player.component.scss']
})
export class TonalPlayerComponent implements OnInit {
    volume = 50;
    volumeOptions: Options = {
        floor: 0,
        ceil: 100
    };


    public sounds = this._sound.availableTonals;
    public selectedSound: string = this.sounds[0];
    public paused = true;

    public _filters = {
        low: new Tone.Filter(MAX_FREQS.low / 2, 'lowpass', ROLLOFF).toDestination(),
        high: new Tone.Filter(MAX_FREQS.high / 2, 'highpass', ROLLOFF).toDestination()
    };

    private _player: Tone.Player;

    constructor(
        private _sound: SoundService,
        private _controller: ControllerService
    ) {
        this._setPlayer();
        this.volumeChanged();

        this._controller.volumeRight$
            .subscribe((value) => {
                this.volume = value * 100;
                this.volumeChanged();
            });

        this._controller.filterLowRight$.subscribe((value) => this.setFilter('low', value));
        this._controller.filterHighRight$.subscribe((value) => this.setFilter('high', value));

        // this._controller.playRight$.subscribe((play) => play ? this.play() : this.pause());
    }

    ngOnInit(): void {
    }

    onSoundChanged(): void {
        if (!this.paused) {
            this._player.stop();
            this._player.dispose();
        }
        this._setPlayer(!this.paused);
        this.volumeChanged();
    }

    play(): void {
        this.paused = false;
        this._player.start();
    }

    pause(): void {
        this.paused = true;
        this._player.stop();
    }

    volumeChanged(): void {
        this._player.volume.value = this.volume - 60;
    }

    public setFilter(type: 'low'|'high', value: number): void {
        let newValue = value * MAX_FREQS[type];
        if (newValue <= 0) {
            newValue = 1;
        }
        this._filters[type].frequency.rampTo(newValue, 0);
        console.log('Freq set: ' + this._filters[type].frequency.value);
    }

    private _setPlayer(autostart = false): void {
        let fileUrl = `assets/tonals/${this.selectedSound}.wav`;
        if (this.selectedSound.indexOf('_mp3') > -1) {
            fileUrl = `assets/tonals/${this.selectedSound.replace('_mp3', '.mp3')}`;
        }
        this._player = new Tone.Player({
            url: fileUrl,
            loop: true,
            autostart
        })
            .fan(this._filters.high, this._filters.low);
    }

}
