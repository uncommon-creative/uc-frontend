describe('Attachment', () => {

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
      .contains('Confirm arbitrators')
      .click()

    cy.get('[data-cy=inputSowExpiration]')
      .select('3 months')

    cy.get('[data-cy=inputSowTermsOfService]')
      .check()

    cy.get('[data-cy=inputSowCodeOfConduct]')
      .check()

    cy.get('[data-cy=inputAttachment]')
      .attachFile('attachmentCypressSow.txt');
    cy.wait(1000)
    cy.get('[data-cy=attachmentsSow]')
      .get('[data-cy=attachment] a')
      .contains('attachmentCypressSow.txt')

    cy.get('[data-cy=inputSowSubmit]')
      .click()

    cy.wait(2000)

    assert.exists(cy.contains("Welcome"), 'user submitted sow successfully')

  })

  it('Upload attachment in sow', () => {

    cy.get('@sowID').then((sowID) => {
      cy.log("sowID: ", sowID)

      cy.wait(5000)
      // seller
      cy.get('[data-cy=submittedSow]').contains(sowID.substr(0, 5).toUpperCase()).click()
      // seller test sow attachment
      cy.get('[data-cy=attachmentsSow]')
        .get('[data-cy=attachment] a')
        .contains('attachmentCypressSow.txt')
      // seller attachment upload
      cy.get('[data-cy=inputAttachment]')
        .attachFile('attachmentCypressSeller.txt');
      cy.wait(1000)
      cy.get('[data-cy=attachmentsSeller]')
        .get('[data-cy=attachment] a')
        .contains('attachmentCypressSeller.txt')
      cy.logout()


      // buyer
      cy.login(Cypress.env('userBuyer'))
      cy.wait(2000)
      cy.get('[data-cy=customerTab]').click()
      cy.get('[data-cy=submittedSow]').contains(sowID.substr(0, 5).toUpperCase()).click()
      // buyer test sow attachment
      cy.get('[data-cy=attachmentsSow]')
        .get('[data-cy=attachment] a')
        .contains('attachmentCypressSow.txt')
      // buyer attachment upload
      cy.get('[data-cy=inputAttachment]')
        .attachFile('attachmentCypressBuyer.txt');
      cy.wait(1000)
      cy.get('[data-cy=attachmentsBuyer]')
        .get('[data-cy=attachment] a')
        .contains('attachmentCypressBuyer.txt')
    })
  })
})