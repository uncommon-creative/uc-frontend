describe('Chat', () => {

  before(() => {
    cy.login(Cypress.env('userSeller'))
    cy.wait(2000)
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
      .contains('Select an arbitrator')
      .click()
    cy.wait(1000)
    cy.get('[data-cy=inputSowArbitratorsSelect]')
      .contains('DennisA1 Arbitrator1')
      .click()
    cy.get('[data-cy=willSelectArbitrator]')
      .contains('Select the arbitrator')
      .click()
    // cy.get('[data-cy=inputSowArbitratorsSelect]')
    //   .contains('DennisA2 Arbitrator2')
    //   .click()
    // cy.get('[data-cy=inputSowArbitratorsAdd]')
    //   .contains('Add to arbitrators')
    //   .click()
    // cy.get('[data-cy=inputSowArbitratorsSelect]')
    //   .contains('DennisA3 Arbitrator3')
    //   .click()
    // cy.get('[data-cy=inputSowArbitratorsAdd]')
    //   .contains('Add to arbitrators')
    //   .click()
    cy.get('[data-cy=inputSowArbitratorsConfirm]')
      .contains('Confirm')
      .click()

    cy.get('[data-cy=licenseTerms-option1]')
      .check()

    cy.get('[data-cy=inputSowExpiration]')
      .select('1 day')

    cy.get('[data-cy=inputSowTermsOfService]')
      .check()

    cy.get('[data-cy=inputSowCodeOfConduct]')
      .check()

    cy.get('[data-cy=inputSowSubmit]')
      .click()
    cy.wait(30000)
    cy.get('[data-cy=mnemonicSubmit]')
      .click()
    cy.get('[data-cy=mnemonicSecretKey]')
      .type(Cypress.env('userSellerMnemonic'), { timeout: 15000 })
      .should('have.value', Cypress.env('userSellerMnemonic'))

    cy.get('[data-cy=willCompleteTransactionSubmitMnemonic]')
      .click()
    cy.wait(30000)
    cy.get('[data-cy=sowSubmitSuccess]')
      .contains("Statement of Work submitted")
    cy.get('[data-cy=closeSubmit]')
      .click()
    cy.wait(5000)

    assert.exists(
      cy.get('[data-cy=createSow]')
        .contains("new project"),
      'user submitted sow successfully'
    )

    cy.logout()
  })

  it('Send commands', () => {

    cy.get('@sowID').then((sowID) => {
      cy.log("sowID: ", sowID)

      // buyer REJECT
      cy.login(Cypress.env('userBuyer'))
      cy.wait(2000)
      cy.get('[data-cy=customerTab]').click()
      cy.visit(Cypress.env('host') + `/statement-of-work/${sowID}`)
      cy.wait(3000)
      cy.get('[data-cy=REJECT]').click()
      cy.wait(1000)
      cy.get('[data-cy=willReject]').click()
      cy.wait(1000)
      cy.get('[data-cy=closeReject]').click()
      cy.wait(5000)
      cy.get('[data-cy=chatCommand]')
        .contains('Reject')
      cy.logout()
    })
  })
})