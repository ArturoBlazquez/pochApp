import { Component, signal, WritableSignal } from '@angular/core';
import { cumulativeScores, PlayerResult } from './pochaCalculator';
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

type Stage = 'setup' | 'predictions' | 'results' | 'scoreboard' | 'ended';

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
  ],
  templateUrl: './pocha.html',
})
export class Pocha {
  stage: WritableSignal<Stage> = signal('setup');
  players = signal<string[]>([]);
  hands = signal<PlayerResult[][]>([]);
  currentHandIndex = 0;

  get totals() {
    return cumulativeScores(this.hands());
  }

  startGame() {
    this.hands.set([this.createHand()]);
    this.currentHandIndex = 0;
    this.stage.set('predictions');
  }

  createHand(): PlayerResult[] {
    return this.players().map(p => ({
      playerId: p,
      predicted: 0,
      actual: 0,
    }));
  }

  preview(p: PlayerResult) {
    const diff = Math.abs(p.predicted - p.actual);
    return diff === 0 ? 10 + 5 * p.actual : -5 * diff;
  }

  nextHand() {
    if (this.currentHandIndex === this.hands().length - 1) {
      this.hands.update(hands => [...hands, this.createHand()]);
    }
    this.currentHandIndex = this.currentHandIndex + 1;
    this.stage.set('predictions');
  }

  previousHand() {
    this.currentHandIndex = this.currentHandIndex - 1;
    this.stage.set('scoreboard');
  }

  next() {
    if (this.stage() === 'setup') {
      this.startGame();
    } else if (this.stage() === 'predictions') {
      this.stage.set('results');
    } else if (this.stage() === 'results') {
      this.stage.set('scoreboard');
    } else if (this.stage() === 'scoreboard') {
      this.nextHand();
    }
  }

  back() {
    if (this.stage() === 'results') {
      this.stage.set('predictions');
    } else if (this.stage() === 'scoreboard') {
      this.stage.set('results');
    } else if (this.stage() === 'predictions') {
      if (this.currentHandIndex === 0) {
        this.stage.set('setup');
      } else {
        this.previousHand();
      }
    } else if (this.stage() === 'ended') {
      this.stage.set('scoreboard');
    }
  }

  endGame() {
    this.stage.set('ended');
  }

  jumpToHand(i: number) {
    this.currentHandIndex = i;
    this.stage.set('scoreboard');
  }
}
