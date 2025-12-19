import { computed, Injectable, signal } from '@angular/core';
import { Hand } from './pochaCalculator';

@Injectable({ providedIn: 'root' })
export class GameStore {
  players = signal<string[]>([]);
  hands = signal<Hand[]>([]);
  currentHand = signal(0);

  getCurrentHandNumber = computed(() => this.currentHand() + 1);

  getCurrentNumTricks() {
    return this.hands()[this.currentHand()].numTricks
  }
}
