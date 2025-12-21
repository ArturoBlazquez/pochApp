import { Component, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { Bid, calculateBidScore } from '../pochaCalculator';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { GameStore } from '../game.store';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'results-step',
  imports: [
    NzAvatarModule,
    NzButtonModule,
    NzCardModule,
    NzInputNumberModule,
    NzListModule,
    NzSpaceModule,
    NzTagModule,
    NzIconModule,
    NzTypographyModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './results.html',
  styleUrl: 'results.css',
})
export class ResultsStep {
  constructor(protected gameStore: GameStore) {
  }

  next = output<void>();
  back = output<void>();

  preview = (bid: Bid) => {
    return calculateBidScore(bid);
  };

  incrementActualBid(bid: Bid) {
    bid.actual += 1;
  }

  decrementActualBid(bid: Bid) {
    bid.actual -= 1;
  }

  getTotalActualTricks() {
    return this.gameStore.getCurrentHand().bids.reduce((sum, p) => sum + (p.actual ?? 0), 0)
  }
}
