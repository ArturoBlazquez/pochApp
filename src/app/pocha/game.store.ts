import { computed, Injectable, signal } from '@angular/core';
import { Hand } from './pochaCalculator';

@Injectable({ providedIn: 'root' })
export class GameStore {
  players = signal<string[]>([]);
  hands = signal<Hand[]>([]);
  currentHandIndex = signal(0);

  getCurrentHandNumber = computed(() => this.currentHandIndex() + 1);

  getCurrentNumTricks() {
    return this.hands()[this.currentHandIndex()].numTricks
  }

  getCurrentHand() {
    return this.hands()[this.currentHandIndex()]
  }

  getCurrentDealer() {
    return this.players()[this.currentHandIndex() % this.players().length];
  }

}
