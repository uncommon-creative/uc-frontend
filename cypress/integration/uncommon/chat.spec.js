describe('Chat', () => {

  it('Send message', () => {
    cy.login()
    cy.wait(2000)

    cy.get('[data-cy=submittedSowStatus21981]').contains('SUBMITTED')
    cy.get('[data-cy=submittedSow21981]').contains('21981').click()

    cy.get('[data-cy=messageInput21981]')
      .type('test cypress invio messaggio')
      .should('have.value', 'test cypress invio messaggio')

    cy.get('[data-cy=sendMessage21981]').click()

    cy.wait(2000)

    cy.get('[class=rce-mbox-text]')
      .contains('test cypress invio messaggio')

  })
})