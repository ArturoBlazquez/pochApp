describe('Pocha Scoring App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
  });

  it('lets user add players and start the game', () => {
    cy.get('input[placeholder="Player name"]').type('Alice');
    cy.get('button').contains(/add player/i).click();

    cy.get('input[placeholder="Player name"]').type('Bob');
    cy.get('button').contains(/add player/i).click();

    cy.contains('Alice');
    cy.contains('Bob');

    cy.contains(/start game/i).click();
    cy.contains(/Predictions - Hand 1/i).should('be.visible');
  });

  it('plays through a hand and shows scoreboard', () => {
    // Add players
    cy.get('input[placeholder="Player name"]').type('Alice');
    cy.get('button').contains(/add player/i).click();
    cy.get('input[placeholder="Player name"]').type('Bob');
    cy.get('button').contains(/add player/i).click();
    cy.contains(/start game/i).click();

    // Predictions
    cy.get('input').eq(0).clear().type('1');
    cy.get('input').eq(1).clear().type('1');
    cy.contains(/next/i).click();

    // Results
    cy.get('input').eq(0).clear().type('1');
    cy.get('input').eq(1).clear().type('0');
    cy.contains(/next/i).click();

    // Scoreboard
    cy.contains(/Scores - Hand 1/i).should('be.visible');
    cy.get('td').contains('Alice').parent().should('contain', '15');
    cy.get('td').contains('Bob').parent().should('contain', '-5');
  });

  it('navigates back to edit predictions and results', () => {
    // Setup players
    cy.get('input[placeholder="Player name"]').type('Alice');
    cy.get('button').contains(/add player/i).click();
    cy.get('input[placeholder="Player name"]').type('Bob');
    cy.get('button').contains(/add player/i).click();
    cy.contains(/start game/i).click();

    // Predictions
    cy.get('input').eq(0).clear().type('1');
    cy.get('input').eq(1).clear().type('1');
    cy.contains(/next/i).click();

    // Results
    cy.get('input').eq(0).clear().type('1');
    cy.get('input').eq(1).clear().type('0');
    cy.contains(/next/i).click();

    // Scoreboard, then back twice to predictions
    cy.contains(/back/i).click();
    cy.contains(/Results - Hand 1/i).should('be.visible');
    cy.contains(/back/i).click();
    cy.contains(/Predictions - Hand 1/i).should('be.visible');

    // Change predictions
    cy.get('input').eq(0).clear().type('0');
    cy.contains(/next/i).click();
    cy.get('input').eq(0).should('have.value', '1'); // results still has old actual tricks
  });

  it('plays two hands, edits first hand results, and sees updated totals', () => {
    // Add players
    cy.get('input[placeholder="Player name"]').type('Alice');
    cy.get('button').contains(/add player/i).click();
    cy.get('input[placeholder="Player name"]').type('Bob');
    cy.get('button').contains(/add player/i).click();
    cy.contains(/start game/i).click();

    // Hand 1 predictions & results
    cy.get('input').eq(0).clear().type('0');
    cy.get('input').eq(1).clear().type('1');
    cy.contains(/next/i).click();
    cy.get('input').eq(0).clear().type('0');
    cy.get('input').eq(1).clear().type('1');
    cy.contains(/next/i).click();

    // Next hand
    cy.contains(/next/i).click();

    // Hand 2 predictions & results
    cy.get('input').eq(0).clear().type('1');
    cy.get('input').eq(1).clear().type('2');
    cy.contains(/next/i).click();
    cy.get('input').eq(0).clear().type('1');
    cy.get('input').eq(1).clear().type('1');
    cy.contains(/next/i).click();
    cy.get('td').contains('Alice').parent().should('contain', '25');
    cy.get('td').contains('Bob').parent().should('contain', '10');


    // Go back to Hand 1 results
    cy.contains(/back/i).click();
    cy.contains(/back/i).click();
    cy.contains(/back/i).click();
    cy.contains(/back/i).click();

    // Change Alice's actual tricks from 0 -> 1
    cy.get('input').eq(0).clear().type('1');
    cy.contains(/next/i).click();
    cy.get('td').contains('Alice').parent().should('contain', '-5');
    cy.get('td').contains('Bob').parent().should('contain', '15');
    cy.contains(/next/i).click();
    cy.contains(/next/i).click();
    cy.contains(/next/i).click();


    cy.get('td').contains('Alice').parent().should('contain', '10');
    cy.get('td').contains('Bob').parent().should('contain', '10');
  });
});
