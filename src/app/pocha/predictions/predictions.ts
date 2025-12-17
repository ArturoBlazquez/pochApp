import { Component, input, model, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { PlayerResult } from '../pochaCalculator';

@Component({
  selector: 'predictions-step',
  imports: [
    NzAvatarModule,
    NzButtonModule,
    NzCardModule,
    NzInputNumberModule,
    NzListModule,
    NzSpaceModule,
    FormsModule,
  ],
  templateUrl: './predictions.html',
})
export class PredictionsStep {
  hands = model.required<PlayerResult[]>();
  maxTricks = input.required<number>();

  next = output<void>();
  back = output<void>();
}
