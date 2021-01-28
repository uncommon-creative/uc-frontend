describe('Chat', () => {

  it('Send message', () => {
    cy.login(Cypress.env('user'))
    cy.wait(2000)

    cy.get('[data-cy=submittedSowStatus]').not('DRAFT')
    cy.get('[data-cy=submittedSow]').contains('21981'.toUpperCase()).click()

    cy.get('[data-cy=messageInput]')
      .type('test cypress invio messaggio')
      .should('have.value', 'test cypress invio messaggio')

    cy.get('[data-cy=sendMessage]').click()

    cy.wait(2000)

    cy.get('[class=rce-mbox-text]')
      .contains('test cypress invio messaggio')

  })
})