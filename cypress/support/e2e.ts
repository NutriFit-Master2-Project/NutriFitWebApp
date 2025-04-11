// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
// ***********************************************************

// // Prevent Cypress from failing tests on uncaught exceptions
// Cypress.on('uncaught:exception', (err, runnable) => {
//   return false
// })

declare global {
    namespace Cypress {
        interface Chainable {
            // Add custom commands here if needed
        }
    }
}

// Import commands.js using ES2015 syntax:
// import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

export {};
