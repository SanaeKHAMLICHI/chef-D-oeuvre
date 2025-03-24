/// <reference types="cypress" />

describe('Auth Layout Component', () => {

  beforeEach(() => {
    cy.visit('/auth/register'); // Remplace par la bonne URL de ton composant
  });

  it('affiche correctement les champs pour utilisateur simple', () => {
    cy.get('input[name="isCompany"]').should('exist').and('not.be.checked');

    cy.get('input[formControlName="userName"]').should('exist');
    cy.get('input[formControlName="email"]').should('exist');
    cy.get('input[formControlName="password"]').should('exist');
    cy.get('input[formControlName="confirmPassword"]').should('exist');

    cy.get('input[formControlName="siret"]').should('not.exist');
  });

  it('change vers le formulaire entreprise lorsque la case est cochée', () => {
    cy.get('input[name="isCompany"]').check().should('be.checked');

    cy.get('input[formControlName="siret"]').should('exist');
    cy.get('input[formControlName="companyName"]').should('exist').and('be.disabled');
    cy.get('input[formControlName="address"]').should('exist').and('be.disabled');
    cy.get('input[formControlName="city"]').should('exist').and('be.disabled');
    cy.get('input[formControlName="postalCode"]').should('exist').and('be.disabled');
    cy.get('input[formControlName="description"]').should('exist');
    cy.get('input[type="file"]').should('exist');
  });

  it('valide les champs obligatoires du formulaire utilisateur simple', () => {
    cy.get('app-button[type="submit"]').click();

    cy.get('input[formControlName="userName"]').focus().blur();
    cy.get('input[formControlName="email"]').focus().blur();
    cy.get('input[formControlName="password"]').focus().blur();

    cy.contains('Veuillez entrer votre email').should('exist');
    cy.contains('Veuillez entrer un mot de passe').should('exist');
  });

  it('remplit automatiquement les champs entreprise après saisie du SIRET', () => {
    cy.intercept('GET', '**/api/v1/company/getCompanyInfo/**', {
      companyName: 'GreenEcoSwap SAS',
      numeroVoie: '15',
      typeVoie: 'Avenue',
      libelleVoie: 'des Écologistes',
      postalCode: '75012',
      city: 'Paris'
    }).as('getCompanyInfo');



    cy.visit('/auth/register');

    cy.get('input[name="isCompany"]').check();

    cy.get('input[formControlName="siret"]')
      .clear()
      .type('82889014500018');

    cy.wait('@getCompanyInfo');

    cy.get('input[formControlName="companyName"]').should('have.value', 'GreenEcoSwap SAS');
    cy.get('input[formControlName="address"]').should('have.value', '15 Avenue des Écologistes');
    cy.get('input[formControlName="postalCode"]').should('have.value', '75012');
    cy.get('input[formControlName="city"]').should('have.value', 'Paris');
  });
  it('ne fait pas d’appel API si le SIRET est invalide', () => {
    cy.intercept('GET', '**/getCompanyInfo/**').as('getCompanyInfo');

    cy.get('input[name="isCompany"]').check();
    cy.get('input[formControlName="siret"]').clear().type('123'); // invalide

    cy.wait(500); // attendre le debounce
    cy.get('@getCompanyInfo.all').should('have.length', 0); // aucune requête

    cy.get('input[formControlName="companyName"]').should('have.value', '');
  });

  it('permet de soumettre un formulaire entreprise complet', () => {
    cy.intercept('GET', '**/getCompanyInfo/**', {
      companyName: 'GreenEcoSwap SAS',
      numeroVoie: '15',
      typeVoie: 'Avenue',
      libelleVoie: 'des Écologistes',
      postalCode: '75012',
      city: 'Paris'
    }).as('getCompanyInfo');

    cy.get('input[name="isCompany"]').check();
    cy.get('input[formControlName="siret"]').clear().type('82889014500018').blur();
    cy.wait('@getCompanyInfo');

    cy.get('input[formControlName="description"]').type('Entreprise spécialisée dans l’écologie');
    cy.get('input[formControlName="username"]').type('green_user');
    cy.get('input[formControlName="email"]').type('contact@greeneco.fr');
    cy.get('input[formControlName="password"]').type('Aa123456!');
    cy.get('input[formControlName="confirmPassword"]').type('Aa123456!');

    // simule un fichier Kbis
    const fileName = 'kbis.pdf';
    cy.fixture(fileName, 'base64').then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName,
        mimeType: 'application/pdf'
      });
    });

    cy.intercept('POST', '**/submitRequest', { statusCode: 200 }).as('submitCompany');

    cy.get('app-button[type="submit"]').click();

    cy.wait('@submitCompany').its('request.body').should('exist'); // ou inspecter les champs
  });

  it('retourne à la page de connexion', () => {
    cy.contains('Revenir à la page de connexion').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
