import { Component, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { Bid, calculateBidScore, calculateGameScore } from '../pochaCalculator';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GameStore, SavedGameState } from '../game.store';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-share',
  imports: [
    NzCardModule,
    NzSpaceModule,
    NzTableModule,
    NzIconModule,
    NzAvatarModule,
    NzFlexModule,
    NzDividerModule,
    NzTagModule,
    TranslatePipe,
    DatePipe,
  ],
  templateUrl: './share.html',
})
export class Share implements OnInit {
  gameState: SavedGameState & { date: Date };

  scores: number[];
  maxScoreIndex;

  constructor(
    protected gameStore: GameStore,
    private router: Router,
  ) {
    this.gameState = {} as SavedGameState & { date: Date };
    this.scores = [];
    this.maxScoreIndex = 0;
    if (!window.location.search.startsWith('?gameState=')) {
      this.router.navigate(['/']).then();
    }
  }

  ngOnInit() {
    const savedGameState = window.location.search;
    const loadedGameState = this.gameStore.loadShareableGameState(savedGameState.slice(11));
    if (!loadedGameState) {
      this.router.navigate(['/']).then();
    }
    this.gameState = loadedGameState!
    this.scores = calculateGameScore(this.gameState.hands, this.gameState.currentHandIndex);
    this.maxScoreIndex = this.scores.indexOf(Math.max(...this.scores));
  }

  preview = (bid: Bid) => {
    return calculateBidScore(bid);
  };

  calculateScore(index: number) {
    return calculateGameScore(this.gameState.hands, index)
  }

  getBid(handIndex: number, playerIndex: number) {
    return this.gameState.hands[handIndex].bids[playerIndex];
  }
}
