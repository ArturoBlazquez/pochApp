import { computed, effect, Injectable, signal } from '@angular/core';
import { Hand } from './pochaCalculator';
import { GameEncoder } from './game.encoder';

export type GameState = { stage: string; players: string[]; hands: Hand[]; tricksPerHand: number[], currentHandIndex: number; language: string; theme: string };
export type SavedGameState = { players: string[]; hands: Hand[]; tricksPerHand: number[], currentHandIndex: number };

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

  gameState = computed(() => ({
    stage: this.stage(),
    players: this.players(),
    hands: this.hands(),
    tricksPerHand: this.tricksPerHand(),
    currentHandIndex: this.currentHandIndex(),
  }))

  settingState = computed(() => ({
    language: this.language(),
    theme: this.theme(),
  }))

  constructor(private gameEncoder: GameEncoder) {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ ...this.gameState(), ...this.settingState() }));
    });
  }

  hasSavedGameState(): boolean {
    return this.stage() !== 'players-setup' ||
      this.players().length > 0 ||
      this.hands().length > 0 ||
      this.tricksPerHand().length > 0 ||
      this.currentHandIndex() !== 0
  }

  getShareableGameState() {
    const gameState = this.gameState();

    return this.gameEncoder.encode(gameState.players, gameState.tricksPerHand, gameState.hands, new Date());
  }

  loadShareableGameState(gameState: string): SavedGameState & { date: Date } | null {
    return this.gameEncoder.decode(gameState);
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

  getCurrentStarter() {
    return this.players()[(this.currentHandIndex() + 1) % this.players().length];
  }

  resetGameState() {
    this.stage.set('players-setup');
    this.players.set([]);
    this.hands.set([]);
    this.tricksPerHand.set([]);
    this.currentHandIndex.set(0);
  }
}
