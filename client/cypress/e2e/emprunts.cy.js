describe('Gestion des emprunts', () => {
  beforeEach(() => {
    cy.fixture('emprunts.json').as('empruntsData');
    cy.intercept('GET', '**/api/emprunts', { fixture: 'emprunts.json' }).as(
      'getEmprunts'
    );
    cy.intercept('GET', '**/api/session', {
      statusCode: 200,
      body: { user: { id: 1, role: 'utilisateur' } },
    });
  });

  it('se connecte et affiche la liste de ses emprunts', function () {
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="email"]').type('john@smith.com');
    cy.get('input[name="password"]').type('azerty');
    cy.get('button[type="submit"]').click();

    cy.visit('http://localhost:5173/emprunts');
    cy.wait('@getEmprunts');

    cy.contains(this.empruntsData[0].titre).should('be.visible');
  });
});
