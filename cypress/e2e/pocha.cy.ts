describe('Pocha Scoring App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
    cy.get('.ant-segmented-item').eq(1).click();
  });

  it('lets user add and remove players and start the game', () => {
    // Add players
    cy.get('input[placeholder="Player name"]').type('Alice');
    cy.get('button').contains(/add player/i).click();

    cy.get('input[placeholder="Player name"]').type('Charlie');
    cy.get('button').contains(/add player/i).click();

    cy.get('input[placeholder="Player name"]').type('Bob{enter}');

    // Remove player
    cy.contains('Charlie').parent().parent().find('button').click();

    cy.contains('Alice');
    cy.contains('Bob');
    cy.contains('Charlie').should('not.exist');

    // Predictions
    cy.contains('Next').click();
    cy.contains('Next').click();
    cy.contains('Alice');
    cy.contains('Bob');
    cy.contains('Charlie').should('not.exist');
  });

  it('plays through a hand and shows scoreboard', () => {
    // Add players
    cy.get('input[placeholder="Player name"]').type('Alice{enter}');
    cy.get('input[placeholder="Player name"]').type('Bob{enter}');
    cy.contains('Next').click();

    cy.contains('Tricks per hand');
    cy.contains('Next').click();

    // Predictions
    cy.contains('Predictions - Hand 1');
    cy.contains('Alice deals 1 cards')
    cy.get('input.ant-input-number-input').eq(0).clear().type('1');
    cy.get('input.ant-input-number-input').eq(1).clear().type('1');
    cy.contains('Next').click();

    // Results
    cy.contains('Results - Hand 1');
    cy.get('input.ant-input-number-input').eq(0).clear().type('1');
    cy.get('input.ant-input-number-input').eq(1).clear().type('0');
    cy.contains('Next').click();

    // Scoreboard
    cy.contains('Scores - Hand 1');
    cy.get('td').contains('Alice').parent().should('contain', '15');
    cy.get('td').contains('Bob').parent().should('contain', '-5');
  });

  it('plays two hands, edits first hand results, and sees updated totals', () => {
    // Add players
    cy.get('input[placeholder="Player name"]').type('Alice{enter}');
    cy.get('input[placeholder="Player name"]').type('Bob{enter}');
    cy.contains('Next').click();
    cy.contains('Next').click();

    // Hand 1 predictions, results and scores
    cy.get('input.ant-input-number-input').eq(0).clear().type('0');
    cy.get('input.ant-input-number-input').eq(1).clear().type('1');
    cy.contains('Next').click();

    cy.get('input.ant-input-number-input').eq(0).clear().type('0');
    cy.get('input.ant-input-number-input').eq(1).clear().type('1');
    cy.contains('Next').click();

    cy.get('td').contains('Alice').parent().should('contain', '10');
    cy.get('td').contains('Bob').parent().should('contain', '15');
    cy.contains('Next').click();

    // Hand 2 predictions, results and scores
    cy.get('input.ant-input-number-input').eq(0).clear().type('1');
    cy.get('input.ant-input-number-input').eq(1).clear().type('2');
    cy.contains('Next').click();

    cy.get('input.ant-input-number-input').eq(0).clear().type('1');
    cy.get('input.ant-input-number-input').eq(1).clear().type('1');
    cy.contains('Next').click();

    cy.get('td').contains('Alice').parent().should('contain', '25');
    cy.get('td').contains('Bob').parent().should('contain', '10');

    // Go back to Hand 1 results
    cy.contains('Back').click();
    cy.contains('Back').click();
    cy.contains('Back').click();
    cy.contains('Back').click();

    // Change tricks
    cy.get('input.ant-input-number-input').eq(0).clear().type('1');
    cy.get('input.ant-input-number-input').eq(1).clear().type('0');
    cy.contains('Next').click();

    cy.get('td').contains('Alice').parent().should('contain', '-5');
    cy.get('td').contains('Bob').parent().should('contain', '-5');

    cy.contains('Next').click();
    cy.contains('Next').click();
    cy.contains('Next').click();

    cy.get('td').contains('Alice').parent().should('contain', '10');
    cy.get('td').contains('Bob').parent().should('contain', '-10');
  });

  it('creates default tricks per hand', () => {
    cy.get('input[placeholder="Player name"]').type('Alice{enter}');
    cy.get('input[placeholder="Player name"]').type('Bob{enter}');
    cy.contains('Next').click();

    cy.get('tr').should('have.length', 41);
    cy.get('tr').eq(1).contains(1);
    cy.get('tr').eq(2).contains(2);
    cy.get('tr').eq(19).contains(19);
    cy.get('tr').eq(20).contains(20);
    cy.get('tr').eq(21).contains(20);
    cy.get('tr').eq(22).contains(19);
    cy.get('tr').eq(39).contains(2);
    cy.get('tr').eq(40).contains(1);

    cy.contains('Back').click();
    cy.get('input[placeholder="Player name"]').type('Charlie{enter}');
    cy.get('input[placeholder="Player name"]').type('David{enter}');
    cy.contains('Next').click();

    cy.get('tr').should('have.length', 23);
    cy.get('tr').eq(1).contains(1);
    cy.get('tr').eq(2).contains(2);
    cy.get('tr').eq(9).contains(9);
    cy.get('tr').eq(10).contains(10);
    cy.get('tr').eq(11).contains(10);
    cy.get('tr').eq(12).contains(10);
    cy.get('tr').eq(13).contains(10);
    cy.get('tr').eq(14).contains(9);
    cy.get('tr').eq(21).contains(2);
    cy.get('tr').eq(22).contains(1);
  });

  it('edit tricks per hand', () => {
    cy.get('input[placeholder="Player name"]').type('Alice{enter}');
    cy.get('input[placeholder="Player name"]').type('Bob{enter}');
    cy.contains('Next').click();

    cy.get('tr').eq(20).find('button').click();
    cy.get('tr').should('have.length', 40);

    cy.get('input.ant-input-number-input').type('50{enter}');

    cy.get('tr').should('have.length', 41);
    cy.get('tr').eq(40).contains(50);
  });

  it('lets change the language', () => {
    cy.get('.ant-segmented-item').eq(0).click();

    // Add players
    cy.get('input[placeholder="Nombre del jugador"]').type('Alice{enter}');
    cy.get('input[placeholder="Nombre del jugador"]').type('Bob{enter}');
    cy.contains('Siguiente').click();

    //Add tricks per hand
    cy.contains('Bazas por mano');
    cy.contains('Siguiente').click();

    // Predictions
    cy.contains('Apuestas - Mano 1');
    cy.contains('Alice reparte 1 carta')
    cy.contains('Siguiente').click();

    // Results
    cy.contains('Resultados - Mano 1');
    cy.get('input.ant-input-number-input').eq(0).clear().type('1');
    cy.contains('Siguiente').click();

    // Scoreboard
    cy.contains('Resultados - Mano 1');
  });

  it('lets you share a game', () => {
    cy.visit('http://localhost:4200/share?gameState=eJzt109rwyAYBvDv8p6fDjWaP956225j9LSSg42ylXVpMQl0lHz3kTJoqOtYKbgcBgHBR-EHMe9rDtS05sWRpqbaerfaGm8JtNuYD-cb0kua-7bzWwI9uZWrDIHmG7cfhtpQCXo1tR0WHqju3hd-Xb01pDlotf6a3nln11Xr7HHaVG1nNqRZj0sRvxyd72LjqBzCEUJ8j2C_QlzhY-PoHJFcjbg5SgKEjISQp0gGCBUJoU6RChBp_NeRBogsPiILEHl8RB4giviIIkBwFl_Bw3L1z5ggI9YBLX46oJP4VCdRtCZRvmM1slEUNrJYLX0UhS19Epeb6695N0ciLFd_UK36si9B7VHw6Py9qS3pJYdAAgmFFBlyFODs9BTIkSGFgkQCAV6Cqs57V7fD_ofauj1pwUHWtMNvgWBCzbiYiWTBCy2VVvIuZeyZ-k-GGf2c')

    cy.contains('Arturo');
    cy.contains('Rebeca');
    cy.contains('Alex');
    cy.contains('Ana');
  });
});
