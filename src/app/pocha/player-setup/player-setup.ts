import { Component, model, output } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { FormsModule } from '@angular/forms';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';

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
  ],
  templateUrl: './player-setup.html',
})
export class PlayerSetup {
  players = model.required<string[]>();

  next = output<void>();

  playerName = '';

  addPlayer() {
    let newPlayer = this.playerName.trim();
    if (newPlayer) {
      this.players.update(players => [...players, newPlayer]);
      this.playerName = '';
    }
  }

  removePlayer(playerToRemove: string) {
    this.players.update(players => players.filter(player => player !== playerToRemove));
  }
}
