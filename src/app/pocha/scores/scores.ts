import { Component, computed, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { calculateGameScore } from '../pochaCalculator';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GameStore } from '../game.store';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzDividerComponent } from 'ng-zorro-antd/divider';

@Component({
  selector: 'scores-step',
  imports: [
    NzButtonModule,
    NzCardModule,
    NzSpaceModule,
    NzTableModule,
    NzIconModule,
    NzAvatarComponent,
    NzFlexModule,
    NzDividerComponent,
  ],
  templateUrl: './scores.html',
})
export class ScoresStep {
  constructor(protected gameStore: GameStore) {
  }

  next = output<void>();
  back = output<void>();

  scores = computed(() => calculateGameScore(this.gameStore.hands(), this.gameStore.currentHandIndex()));

  maxScoreIndex = computed(() => this.scores().indexOf(Math.max(...this.scores())))

  gameHasFinished() {
    return this.gameStore.getCurrentHandNumber() == this.gameStore.hands().length
  }
}
