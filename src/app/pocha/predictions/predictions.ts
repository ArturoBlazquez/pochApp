import { Component, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { Bid } from '../pochaCalculator';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GameStore } from '../game.store';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'predictions-step',
  imports: [
    NzAvatarModule,
    NzButtonModule,
    NzCardModule,
    NzInputNumberModule,
    NzListModule,
    NzSpaceModule,
    NzIconModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './predictions.html',
})
export class PredictionsStep {
  constructor(protected gameStore: GameStore) {
  }

  next = output<void>();
  back = output<void>();

  incrementPredictedBid(bid: Bid) {
    bid.predicted += 1;
  }

  decrementPredictedBid(bid: Bid) {
    bid.predicted -= 1;
  }

  getTotalPredictedTricks() {
    return this.gameStore.getCurrentHand().bids.reduce((sum, p) => sum + (p.predicted ?? 0), 0)
  }
}
