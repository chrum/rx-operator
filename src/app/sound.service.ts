import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {concat, Observable, ReplaySubject} from 'rxjs';
import {concatMap, filter, tap} from 'rxjs/operators';
import * as Tone from 'tone';
import {Compressor} from 'tone';

export enum SOUNDS {
    BassDrum,
    _bh1,
    bh_HH,
    bh_HH_1,
    bh_snare,
    BottleAir,
    Cymbal,
    Clap,
    ClosedHH,
    Chihat,
    doshysnap,
    Kick,
    kick_low,
    kick_stomp,
    OpenHH,
    Snare,
    Snare2,
    Metronome,
    tom_l,
    tom_h,
    Ride_Swim,
    tonal_Medusa,
    tonal_NightBass,
    tonal_Womper,
}

export enum TONALS {
    BassLoop_140,
    Bassloop_127_mp3,
    BassFill_123_mp3,
    PlayboyBass_120_mp3,
}

const ROLLOFF = -12;
export const MAX_FREQS = {
    low: 5000,
    high: 10000
};

type SoundsBuffer = {
    [Key in SOUNDS]?: AudioBuffer
};

@Injectable({
    providedIn: 'root'
})
export class SoundService {
    private _ready = false;
    private _ready$ = new ReplaySubject<boolean>();
    public get ready$(): Observable<boolean> { return this._ready$; }

    public availableSounds: Array<keyof SOUNDS> = [];
    public availableTonals: Array<keyof TONALS> = [];

    private _sounds: SoundsBuffer = {};
    // @ts-ignore
    private _context: AudioContext;


    public _patternVolume = new Tone.Volume(0)
        .chain(new Compressor())
        .toDestination();

    public _filters = {
        low: new Tone.Filter(MAX_FREQS.low / 2, 'lowpass', ROLLOFF).connect(this._patternVolume),
        high: new Tone.Filter(MAX_FREQS.high / 2, 'highpass', ROLLOFF).connect(this._patternVolume)
    };

    constructor(private _http: HttpClient) {
        this.availableSounds = Object.keys(SOUNDS)
            .filter((val) => isNaN(+val)) as Array<keyof SOUNDS>;
        this.availableTonals = Object.keys(TONALS)
            .filter((val) => isNaN(+val)) as Array<keyof TONALS>;
    }

    init(): void {
        if (this._ready === false) {
            this._context = new AudioContext();
            this._loadSounds()
                .subscribe(() => {
                    this._ready = true;
                    this._ready$.next(true);
                    console.log('loaded');
                });
        }
    }

    play(sound: keyof SOUNDS|SOUNDS): void {
        const source = this._context.createBufferSource();

        let key: SOUNDS;
        if (isNaN(+sound)) {
            // @ts-ignore
            key = SOUNDS[sound] as SOUNDS;
        } else {
            key = sound as SOUNDS;
        }
        source.buffer = this._sounds[key] as AudioBuffer;
        source.connect(this._context.destination);
        source.start();
    }

    private _loadSounds(): Observable<any> {
        return concat(this.availableSounds)
            .pipe(
                filter((value) => isNaN(+value)),
                concatMap((name) => this._loadSound(name))
            );
    }

    private _loadSound(name: keyof SOUNDS): Observable<any> {
        const fileUrl = `assets/audio/${name}.wav`;
        return this._http.get(fileUrl, { responseType: 'arraybuffer' })
            .pipe(
                tap((data) => {
                    this._context.decodeAudioData(data, (buffer) => {
                        // @ts-ignore
                        const key = SOUNDS[name] as SOUNDS;
                        this._sounds[key] = buffer;
                    });
                })
            );
    }

    public setFilter(type: 'low'|'high', value: number): void {
        const max = MAX_FREQS[type];
        let newValue = value * max;
        if (newValue <= 5) {
            newValue = 5;
        }
        this._filters[type].frequency.rampTo(newValue, 0);
        console.log('Freq filter[' + type + ']: ' + this._filters[type].frequency.value);
    }

    public createPatternPlayer(sound: string): Tone.Player {
        const fileUrl = `assets/audio/${sound}.wav`;
        const player = new Tone.Player({
            url: fileUrl,
            loop: false,
        })
            .fan(this._filters.high, this._filters.low);

        return player;
    }

    public setPatternVolume(volume: number): void {
        this._patternVolume.volume.value = volume;
    }

    // private _loadSound(name: keyof SOUNDS): Observable<any> {
    //     const fileUrl = `assets/audio/${name}.wav`;
    //     return new Observable<any>((subscriber) => {
    //         // const loadedSound = new Howl({
    //         //     src: [fileUrl],
    //         //     preload: true
    //         // });
    //
    //         // loadedSound.play();
    //
    //         subscriber.next();
    //         subscriber.complete();
    //     });
    //
    // }
}
