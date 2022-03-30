import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, interval, NEVER, Observable, of, timer} from 'rxjs';
import {
    debounce,
    debounceTime,
    delay,
    filter,
    map,
    pluck,
    scan,
    share,
    switchMap,
    tap,
    withLatestFrom
} from 'rxjs/operators';



@Injectable()
export class MentronomeService {
    private _paused$ = new BehaviorSubject<boolean>(true);
    public paused$ = this._paused$.asObservable();
    private _reset$ = new BehaviorSubject<boolean>(true);
    private _interval$ = new BehaviorSubject(1000);
    private _delay$ = new BehaviorSubject(0);
    private _paused = true;

    public get paused(): boolean { return this._paused; }

    public signal$: Observable<number> = combineLatest([
        this._paused$,
        this._interval$,
        this._delay$,
        this._reset$.pipe(filter((value) => value))
    ]).pipe(
            debounceTime(100),
            switchMap(([paused, period, delayTime]) => {
                if (paused) {
                    return NEVER;
                }

                return this._realTimer(period)
                    .pipe(
                        delay(delayTime)
                    );
            }),
            withLatestFrom(this._reset$),
            scan((acc, [irrelevamt, reset]) => {
                if (reset) {
                    this._reset$.next(false);
                    return 0;
                }

                if (acc >= 15) {
                    return 0;
                }

                return ++acc;
            }, -1),
            share(),
        );

    constructor() {

    }

    public start(): void {
        this._paused$.next(false);
    }

    public changeInterval(period: number): void {
        this._interval$.next(period);
    }

    public changeDelay(delayTime: number): void {
        this._delay$.next(delayTime);
    }

    public setBpm(bpm: number): void {
        const newInterval = 60000 / (bpm * 4);
        this.changeInterval(newInterval);
    }

    public cue(): void {
        this._reset$.next(true);
    }

    public pause(): void {
        this._paused$.next(true);
    }

    private _realTimer(period: number): Observable<any> {
        console.log('Using period (ms) ' + period);
        return new Observable<void>((subscriber) => {
            const tockTimer = new Tock({
                interval: period,
                callback: () => {
                    // console.log('TICK for: ' + period);
                    subscriber.next();
                },
                complete: () => subscriber.complete()
            });

            tockTimer.start();

            return () => {
                tockTimer.stop();
            };
        });
    }
}
