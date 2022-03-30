import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output} from '@angular/core';

@Component({
    selector: 'app-sound',
    templateUrl: './sound.component.html',
    styleUrls: ['./sound.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoundComponent {
    @Input() enabled = false;
    @Input() position = 0;
    @Input() signalPosition: number;

    @Output() toggle = new EventEmitter();

    constructor(private _elRef: ElementRef) {
    }

    onClick(): void {
        this.enabled = !this.enabled;
        this.toggle.emit(this.enabled);
    }
}
