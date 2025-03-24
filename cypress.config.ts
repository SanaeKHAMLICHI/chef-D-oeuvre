import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(_on: Cypress.PluginEvents, _config: Cypress.PluginConfigOptions) {
      // implement node event listeners here
    },
  },
});
