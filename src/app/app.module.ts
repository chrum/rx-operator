import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ComposerFullComponent} from './composer-full/composer-full.component';
import {IntroComponent} from './intro/intro.component';
import {SoundComponent} from './sound/sound.component';
import {Router, RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {NgxSliderModule} from '@angular-slider/ngx-slider';
import {PatternComponent} from './pattern/pattern.component';
import {METRONOME_SERVICE} from './tokens';
import {MentronomeService} from './services/mentronome.service';
import {IndicatorComponent} from './indicator/indicator.component';
import {ZeroComponent} from './0/zero.component';
import {OneComponent} from './1/one.component';
import {TwoComponent} from './2/two.component';
import {ThreeComponent} from './3/three.component';
import { TonalPlayerComponent } from './tonal-player/tonal-player.component';
import {SimplePatternComponent} from './simple-pattern/simple-pattern.component';

@NgModule({
    declarations: [
        AppComponent,
        SoundComponent,
        IntroComponent,
        ComposerFullComponent,
        PatternComponent,
        SimplePatternComponent,
        ZeroComponent,
        OneComponent,
        TwoComponent,
        ThreeComponent,
        IndicatorComponent,
        TonalPlayerComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot([
            // {
            //     path: '',
            //     component: IntroComponent
            // },
            {
                path: '',
                // component: ZeroComponent,
                // component: OneComponent,
                // component: TwoComponent,
                // component: ThreeComponent,
                component: ComposerFullComponent
            },
        ]),
        NgxSliderModule
    ],
    providers: [{
        provide: METRONOME_SERVICE,
        useClass: MentronomeService
    }],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(private _router: Router) {
        this._router.navigate(['/']);
    }

}
