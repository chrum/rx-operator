import {Injectable, NgZone} from '@angular/core';
import {Observable, OperatorFunction, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, scan, tap} from 'rxjs/operators';

const ASSISTANT = 3;
const PLAY_BUTTON = 7;
const VOLUME_LEFT = 0;
const FILTER_LEFT = 1;
const FILTER_LOW_LEFT = 2;
const FILTER_HIGH_LEFT = 4;
const GAIN = 5;

export function extractControlValue(controlNote: number, zone: NgZone): OperatorFunction<WheelMovement, number> {
    return (source) => {
        return source.pipe(
            filter((data) => data.note === controlNote),
            map((data) => data.velocity),
            map((velocity) => parseFloat(velocity.toPrecision(2))),
            distinctUntilChanged(),
            debounceTime(50),
            runInZone(zone)
        );
    };
}

export function runInZone<T>(zone: NgZone): OperatorFunction<T, T> {
    return (source) => {
        return new Observable(observer => {
            const onNext = (value: T) => zone.run(() => observer.next(value));
            const onError = (e: any) => zone.run(() => observer.error(e));
            const onComplete = () => zone.run(() => observer.complete());
            return source.subscribe(onNext, onError, onComplete);
        });
    };
}

interface WheelMovement {
    note: number;
    velocity: number;
}

@Injectable({
    providedIn: 'root'
})
export class ControllerService {
    private _enabled = false;
    public get isExternalControllerEnabled(): boolean {
        return this._enabled;
    }

    private _rawButtons$ = new Subject<WheelMovement & { channel: number }>();
    private _buttons$ = this._rawButtons$.pipe(filter(() => this._enabled));
    private _rawWheels$ = new Subject<WheelMovement & { channel: number }>();
    private _wheels$ = this._rawWheels$.pipe(filter(() => this._enabled));

    private _leftButtons$ = this._buttons$.pipe(filter((data) => data.channel === 1));
    private _centerButtons$ = this._buttons$.pipe(filter((data) => data.channel === 0));
    private _rightButtons$ = this._buttons$.pipe(filter((data) => data.channel === 2));

    private _leftWheel$ = this._wheels$.pipe(filter((data) => data.channel === 1));
    private _rightWheel$ = this._wheels$.pipe(filter((data) => data.channel === 2));

    public assistant$ = this._rawButtons$
        .pipe(
            filter((data) => data.channel === 0),
            extractControlValue(ASSISTANT, this._zone),
            scan((acc, val) => val ? !acc : acc, false),
            tap((value) => this._enabled = value)
        ).subscribe();

    public playLeft$ = this._leftButtons$.pipe(
        extractControlValue(PLAY_BUTTON, this._zone),
        scan((acc, val) => val ? !acc : acc, false)
    );
    public volumeLeft$ = this._leftWheel$.pipe(extractControlValue(VOLUME_LEFT, this._zone));
    public filterLeft$ = this._leftWheel$.pipe(extractControlValue(FILTER_LEFT, this._zone));
    public filterLowLeft$ = this._leftWheel$.pipe(extractControlValue(FILTER_LOW_LEFT, this._zone));
    public filterHighLeft$ = this._leftWheel$.pipe(extractControlValue(FILTER_HIGH_LEFT, this._zone));

    public gainLeft$ = this._rawWheels$.pipe(
        filter((data) => data.channel === 1),
        extractControlValue(GAIN, this._zone)
    );

    public playRight$ = this._rightButtons$.pipe(
        extractControlValue(PLAY_BUTTON, this._zone),
        scan((acc, val) => val ? !acc : acc, false)
    );
    public volumeRight$ = this._rightWheel$.pipe(extractControlValue(VOLUME_LEFT, this._zone));
    public filterRight$ = this._rightWheel$.pipe(extractControlValue(FILTER_LEFT, this._zone));
    public filterLowRight$ = this._rightWheel$.pipe(extractControlValue(FILTER_LOW_LEFT, this._zone));
    public filterHighRight$ = this._rightWheel$.pipe(extractControlValue(FILTER_HIGH_LEFT, this._zone));


    constructor(
        private _zone: NgZone
    ) {
        if (window.navigator && 'function' === typeof (window.navigator as any).requestMIDIAccess) {
            (window.navigator as any).requestMIDIAccess()
                .then((access: any) => {

                    // Get lists of available MIDI controllers
                    const inputs = access.inputs.values();
                    this._connectInputs(inputs);
                    const outputs = access.outputs.values();

                    access.onstatechange = (e: any) => {

                        // Print information about the (dis)connected MIDI controller
                        console.log(e.port.name, e.port.manufacturer, e.port.state);
                    };
                });
        } else {
            alert('No Web MIDI support');
        }
    }

    private _connectInputs(inputs: any): void {
        for (const entry of inputs) {
            console.log('MIDI input device: ' + entry.id);
            entry.onmidimessage = (e: any) => this._onMidiMessage(e);
        }
    }

    private _onMidiMessage(midiEvent: any): void {
        // Parse the MIDIMessageEvent.
        const parsed = this._parseMidiMessage(midiEvent);
        const {command, channel, note, velocity} = parsed;
        // console.log(parsed);
        // Stop command.
        // Negative velocity is an upward release rather than a downward press.
        if (command === 8) {
            if (channel === 0) {
                // this._onNote(note, -velocity);
            } else if (channel === 9) {
                this._onPad(note, -velocity);
            }
        }

        // Start command.
        else if (command === 9) {
            this._rawButtons$.next({channel, note, velocity});
        }

        // Knob command.
        else if (command === 11) {
            this._rawWheels$.next({channel, note, velocity});
        }

        // Pitch bend command.
        else if (command === 14) {
            this._onPitchBend(velocity);
        }
    }

    private _parseMidiMessage(message: any): any {
        return {
            command: message.data[0] >> 4,
            channel: message.data[0] & 0xf,
            note: message.data[1],
            velocity: message.data[2] / 127
        };
    }


    private _onPad(note: any, velocity: any): void {

    }

    private _onPitchBend(velocity: any): void {

    }

}
