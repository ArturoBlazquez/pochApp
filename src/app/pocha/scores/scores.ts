import { Component, computed, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { cumulativeScores, PlayerResult } from '../pochaCalculator';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'scores-step',
  imports: [
    NzButtonModule,
    NzCardModule,
    NzSpaceModule,
    NzTableModule,
  ],
  templateUrl: './scores.html',
})
export class ScoresStep {
  hands = input.required<PlayerResult[][]>();
  maxTricks = input.required<number>();

  next = output<void>();
  back = output<void>();
  end = output<void>();

  totals = computed(() => cumulativeScores(this.hands().slice(0, this.maxTricks())));
}
