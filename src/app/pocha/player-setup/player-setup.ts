import { Component, output } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { FormsModule } from '@angular/forms';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GameStore } from '../game.store';
import { TranslatePipe } from '@ngx-translate/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'player-setup',
  imports: [
    NzSpaceModule,
    NzAvatarModule,
    NzButtonModule,
    NzCardModule,
    NzInputModule,
    NzListModule,
    NzEmptyModule,
    NzIconModule,
    FormsModule,
    TranslatePipe,
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    NzTableModule,
  ],
  templateUrl: './player-setup.html',
})
export class PlayerSetup {
  constructor(protected gameStore: GameStore) {
  }

  next = output<void>();

  playerName = '';

  addPlayer() {
    let newPlayer = this.playerName.trim();
    if (newPlayer && !this.gameStore.players().includes(newPlayer)) {
      this.gameStore.players.update(players => [...players, newPlayer]);
      this.playerName = '';
    }
  }

  removePlayer(playerToRemove: string) {
    this.gameStore.players.update(players => players.filter(player => player !== playerToRemove));
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.gameStore.players(), event.previousIndex, event.currentIndex);
  }

  getPlayerInitials(player: string) {
    return player.split(' ').map(player => player[0]).reduce((a, b) => a + b);
  }
}
