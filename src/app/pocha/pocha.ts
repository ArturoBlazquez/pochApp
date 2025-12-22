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
import { NzModalModule } from 'ng-zorro-antd/modal';

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
    NzModalModule,
    TranslatePipe,
    FormsModule,
  ],
  templateUrl: './pocha.html',
})
export class Pocha {
  constructor(
    protected gameStore: GameStore,
    private translate: TranslateService,
    private themeService: ThemeService,
  ) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setFallbackLang('es');
    this.translate.use(this.gameStore.language());
    this.themeService.useTheme(this.gameStore.theme(), true).then();

    if (this.gameStore.hasSavedGameState()) {
      this.showModal = true
    }
  }

  languageOptions = [
    { value: 'es', label: '🇪🇸' },
    { value: 'en', label: '🇬🇧' },
  ];

  themeOptions = [
    { value: 'default', label: '☀️' },
    { value: 'dark', label: '🌑' },
  ];

  showModal = false;

  switchLanguage(): void {
    this.gameStore.language.update(language => language == 'es' ? 'en' : 'es');
    this.translate.use(this.gameStore.language());
  }

  switchTheme(): void {
    this.gameStore.theme.update(theme => theme == 'default' ? 'dark' : 'default');
    this.themeService.useTheme(this.gameStore.theme()).then();
  }

  continueGame() {
    this.showModal = false;
  }

  startNewGame(): void {
    this.gameStore.resetGameState();
    this.showModal = false;
  }

  next() {
    if (this.gameStore.stage() === 'players-setup') {
      this.gameStore.stage.set('hand-setup');
    } else if (this.gameStore.stage() === 'hand-setup') {
      this.gameStore.stage.set('predictions');
    } else if (this.gameStore.stage() === 'predictions') {
      this.gameStore.stage.set('results');
    } else if (this.gameStore.stage() === 'results') {
      this.gameStore.stage.set('scoreboard');
    } else if (this.gameStore.stage() === 'scoreboard') {
      this.gameStore.currentHandIndex.update(currentHand => currentHand + 1);
      this.gameStore.stage.set('predictions');
    }
  }

  back() {
    if (this.gameStore.stage() === 'results') {
      this.gameStore.stage.set('predictions');
    } else if (this.gameStore.stage() === 'scoreboard') {
      this.gameStore.stage.set('results');
    } else if (this.gameStore.stage() === 'predictions') {
      if (this.gameStore.currentHandIndex() === 0) {
        this.gameStore.stage.set('hand-setup');
      } else {
        this.gameStore.currentHandIndex.update(currentHand => currentHand - 1);
        this.gameStore.stage.set('scoreboard');
      }
    } else if (this.gameStore.stage() === 'hand-setup') {
      this.gameStore.stage.set('players-setup');
    }
  }
}
