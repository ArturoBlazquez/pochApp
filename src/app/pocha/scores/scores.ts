import { Component, computed, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { Bid, calculateBidScore, calculateGameScore } from '../pochaCalculator';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GameStore } from '../game.store';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'scores-step',
  imports: [
    NzButtonModule,
    NzCardModule,
    NzSpaceModule,
    NzTableModule,
    NzIconModule,
    NzAvatarModule,
    NzFlexModule,
    NzDividerModule,
    NzTagModule,
    TranslatePipe,
  ],
  templateUrl: './scores.html',
})
export class ScoresStep {
  next = output<void>();
  back = output<void>();

  scores = computed(() => calculateGameScore(this.gameStore.hands(), this.gameStore.currentHandIndex()));
  maxScoreIndex = computed(() => this.scores().indexOf(Math.max(...this.scores())))

  constructor(protected gameStore: GameStore) {
  }

  gameHasFinished() {
    return this.gameStore.getCurrentHandNumber() == this.gameStore.hands().length
  }

  preview = (bid: Bid) => {
    return calculateBidScore(bid);
  };

  calculateScore(index: number) {
    return calculateGameScore(this.gameStore.hands(), index)
  }

  getBid(handIndex: number, playerIndex: number) {
    return this.gameStore.hands()[handIndex].bids[playerIndex];
  }
}
