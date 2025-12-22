import { computed, effect, Injectable, signal } from '@angular/core';
import { Hand } from './pochaCalculator';

type GameState = { stage: string; players: string[]; hands: Hand[]; tricksPerHand: number[], currentHandIndex: number; language: string; theme: string };

@Injectable({ providedIn: 'root' })
export class GameStore {
  private readonly STORAGE_KEY = 'game_state';
  private savedState: GameState = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');

  stage = signal(this.savedState.stage || 'players-setup');
  players = signal<string[]>(this.savedState.players || []);
  hands = signal<Hand[]>(this.savedState.hands || []);
  tricksPerHand = signal<number[]>(this.savedState.tricksPerHand || []);
  currentHandIndex = signal(this.savedState.currentHandIndex || 0);

  language = signal(this.savedState.language || 'es');
  theme = signal(this.savedState.theme || 'default');

  constructor() {
    effect(() => {
      const state: GameState = {
        stage: this.stage(),
        players: this.players(),
        hands: this.hands(),
        tricksPerHand: this.tricksPerHand(),
        currentHandIndex: this.currentHandIndex(),
        language: this.language(),
        theme: this.theme(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    });
  }

  hasSavedGameState(): boolean {
    return this.stage() !== 'players-setup' ||
      this.players().length > 0 ||
      this.hands().length > 0 ||
      this.tricksPerHand().length > 0 ||
      this.currentHandIndex() !== 0
  }

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

  resetGameState() {
    this.stage.set('players-setup');
    this.players.set([]);
    this.hands.set([]);
    this.tricksPerHand.set([]);
    this.currentHandIndex.set(0);
  }
}
