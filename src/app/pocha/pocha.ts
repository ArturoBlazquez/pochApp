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
    TranslatePipe,
  ],
  templateUrl: './pocha.html',
})
export class Pocha {
  constructor(
    private gameStore: GameStore,
    private translate: TranslateService,
  ) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setFallbackLang('es');
    this.translate.use('es');
  }

  stage: WritableSignal<Stage> = signal('players-setup');

  languageOptions = [
    { value: 'es', label: '🇪🇸' },
    { value: 'en', label: '🇬🇧' },
  ];

  changeLanguage(language: string): void {
    this.translate.use(language);
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
