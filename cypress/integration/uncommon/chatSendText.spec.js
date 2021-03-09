describe('Chat', () => {
  before(() => {
    cy.login(Cypress.env('userSeller'))
    cy.wait(10000)
    cy.get('[data-cy=createSow]').contains('new project').click()

    cy.get('[data-cy="inputSowID"]')
      .should('not.be.empty')

    cy.get('[data-cy="inputSowID"]')
      .invoke('val')
      .then(sowID => {
        cy.wrap(sowID).as('sowID')
      })

    cy.get('[data-cy=inputSowTitle]')
      .should('have.value', 'Draft Title')

    cy.get('[data-cy=inputSowBuyer]')
      .type(Cypress.env('userBuyer'))
      .should('have.value', Cypress.env('userBuyer'))

    cy.get('[data-cy=inputSowTitle]')
      .clear()
      .type('cypress')
      .should('have.value', 'cypress')

    cy.get('[aria-label=rdw-editor]')
      .type('cypress description')
      .contains('cypress description')

    cy.get('[data-cy=inputSowQuantity]')
      .clear()
      .type(3)
      .should('have.value', 3)

    cy.get('[data-cy=inputSowPrice]')
      .type(1)
      .should('have.value', 1)

    cy.get('[id=rdp-form-control-deadline]')
      .click()
      .wait(2000)
      .type('15082030')
      .should('have.value', '15/08/2030')

    cy.get('[data-cy=inputSowTags]')
      .click()
      .get('[data-cy=inputSowTags] input')
      .type('cypress{enter}')
      .get('[class=css-1rhbuit-multiValue]')
      .contains('cypress')

    cy.get('[data-cy=inputSowNumberReviews]')
      .type(5)
      .should('have.value', 5)

    cy.get('[data-cy=inputSowArbitratorsModal]')
      .contains('Select the arbitrators')
      .click()
    cy.get('[data-cy=inputSowArbitratorsSelect]')
      .contains('DennisA1 Arbitrator1')
      .click()
    cy.get('[data-cy=inputSowArbitratorsAdd]')
      .contains('Add to arbitrators')
      .click()
    cy.get('[data-cy=inputSowArbitratorsSelect]')
      .contains('DennisA2 Arbitrator2')
      .click()
    cy.get('[data-cy=inputSowArbitratorsAdd]')
      .contains('Add to arbitrators')
      .click()
    cy.get('[data-cy=inputSowArbitratorsSelect]')
      .contains('DennisA3 Arbitrator3')
      .click()
    cy.get('[data-cy=inputSowArbitratorsAdd]')
      .contains('Add to arbitrators')
      .click()
    cy.get('[data-cy=inputSowArbitratorsConfirm]')
      .contains('Confirm')
      .click()

    cy.get('[data-cy=inputSowExpiration]')
      .select('1 day')

    cy.get('[data-cy=inputSowTermsOfService]')
      .check()

    cy.get('[data-cy=inputSowCodeOfConduct]')
      .check()

    cy.get('[data-cy=inputSowSubmit]')
      .click()

    cy.wait(2000)

    assert.exists(
      cy.get('[data-cy=createSow]')
        .contains("new project"),
      'user submitted sow successfully'
    )

  })

  it('Send message as seller', () => {

    cy.get('@sowID').then((sowID) => {
      cy.log("sowID: ", sowID)

      cy.wait(5000)
      cy.visit(Cypress.env('host') + `/statement-of-work/${sowID}`)
      cy.get('[class="rce-input rce-input-textarea"]')
        .type('test cypress invio messaggio seller')
        .should('have.value', 'test cypress invio messaggio seller')
      cy.get('[data-cy=sendMessage]').click()
      cy.wait(5000)
      cy.get('[class=rce-mbox-text]')
        .contains('test cypress invio messaggio seller')

      cy.logout()
      cy.login(Cypress.env('userBuyer'))
      cy.wait(5000)

      cy.get('[data-cy=customerTab]').click()
      // cy.visit(Cypress.env('host') + `/statement-of-work/${sowID}`).parents('tr').within(() => {
      //   cy.get('[data-cy=unreadMessagesSowBuyer]').contains(1)
      // })

      cy.visit(Cypress.env('host') + `/statement-of-work/${sowID}`)
      cy.wait(5000)
      cy.get('[class="rce-mbox-text"]')
        .contains('test cypress invio messaggio seller')

      cy.get('[class="rce-input rce-input-textarea"]')
        .type('test cypress invio messaggio buyer UNO')
        .should('have.value', 'test cypress invio messaggio buyer UNO')
      cy.get('[data-cy=sendMessage]').click()
      cy.wait(5000)
      cy.get('[class=rce-mbox-text]')
        .contains('test cypress invio messaggio buyer UNO')

      cy.get('[class="rce-input rce-input-textarea"]')
        .type('test cypress invio messaggio buyer DUE')
        .should('have.value', 'test cypress invio messaggio buyer DUE')
      cy.get('[data-cy=sendMessage]').click()
      cy.wait(5000)
      cy.get('[class=rce-mbox-text]')
        .contains('test cypress invio messaggio buyer DUE')

      cy.logout()
      cy.login(Cypress.env('userSeller'))
      cy.wait(5000)

      cy.visit(Cypress.env('host') + `/statement-of-work/${sowID}`)
      // cy.visit(Cypress.env('host') + `/statement-of-work/${sowID}`).parents('tr').within(() => {
      //   cy.get('[data-cy=unreadMessagesSowSeller]').contains(2)
      // })

      cy.get('[class="rce-mbox-text"]')
        .contains('test cypress invio messaggio buyer DUE')
    })
  })
})