import { Component, input, model, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { PlayerResult } from '../pochaCalculator';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

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
  ],
  templateUrl: './results.html',
  styleUrl: 'results.css'
})
export class ResultsStep {
  hands = model.required<PlayerResult[]>();
  maxTricks = input.required<number>();
  preview = input.required<(p: any) => number>();

  next = output<void>();
  back = output<void>();

  incrementActualHand(hand: PlayerResult) {
    hand.actual += 1;
  }

  decrementActualHand(hand: PlayerResult) {
    hand.actual -= 1;
  }

  // totalActualHands = computed(() => this.hands().reduce((sum, p) => sum + (p.actual ?? 0), 0)); //TODO: fixme
}
