import { computed, effect, Injectable, signal } from '@angular/core';
import { Hand } from './pochaCalculator';

export type GameState = { stage: string; players: string[]; hands: Hand[]; tricksPerHand: number[], currentHandIndex: number; language: string; theme: string };

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

  constructor() {
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

  async getShareableGameState() {
    const gameState = JSON.stringify({ ...this.gameState(), date: new Date() });

    const stream = new Blob([gameState]).stream();
    const compressedStream = stream.pipeThrough(new CompressionStream('deflate'));
    const chunks = [];
    for await (const chunk of compressedStream) {
      chunks.push(chunk);
    }
    const compressedBuffer = await new Response(new Blob(chunks)).arrayBuffer();

    // Convert to Base64 and make it URL-friendly
    return btoa(String.fromCharCode(...new Uint8Array(compressedBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  async loadShareableGameState(gameState: string): Promise<GameState & { date: Date }> {
    // Restore Base64 padding and characters
    let base64 = gameState.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const stream = new Blob([bytes]).stream();
    const decompressedStream = stream.pipeThrough(new DecompressionStream('deflate'));
    return JSON.parse(await new Response(decompressedStream).text());
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
