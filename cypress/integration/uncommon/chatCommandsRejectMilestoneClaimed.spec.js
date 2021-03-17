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

    cy.wait(2000)

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

      // buyer ACCEPT_AND_PAY
      cy.login(Cypress.env('userBuyer'))
      cy.wait(2000)
      cy.get('[data-cy=customerTab]').click()
      cy.visit(Cypress.env('host') + `/statement-of-work/${sowID}`)
      cy.wait(2000)
      cy.get('[data-cy=selectArbitratorDennisA2]').click()
      cy.get('[data-cy=willChooseArbitrator]').click()
      cy.get('[data-cy=ACCEPT_AND_PAY]').click()
      cy.wait(500)
      cy.get('[data-cy=acceptConditions]').check()
      cy.get('[data-cy=continueTransaction]').click()
      cy.wait(2000)
      cy.get('[data-cy=completeAcceptAndPay]').click()
      cy.wait(10000)
      cy.get('[data-cy=closeAcceptAndPay]').click()
      cy.wait(10000)
      cy.get('[class=rce-mbox-text]')
        .contains('ACCEPT_AND_PAY')
      cy.logout()

      // seller CLAIM_MILESTONE_MET
      cy.login(Cypress.env('userSeller'))
      cy.wait(2000)
      cy.visit(Cypress.env('host') + `/statement-of-work/${sowID}`)
      cy.get('[data-cy=CLAIM_MILESTONE_MET]').click()
      cy.get('[data-cy=acceptConditions]').check()
      cy.get('[data-cy=continueTransaction]').click()
      cy.wait(1000)
      cy.get('[data-cy=mnemonicSecretKey]')
        .type(Cypress.env('userSellerMnemonic'))
        .should('have.value', Cypress.env('userSellerMnemonic'))
      cy.wait(5000)
      cy.get('[data-cy=willSignTransactionClaimMilestoneMet]').click()
      cy.wait(10000)
      cy.get('[data-cy=closeClaimMilestoneMet]').click()
      cy.wait(5000)
      cy.get('[class=rce-mbox-text]')
        .contains('CLAIM_MILESTONE_MET')
      cy.logout()

      // buyer REJECT
      cy.login(Cypress.env('userBuyer'))
      cy.wait(2000)
      cy.get('[data-cy=customerTab]').click()
      cy.visit(Cypress.env('host') + `/statement-of-work/${sowID}`)
      cy.get('[data-cy=REJECT]').click()
      cy.wait(1000)
      cy.get('[data-cy=willReject]').click()
      cy.wait(1000)
      cy.get('[data-cy=closeReject]').click()
      cy.wait(5000)
      cy.get('[class=rce-mbox-text]')
        .contains('REJECT')
      cy.logout()
    })
  })
})