import { Injectable } from '@angular/core';
import { Bid, Hand } from './pochaCalculator';
import { SavedGameState } from './game.store';

@Injectable({ providedIn: 'root' })
export class GameEncoder {
  base64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

  encode(players: string[], tricksPerHand: number[], hands: Hand[], date: Date): string {
    const bids: Bid[][] = hands.map(hand => hand.bids);
    return `${this.encodePlayers(players)}.${this.encodeTricksPerHand(tricksPerHand)}.${this.encodeBids(bids)}.${this.encodeDate(date)}`;
  }

  decode(encodedGameState: string): SavedGameState & { date: Date } | null {
    if (encodedGameState.split('.').length != 4) {
      return null;
    }

    const [encodedPlayers, encodedTricksPerHand, encodedBids, encodedDate] = encodedGameState.split('.');

    const tricksPerHand = this.decodeTricksPerHand(encodedTricksPerHand);
    const players = this.decodePlayers(encodedPlayers);
    return {
      players: players,
      hands: this.decodeHands(encodedBids, tricksPerHand, players.length),
      tricksPerHand: tricksPerHand,
      currentHandIndex: tricksPerHand.length - 1,
      date: this.decodeDate(encodedDate),
    }
  }

  encodePlayers(players: string[]): string {
    return btoa(players.join('\u001F'))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  decodePlayers(players: string): string[] {
    players = players
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    while (players.length % 4) {
      players += '=';
    }

    return atob(players).split('\u001F');
  }

  encodeTricksPerHand(tricksPerHand: number[]): string {
    const binaryTricksPerHand = tricksPerHand.map(tricks => `0000${tricks.toString(2)}`.slice(-4)).join('');
    return this.base64Encode(binaryTricksPerHand);
  }

  decodeTricksPerHand(tricksPerHand: string): number[] {
    let binaryTricksPerHand = this.base64Decode(tricksPerHand);

    if (binaryTricksPerHand.length % 4 !== 0) {
      binaryTricksPerHand = `${'0'.repeat(6 - (binaryTricksPerHand.length % 6))}${binaryTricksPerHand}`;
    }

    return this.splitString(binaryTricksPerHand, 4).map(bytes => parseInt(bytes, 2));
  }

  decodeHands(bids: string, tricksPerHand: number[], numberOfPlayers: number): Hand[] {
    let binaryBids = this.base64Decode(bids).slice(1);
    console.log(binaryBids)
    const hands = []
    let currentBids;

    for (const numTricks of tricksPerHand) {
      [binaryBids, currentBids] = this.decodeCurrentBids(binaryBids, numberOfPlayers)
      hands.push({
        numTricks: numTricks,
        bids: currentBids,
      });
    }

    return hands;
  }

  encodeBids(bids: Bid[][]): string {
    const binaryBids = bids.map(bid => this.encodeBid(bid)).join('');

    return this.base64Encode(`1${binaryBids}`);
  }

  decodeCurrentBids(bid: string, numberOfPlayers: number): [string, Bid[]] {
    const bids: Bid[] = []
    let binaryLength: number;

    if (bid.startsWith('00')) {
      binaryLength = 1;
    } else if (bid.startsWith('01')) {
      binaryLength = 2;
    } else if (bid.startsWith('10')) {
      binaryLength = 3;
    } else {
      binaryLength = 4;
    }

    console.log(numberOfPlayers)
    const currentBinaryBid = bid.slice(2, 2 + binaryLength * numberOfPlayers * 2)
    console.log(currentBinaryBid)

    const currentBids = this.splitString(currentBinaryBid, binaryLength)

    for (let i = 0; i < currentBids.length; i += 2) {
      bids.push({
        predicted: parseInt(currentBids[i], 2),
        actual: parseInt(currentBids[i + 1], 2),
      });
    }

    return [bid.slice(2 + binaryLength * numberOfPlayers * 2), bids];
  }

  encodeBid(bid: Bid[]): string {
    let flattenedBid = bid.flatMap(bid => [bid.predicted, bid.actual]);

    let binaryBid = ''
    let binaryLength = 0;

    const bidLength = Math.max(...flattenedBid);
    if (bidLength < 2) {
      binaryBid += '00';
      binaryLength = 1;
    } else if (bidLength < 4) {
      binaryBid += '01';
      binaryLength = 2;
    } else if (bidLength < 8) {
      binaryBid += '10';
      binaryLength = 3;
    } else {
      binaryBid += '11';
      binaryLength = 4;
    }

    binaryBid += flattenedBid.map(bid => `0000${bid.toString(2)}`.slice(-binaryLength)).join('');

    return binaryBid;
  }

  encodeDate(date: Date): string {
    return this.base64Encode(date.getTime().toString(2));
  }

  decodeDate(date: string): Date {
    return new Date(parseInt(this.base64Decode(date), 2));
  }

  base64Encode(binaryNumber: string) {
    if (binaryNumber.length % 6 !== 0) {
      binaryNumber = `${'0'.repeat(6 - (binaryNumber.length % 6))}${binaryNumber}`;
    }

    return this.splitString(binaryNumber, 6).map(bytes => this.base64Table[parseInt(bytes, 2)]).join('');
  }

  base64Decode(base64Number: string): string {
    let binaryNumber = '';
    for (let i = 0; i < base64Number.length; i++) {
      binaryNumber += `000000${this.base64Table.indexOf(base64Number[i]).toString(2)}`.slice(-6);
    }

    return binaryNumber.replace(/^0+/, '');
  }

  splitString(stringToSplit: string, splitSize: number): string[] {
    const splitString: string[] = [];
    for (let i = 0; i < stringToSplit.length; i += splitSize) {
      splitString.push(stringToSplit.slice(i, i + splitSize));
    }

    return splitString;
  }

}
