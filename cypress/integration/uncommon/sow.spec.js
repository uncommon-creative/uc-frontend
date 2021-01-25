describe('Create sow', () => {
  it('Login User on the site', () => {
    cy.visit(Cypress.env('host'))

    // Get an input, type into it and verify that the value has been updated
    cy.get('[data-cy=email]')
      .type(Cypress.env('user'))
      .should('have.value', Cypress.env('user'))

    // Get an input, type into it and verify that the value has been updated
    cy.get('[data-cy=password]')
      .type(Cypress.env('password'))
      .should('have.value', Cypress.env('password'))

    cy.get('[data-cy=login]').contains('Login').click() 

    assert.exists(cy.contains("Welcome"), 'user logged successfully')
  })

  it('Create sow', () => {
    cy.wait(2000)
    cy.get('[data-cy=createSow]').contains('new Statement Of Work').click()

    cy.wait(2000)

    cy.get('[data-cy="inputSowID"]')
      .should('not.be.empty')

    cy.get('[data-cy=inputSowTitle]')
    .should('have.value', 'Draft Title')
    // assert.exists(cy.contains("Welcome"), 'user logged successfully')
  })
})