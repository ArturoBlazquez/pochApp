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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { NzMessageService } from 'ng-zorro-antd/message';

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

  constructor(
    protected gameStore: GameStore,
    private clipboard: Clipboard,
    private messageService: NzMessageService,
    private translateService: TranslateService,
  ) {
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

  async shareGameState() {
    const gameState = await this.gameStore.getShareableGameState();
    const gameUrl = `share?gameState=${gameState}`;
    if (this.clipboard.copy(`${window.location.origin}/${gameUrl}`)) {
      this.messageService.info(this.translateService.instant('game.copied'));
      await navigator.share({ url: gameUrl });
    }
  }
}
