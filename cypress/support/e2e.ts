/// <reference types="cypress" />

// Import des commandes personnalisées
import 'cypress-file-upload';
import './commands';

// Déclaration des types pour les commandes personnalisées
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      login(email: string, password: string): Chainable<void>;
    }
  }
}

// Configuration globale
Cypress.on('uncaught:exception', (_err: Error, _runnable: Mocha.Runnable) => {
  // Retourne false pour empêcher Cypress de échouer le test
  return false;
}); 