import { calculateBidScore, calculateGameScore } from '../../src/app/pocha/pochaCalculator';

describe('PochaCalculator', () => {

  describe('PochaCalculator', () => {
    [
      { predicted: 0, actual: 0, expectedScore: 10 },
      { predicted: 0, actual: 1, expectedScore: -5 },
      { predicted: 0, actual: 2, expectedScore: -10 },
      { predicted: 2, actual: 0, expectedScore: -10 },
      { predicted: 2, actual: 1, expectedScore: -5 },
      { predicted: 2, actual: 2, expectedScore: 20 },
      { predicted: 2, actual: 3, expectedScore: -5 },
      { predicted: 3, actual: 0, expectedScore: -15 },
      { predicted: 3, actual: 1, expectedScore: -10 },
      { predicted: 3, actual: 2, expectedScore: -5 },
      { predicted: 3, actual: 3, expectedScore: 25 },
      { predicted: 3, actual: 4, expectedScore: -5 },
      { predicted: 3, actual: 5, expectedScore: -10 },
    ].forEach(({ actual, expectedScore, predicted }) => {
      it('should calculate hand scores', () => {
        let score = calculateBidScore({ predicted, actual });

        expect(score).to.equal(expectedScore)
      });
    });
  });

  it('should calculate game scores', () => {
    let gameScore = calculateGameScore(
      [
        {
          numTricks: 5,
          bids: [
            { predicted: 0, actual: 0 },
            { predicted: 1, actual: 1 },
            { predicted: 0, actual: 0 },
          ],
        },
        {
          numTricks: 5,
          bids: [
            { predicted: 3, actual: 3 },
            { predicted: 2, actual: 0 },
            { predicted: 0, actual: 0 },
          ],
        },
      ],
      1);

    expect(gameScore).to.deep.equal([35, 5, 20])
  });

  it('should calculate partial game scores', () => {
    let gameScore = calculateGameScore(
      [
        {
          numTricks: 5,
          bids: [
            { predicted: 0, actual: 0 },
            { predicted: 1, actual: 1 },
            { predicted: 0, actual: 0 },
          ],
        },
        {
          numTricks: 5,
          bids: [
            { predicted: 3, actual: 3 },
            { predicted: 2, actual: 0 },
            { predicted: 0, actual: 0 },
          ],
        },
      ],
      0);

    expect(gameScore).to.deep.equal([10, 15, 10])
  });
});
