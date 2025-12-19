import { Component, effect, output, signal } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GameStore } from '../game.store';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'hand-setup',
  imports: [
    NzSpaceModule,
    NzButtonModule,
    NzCardModule,
    NzInputNumberModule,
    NzListModule,
    NzIconModule,
    FormsModule,
  ],
  templateUrl: './hand-setup.html',
})
export class HandSetup {
  constructor(protected gameStore: GameStore) {
    effect(() => {
      const maxTricks = Math.floor(40 / this.gameStore.players().length)
      for (let i = 1; i < maxTricks; i++) {
        this.tricksPerHand.update(hands => [...hands, i])
      }

      for (let i = 0; i < this.gameStore.players().length - 1; i++) {
        this.tricksPerHand.update(hands => [...hands, maxTricks])
      }

      for (let i = maxTricks; i > 0; i--) {
        this.tricksPerHand.update(hands => [...hands, i])
      }
    });
  }

  next = output<void>();
  back = output<void>();

  tricksPerHand = signal<number[]>([]);

  hand?: number;

  addTrickPerHand() {
    if (this.hand !== undefined) {
      this.tricksPerHand.update(hands => [...hands, this.hand!]);
      this.hand = undefined;
    }
  }

  removeTrickPerHand(index: number) {
    this.tricksPerHand.update(hands => hands.filter((_, i) => i !== index));
  }

  removeAllTricksPerHand() {
    this.tricksPerHand.set([])
  }

  startGame() {
    this.gameStore.hands.set(this.tricksPerHand().map((tricks) => this.createHand(tricks)));
    this.next.emit()
  }

  createHand(numTricks: number) {
    return {
      numTricks: numTricks,
      bids: this.gameStore.players().map(p => ({
        predicted: 0,
        actual: 0,
      })),
    }
  }
}
