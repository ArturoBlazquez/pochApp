import { GameEncoder } from '../../src/app/pocha/game.encoder';

describe('PochaCalculator', () => {
  const gameEncoder = new GameEncoder();

  it('should encode game state', () => {
    const players = ['Arturo', 'Alex', 'Rebeca', 'Jesús']
    const tricksPerHand = [1, 4, 10]
    const hands = [
      {
        numTricks: 1,
        bids: [
          { predicted: 0, actual: 0 },
          { predicted: 1, actual: 1 },
          { predicted: 0, actual: 0 },
          { predicted: 1, actual: 0 },
        ],
      },
      {
        numTricks: 4,
        bids: [
          { predicted: 3, actual: 3 },
          { predicted: 2, actual: 1 },
          { predicted: 0, actual: 0 },
          { predicted: 4, actual: 0 },
        ],
      },
      {
        numTricks: 10,
        bids: [
          { predicted: 3, actual: 3 },
          { predicted: 5, actual: 4 },
          { predicted: 1, actual: 3 },
          { predicted: 5, actual: 0 },
        ],
      },
    ]
    const date = new Date(2025, 11, 25);

    const encodedGame = gameEncoder.encode(players, tricksPerHand, hands, date);

    expect(encodedGame).to.equal('QXJ0dXJvH0FsZXgfUmViZWNhH0plc_pz.FK.EMptECCbsLo.ZtSlzWA')
  });

  it('should decode game state', () => {
    const expectedGameState = {
      players: ['Arturo', 'Alex', 'Rebeca', 'Jesús'],
      hands: [
        {
          numTricks: 1,
          bids: [
            { predicted: 0, actual: 0 },
            { predicted: 1, actual: 1 },
            { predicted: 0, actual: 0 },
            { predicted: 1, actual: 0 },
          ],
        },
        {
          numTricks: 4,
          bids: [
            { predicted: 3, actual: 3 },
            { predicted: 2, actual: 1 },
            { predicted: 0, actual: 0 },
            { predicted: 4, actual: 0 },
          ],
        },
        {
          numTricks: 10,
          bids: [
            { predicted: 3, actual: 3 },
            { predicted: 5, actual: 4 },
            { predicted: 1, actual: 3 },
            { predicted: 5, actual: 0 },
          ],
        },
      ],
      tricksPerHand: [1, 4, 10],
      currentHandIndex: 2,
      date: new Date(2025, 11, 25),
    }

    const gameState = gameEncoder.decode('QXJ0dXJvH0FsZXgfUmViZWNhH0plc_pz.FK.EMptECCbsLo.ZtSlzWA');

    expect(gameState).to.deep.equal(expectedGameState)
  });

  [
    { gameState: '' },
    { gameState: 'asd.asd' },
    { gameState: 'jsdnv.123.sad' },
    { gameState: 'ksj.KHBD.KJH6.6tfg.JH' },
  ].forEach(({ gameState }) => {
    it('should not decode invalid gameStates', () => {
      expect(gameEncoder.decode(gameState)).to.be.null;
    });
  });
});
