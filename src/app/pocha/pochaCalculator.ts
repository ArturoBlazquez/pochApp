export function calculateBidScore({ actual, predicted }: Bid): number {
  const diff = Math.abs(actual - predicted);
  return diff === 0 ? 10 + 5 * actual : -5 * diff;
}

export function calculateHandScore(hand: Hand): number[] {
  return hand.bids.map((result) => calculateBidScore(result));
}

export function calculateGameScore(hands: Hand[], currentHand: number): number[] {
  return hands.slice(0, currentHand + 1).map((hand) => calculateHandScore(hand))
    .reduce((acc, row) => row.map((value, index) => value + (acc[index] ?? 0)));
}

export interface Hand {
  numTricks: number,
  bids: Bid[]
}

export type Bid = {
  predicted: number;
  actual: number;
};
