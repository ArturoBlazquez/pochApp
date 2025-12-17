export type PlayerResult = {
  playerId: string;
  predicted: number;
  actual: number;
};

function scorePochaHand(results: PlayerResult[]): { playerId: string; handScore: number }[] {
  return results.map(({ playerId, predicted, actual }) => {
    const diff = Math.abs(actual - predicted);
    const handScore = diff === 0 ? 10 + 5 * actual : -5 * diff;
    return { playerId, handScore };
  });
}

export function cumulativeScores(hands: PlayerResult[][]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const hand of hands) {
    const scores = scorePochaHand(hand);
    for (const { playerId, handScore } of scores) {
      totals[playerId] = (totals[playerId] ?? 0) + handScore;
    }
  }
  return totals;
}
