describe('Statement of Work', () => {

  it('Submit sow', () => {
    cy.login(Cypress.env('userSeller'))
    cy.wait(2000)
    cy.get('[data-cy=createSow]').contains('new Statement Of Work').click()

    cy.get('[data-cy="inputSowID"]')
      .should('not.be.empty')

    cy.get('[data-cy=inputSowTitle]')
      .should('have.value', 'Draft Title')

    cy.get('[data-cy=inputSowBuyer]')
      .type(Cypress.env('userBuyer'))
      .should('have.value', Cypress.env('userBuyer'))

    cy.get('[data-cy=inputSowTitle]')
      .clear()
      .type('cypress: chat commands')
      .should('have.value', 'cypress: chat commands')

    cy.get('[aria-label=rdw-editor]')
      .type('cypress: chat commands description')
      .contains('cypress: chat commands description')

    cy.get('[data-cy=inputSowQuantity]')
      .type(3)
      .should('have.value', 3)

    cy.get('[data-cy=inputSowPrice]')
      .type(20)
      .should('have.value', 20)

    cy.get('[id=rdp-form-control-deadline]')
      .click()
      .wait(2000)
      .type('15082030')
      .should('have.value', '15/08/2030')

    cy.get('[data-cy=inputSowTags]')
      .click()
      .get('[id=react-select-3-input]')
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
      .contains('Confirm arbitrators')
      .click()

    cy.get('[data-cy=inputSowTermsOfService]')
      .check()

    cy.get('[data-cy=inputSowCodeOfConduct]')
      .check()

    cy.get('[data-cy=inputSowSubmit]')
      .click()

    cy.wait(2000)

    assert.exists(cy.contains("Welcome"), 'user submitted sow successfully')

  })
})