describe('Pocha Scoring App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
  });

  it('lets user add and remove players and start the game', () => {
    // Add players
    cy.get('input[placeholder="Player name"]').type('Alice');
    cy.get('button').contains(/add player/i).click();

    cy.get('input[placeholder="Player name"]').type('Charlie');
    cy.get('button').contains(/add player/i).click();

    cy.get('input[placeholder="Player name"]').type('Bob{enter}');

    // Remove player
    cy.contains('Charlie').parent().find('button').click();

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
    cy.contains('Next').click();

    // Predictions
    cy.get('input').eq(0).clear().type('1');
    cy.get('input').eq(1).clear().type('1');
    cy.contains('Next').click();

    // Results
    cy.contains('Results - Hand 1');
    cy.get('input').eq(0).clear().type('1');
    cy.get('input').eq(1).clear().type('0');
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
    cy.get('input').eq(0).clear().type('0');
    cy.get('input').eq(1).clear().type('1');
    cy.contains('Next').click();

    cy.get('input').eq(0).clear().type('0');
    cy.get('input').eq(1).clear().type('1');
    cy.contains('Next').click();

    cy.get('td').contains('Alice').parent().should('contain', '10');
    cy.get('td').contains('Bob').parent().should('contain', '15');
    cy.contains('Next').click();

    // Hand 2 predictions, results and scores
    cy.get('input').eq(0).clear().type('1');
    cy.get('input').eq(1).clear().type('2');
    cy.contains('Next').click();

    cy.get('input').eq(0).clear().type('1');
    cy.get('input').eq(1).clear().type('1');
    cy.contains('Next').click();

    cy.get('td').contains('Alice').parent().should('contain', '25');
    cy.get('td').contains('Bob').parent().should('contain', '10');

    // Go back to Hand 1 results
    cy.contains('Back').click();
    cy.contains('Back').click();
    cy.contains('Back').click();
    cy.contains('Back').click();

    // Change Alice's actual tricks from 0 -> 1
    cy.get('input').eq(0).clear().type('1');
    cy.contains('Next').click();

    cy.get('td').contains('Alice').parent().should('contain', '-5');
    cy.get('td').contains('Bob').parent().should('contain', '15');

    cy.contains('Next').click();
    cy.contains('Next').click();
    cy.contains('Next').click();

    cy.get('td').contains('Alice').parent().should('contain', '10');
    cy.get('td').contains('Bob').parent().should('contain', '10');
  });

  it('creates default tricks per hand', () => {
    cy.get('input[placeholder="Player name"]').type('Alice{enter}');
    cy.get('input[placeholder="Player name"]').type('Bob{enter}');
    cy.contains('Next').click();

    cy.get('li[nz-list-item]').should('have.length', 40);
    cy.get('li[nz-list-item]').eq(0).contains(1);
    cy.get('li[nz-list-item]').eq(1).contains(2);
    cy.get('li[nz-list-item]').eq(18).contains(19);
    cy.get('li[nz-list-item]').eq(19).contains(20);
    cy.get('li[nz-list-item]').eq(20).contains(20);
    cy.get('li[nz-list-item]').eq(21).contains(19);
    cy.get('li[nz-list-item]').eq(38).contains(2);
    cy.get('li[nz-list-item]').eq(39).contains(1);

    cy.contains('Back').click();
    cy.get('input[placeholder="Player name"]').type('Charlie{enter}');
    cy.get('input[placeholder="Player name"]').type('David{enter}');
    cy.contains('Next').click();

    cy.get('li[nz-list-item]').should('have.length', 22);
    cy.get('li[nz-list-item]').eq(0).contains(1);
    cy.get('li[nz-list-item]').eq(1).contains(2);
    cy.get('li[nz-list-item]').eq(8).contains(9);
    cy.get('li[nz-list-item]').eq(9).contains(10);
    cy.get('li[nz-list-item]').eq(10).contains(10);
    cy.get('li[nz-list-item]').eq(11).contains(10);
    cy.get('li[nz-list-item]').eq(12).contains(10);
    cy.get('li[nz-list-item]').eq(13).contains(9);
    cy.get('li[nz-list-item]').eq(20).contains(2);
    cy.get('li[nz-list-item]').eq(21).contains(1);
  });

  it('edit tricks per hand', () => {
    cy.get('input[placeholder="Player name"]').type('Alice{enter}');
    cy.get('input[placeholder="Player name"]').type('Bob{enter}');
    cy.contains('Next').click();

    cy.get('li[nz-list-item]').eq(19).find('button').click();
    cy.get('li[nz-list-item]').should('have.length', 39);

    cy.get('input').type('50{enter}');

    cy.get('li[nz-list-item]').should('have.length', 40);
    cy.get('li[nz-list-item]').eq(39).contains(50);
  });
});
