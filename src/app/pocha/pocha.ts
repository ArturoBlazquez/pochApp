import { Component, signal, WritableSignal } from '@angular/core';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { PlayerSetup } from './player-setup/player-setup';
import { PredictionsStep } from './predictions/predictions';
import { ResultsStep } from './results/results';
import { ScoresStep } from './scores/scores';
import { GameStore } from './game.store';
import { HandSetup } from './hand-setup/hand-setup';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { ThemeService } from '../theme.service';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { FormsModule } from '@angular/forms';

type Stage = 'players-setup' | 'hand-setup' | 'predictions' | 'results' | 'scoreboard';

@Component({
  selector: 'app-pocha',
  imports: [
    PlayerSetup,
    HandSetup,
    PredictionsStep,
    ResultsStep,
    ScoresStep,
    NzStepsModule,
    NzPageHeaderModule,
    NzSegmentedModule,
    NzSpaceModule,
    TranslatePipe,
    FormsModule,
  ],
  templateUrl: './pocha.html',
})
export class Pocha {
  constructor(
    private gameStore: GameStore,
    private translate: TranslateService,
    private themeService: ThemeService,
  ) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setFallbackLang('es');
    this.translate.use('es');
    this.themeService.loadTheme(true).then();
  }

  stage: WritableSignal<Stage> = signal('players-setup');

  selectedLanguage = signal('es');
  selectedTheme = signal('default');

  languageOptions = [
    { value: 'es', label: '🇪🇸' },
    { value: 'en', label: '🇬🇧' },
  ];

  themeOptions = [
    { value: 'default', label: '☀️' },
    { value: 'dark', label: '🌑' },
  ];

  switchLanguage(): void {
    this.selectedLanguage.update(language => language == 'es' ? 'en' : 'es');
    this.translate.use(this.selectedLanguage());
  }

  switchTheme(): void {
    this.selectedTheme.update(theme => theme == 'default' ? 'dark' : 'default');
    this.themeService.changeTheme(this.selectedTheme()).then();
  }

  next() {
    if (this.stage() === 'players-setup') {
      this.stage.set('hand-setup');
    } else if (this.stage() === 'hand-setup') {
      this.stage.set('predictions');
    } else if (this.stage() === 'predictions') {
      this.stage.set('results');
    } else if (this.stage() === 'results') {
      this.stage.set('scoreboard');
    } else if (this.stage() === 'scoreboard') {
      this.gameStore.currentHandIndex.update(currentHand => currentHand + 1);
      this.stage.set('predictions');
    }
  }

  back() {
    if (this.stage() === 'results') {
      this.stage.set('predictions');
    } else if (this.stage() === 'scoreboard') {
      this.stage.set('results');
    } else if (this.stage() === 'predictions') {
      if (this.gameStore.currentHandIndex() === 0) {
        this.stage.set('hand-setup');
      } else {
        this.gameStore.currentHandIndex.update(currentHand => currentHand - 1);
        this.stage.set('scoreboard');
      }
    } else if (this.stage() === 'hand-setup') {
      this.stage.set('players-setup');
    }
  }
}
