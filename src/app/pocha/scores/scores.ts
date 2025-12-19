import { Component, computed, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { calculateGameScore } from '../pochaCalculator';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GameStore } from '../game.store';

@Component({
  selector: 'scores-step',
  imports: [
    NzButtonModule,
    NzCardModule,
    NzSpaceModule,
    NzTableModule,
    NzIconModule,
  ],
  templateUrl: './scores.html',
})
export class ScoresStep {
  constructor(protected gameStore: GameStore) {
  }

  next = output<void>();
  back = output<void>();
  end = output<void>();

  scores = computed(() => calculateGameScore(this.gameStore.hands(), this.gameStore.currentHand()));
}
