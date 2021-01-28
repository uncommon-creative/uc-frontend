// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("login", (user) => {
  cy.visit(Cypress.env('host'))

  // Get an input, type into it and verify that the value has been updated
  cy.get('[data-cy=email]')
    .type(user)
    .should('have.value', user)

  // Get an input, type into it and verify that the value has been updated
  cy.get('[data-cy=password]')
    .type(Cypress.env('password'))
    .should('have.value', Cypress.env('password'))

  cy.get('[data-cy=login]').contains('Login').click()

  assert.exists(cy.contains("Welcome"), 'user logged successfully')
})

Cypress.Commands.add("logout", () => {

  cy.get('[data-cy=headerProfileToggler]').click()
  cy.wait(1000)
  cy.get('[data-cy=logout]').contains('Logout').click()

  assert.exists(cy.contains("Login Page"), 'user logged out successfully')
})
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
