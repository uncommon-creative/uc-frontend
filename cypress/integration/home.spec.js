describe('Open UC-Frontend', () => {
    it('Visits the Site', () => {
      cy.visit(Cypress.env('host'))
    })
  })