import { Component } from '@angular/core';
import { cumulativeScores, PlayerResult } from './pocha';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

type GameStage = 'setup' | 'predictions' | 'results' | 'scoreboard' | 'ended';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  stage: GameStage = 'setup';
  playerNames: string[] = [];
  allHands: PlayerResult[][] = [];
  currentHandIndex = 0;

  nameInput = '';
  get currentHand(): PlayerResult[] {
    return this.allHands[this.currentHandIndex];
  }

  addPlayer() {
    if (this.nameInput.trim()) {
      this.playerNames.push(this.nameInput.trim());
      this.nameInput = '';
    }
  }

  startGame() {
    if (this.playerNames.length > 0) {
      this.allHands.push(this.createEmptyHand());
      this.currentHandIndex = 0;
      this.stage = 'predictions';
    }
  }

  createEmptyHand(): PlayerResult[] {
    return this.playerNames.map(p => ({ playerId: p, predicted: 0, actual: 0 }));
  }

  submitPredictions() {
    this.stage = 'results';
  }

  submitResults() {
    this.stage = 'scoreboard';
  }

  nextHand() {
    this.currentHandIndex = this.allHands.length;
    this.allHands.push(this.createEmptyHand());
    this.stage = 'predictions';
  }

  back() {
    if (this.stage === 'results') {
      this.stage = 'predictions';
    } else if (this.stage === 'predictions') {
      if (this.currentHandIndex > 0) {
        this.currentHandIndex--;
        this.stage = 'scoreboard';
      } else {
        this.stage = 'setup';
      }
    } else if (this.stage === 'scoreboard') {
      this.stage = 'results';
    } else if (this.stage === 'ended') {
      // Go back to the last scoreboard
      this.currentHandIndex = this.allHands.length - 1;
      this.stage = 'scoreboard';
    }
  }

  endGame() {
    this.stage = 'ended';
  }

  get totals() {
    return cumulativeScores(this.allHands);
  }
}
