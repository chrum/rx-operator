import {ChangeDetectionStrategy, Component, ElementRef, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {scan} from 'rxjs/operators';

@Component({
    selector: 'app-indicator',
    templateUrl: './indicator.component.html',
    styleUrls: ['./indicator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndicatorComponent {
    @Input() active: number | null;
}
