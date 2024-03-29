describe('Statement of Work', () => {

  it('Create sow', () => {
    cy.login(Cypress.env('userSeller'))
    cy.wait(2000)

    cy.get('[data-cy=createSow]').contains('new project').click()

    cy.get('[data-cy="inputSowID"]')
      .should('not.be.empty')

    cy.get('[data-cy=inputSowTitle]')
      .should('have.value', 'Draft Title')
    assert.exists(cy.contains("Create a new Statement of Work"), 'sow created successfully')
  })
})