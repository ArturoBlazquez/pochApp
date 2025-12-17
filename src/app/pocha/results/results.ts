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
    FormsModule,
  ],
  templateUrl: './results.html',
})
export class ResultsStep {
  hands = model.required<PlayerResult[]>();
  maxTricks = input.required<number>();
  preview = input.required<(p: any) => number>();

  next = output<void>();
  back = output<void>();

  // totalActualHands = computed(() => this.hands().reduce((sum, p) => sum + (p.actual ?? 0), 0)); //TODO: fixme
}
