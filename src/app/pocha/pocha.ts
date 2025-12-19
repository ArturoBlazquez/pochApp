import { Component, signal, WritableSignal } from '@angular/core';
import { Bid } from './pochaCalculator';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { PlayerSetup } from './player-setup/player-setup';
import { PredictionsStep } from './predictions/predictions';
import { ResultsStep } from './results/results';
import { ScoresStep } from './scores/scores';
import { GameStore } from './game.store';
import { HandSetup } from './hand-setup/hand-setup';

type Stage = 'players-setup' | 'hand-setup' | 'predictions' | 'results' | 'scoreboard' | 'ended';

@Component({
  selector: 'app-pocha',
  imports: [
    PlayerSetup,
    PredictionsStep,
    ResultsStep,
    ScoresStep,
    NzCardModule,
    NzListModule,
    NzButtonModule,
    NzStepsModule,
    NzPageHeaderModule,
    NzDividerModule,
    HandSetup,
  ],
  templateUrl: './pocha.html',
})
export class Pocha {
  constructor(private gameStore: GameStore) {
  }

  stage: WritableSignal<Stage> = signal('players-setup');

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
      this.gameStore.currentHand.update(currentHand => currentHand + 1);
      this.stage.set('predictions');
    }
  }

  back() {
    if (this.stage() === 'results') {
      this.stage.set('predictions');
    } else if (this.stage() === 'scoreboard') {
      this.stage.set('results');
    } else if (this.stage() === 'predictions') {
      if (this.gameStore.currentHand() === 0) {
        this.stage.set('hand-setup');
      } else {
        this.gameStore.currentHand.update(currentHand => currentHand - 1);
        this.stage.set('scoreboard');
      }
    } else if (this.stage() === 'hand-setup') {
      this.stage.set('players-setup');
    } else if (this.stage() === 'ended') {
      this.stage.set('scoreboard');
    }
  }

  endGame() {
    this.stage.set('ended');
  }
}
