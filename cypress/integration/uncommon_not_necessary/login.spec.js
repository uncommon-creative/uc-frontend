describe('Open site', () => {
  it('Visits the Site', () => {
    cy.visit(Cypress.env('host'))
  })
})

describe('User Mng', () => {
  it('Login User on the site', () => {

    // Get an input, type into it and verify that the value has been updated
    cy.get('[data-cy=email]')
      .type(Cypress.env('userSeller'))
      .should('have.value', Cypress.env('userSeller'))

    // Get an input, type into it and verify that the value has been updated
    cy.get('[data-cy=password]')
      .type(Cypress.env('password'))
      .should('have.value', Cypress.env('password'))

    cy.get('[data-cy=login]').contains('Login').click()

    assert.exists(
      cy.get('[data-cy=createSow]')
        .contains("new project"),
      'user submitted sow successfully'
    )
  })


})