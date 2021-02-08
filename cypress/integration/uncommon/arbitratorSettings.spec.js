describe('Chat', () => {


  it('Arbitrator settings', () => {
    cy.login(Cypress.env('userSeller'))
    cy.wait(10000)

    cy.get('[data-cy=headerProfileToggler]').click()
    cy.wait(1000)
    cy.get('[data-cy=profile]').contains('Profile').click()
    cy.wait(2000)

    cy.get('[data-cy=arbitratorSettingsEnabled]').parent().click('left')

    cy.get('[data-cy=arbitratorSettingsFeeFlat]')
      .clear()
      .type(10)
      .should('have.value', 10)

    cy.get('[data-cy=arbitratorSettingsFeePercentage]')
      .clear()
      .type(5)
      .should('have.value', 5)

    cy.get('[data-cy=arbitratorSettingsTags]')
      .click()
      .get('[data-cy=arbitratorSettingsTags] input')
      .clear()
      .type('cypress{enter}')
      .get('[class=css-1rhbuit-multiValue]')
      .contains('cypress')

    cy.get('[data-cy=arbitratorSettingsSubmit]')
      .click()
  })
})