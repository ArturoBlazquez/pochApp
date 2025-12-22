import { Component, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GameStore } from '../game.store';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { TranslatePipe } from '@ngx-translate/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'hand-setup',
  imports: [
    NzSpaceModule,
    NzButtonModule,
    NzCardModule,
    NzInputNumberModule,
    NzTableModule,
    NzIconModule,
    FormsModule,
    TranslatePipe,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
  ],
  templateUrl: './hand-setup.html',
})
export class HandSetup {
  constructor(protected gameStore: GameStore) {
    if (this.gameStore.tricksPerHand().length == 0) {
      const maxTricks = Math.floor(40 / this.gameStore.players().length)
      for (let i = 1; i < maxTricks; i++) {
        this.gameStore.tricksPerHand.update(hands => [...hands, i])
      }

      for (let i = 0; i < this.gameStore.players().length - 1; i++) {
        this.gameStore.tricksPerHand.update(hands => [...hands, maxTricks])
      }

      for (let i = maxTricks; i > 0; i--) {
        this.gameStore.tricksPerHand.update(hands => [...hands, i])
      }
    }
  }

  next = output<void>();
  back = output<void>();

  hand?: number;

  addTrickPerHand() {
    if (this.hand !== undefined) {
      this.gameStore.tricksPerHand.update(hands => [...hands, this.hand!]);
      this.hand = undefined;
    }
  }

  removeTrickPerHand(index: number) {
    this.gameStore.tricksPerHand.update(hands => hands.filter((_, i) => i !== index));
  }

  moveHands(event: CdkDragDrop<string[]>): void {
    this.gameStore.tricksPerHand.update(tricksPerHand => {
      const updatedTricksPerHand = [...tricksPerHand];
      moveItemInArray(updatedTricksPerHand, event.previousIndex, event.currentIndex);
      return updatedTricksPerHand
    });
  }

  removeAllTricksPerHand() {
    this.gameStore.tricksPerHand.set([])
  }

  goBack() {
    this.gameStore.tricksPerHand.set([]);
    this.back.emit()
  }

  startGame() {
    this.gameStore.hands.set(this.gameStore.tricksPerHand().map((tricks) => this.createHand(tricks)));
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
