/// <reference types="cypress" />

describe('Formulaire d’inscription - GreenEcoSwap', () => {

  beforeEach(() => {
    cy.viewport('macbook-13');     // 1280x800
    cy.viewport('iphone-6');       // 375x667
    cy.viewport('ipad-2', 'landscape');
    cy.viewport(1920, 1080);       // résolution personnalisée

    cy.visit('/auth/register');
    cy.wait(500); // pause initiale pour stabiliser la vidéo
  });

  context('🧍‍♂️ Formulaire utilisateur simple', () => {

    it('affiche correctement les champs', () => {
      cy.get('input[name="isCompany"]').should('exist').and('not.be.checked');
      cy.wait(300);

      cy.get('input[formControlName="username"]').should('exist');
      cy.wait(300);
      cy.get('input[formControlName="email"]').should('exist');
      cy.wait(300);
      cy.get('input[formControlName="password"]').should('exist');
      cy.wait(300);
      cy.get('input[formControlName="confirmPassword"]').should('exist');
      cy.wait(300);
      cy.get('input[formControlName="siret"]').should('not.exist');
    });

    it('valide les champs obligatoires', () => {
      cy.get('app-button[type="submit"]').click();
      cy.wait(500);

      cy.get('input[formControlName="username"]').focus().blur();
      cy.wait(300);
      cy.get('input[formControlName="email"]').focus().blur();
      cy.wait(300);
      cy.get('input[formControlName="password"]').focus().blur();
      cy.wait(300);

      cy.contains('Ce champ est requis').should('exist');
      cy.wait(300);
    });

  });

  context('🏢 Formulaire entreprise', () => {

    beforeEach(() => {
      cy.get('input[name="isCompany"]').check().should('be.checked');
      cy.wait(500); // transition formulaire
    });

    it('affiche correctement les champs', () => {
      cy.get('input[formControlName="siret"]').should('exist');
      cy.wait(300);
      cy.get('input[formControlName="companyName"]').should('exist').and('be.disabled');
      cy.wait(300);
      cy.get('input[formControlName="address"]').should('exist').and('be.disabled');
      cy.wait(300);
      cy.get('input[formControlName="city"]').should('exist').and('be.disabled');
      cy.wait(300);
      cy.get('input[formControlName="postalCode"]').should('exist').and('be.disabled');
      cy.wait(300);
      cy.get('input[formControlName="description"]').should('exist');
      cy.wait(300);
      cy.get('input[type="file"]').should('exist');
    });

    it('valide les champs requis du formulaire entreprise', () => {
      cy.get('app-button[type="submit"]').click();
      cy.wait(500);

      cy.get('input[formControlName="username"]').focus().blur();
      cy.wait(300);
      cy.get('input[formControlName="email"]').focus().blur();
      cy.wait(300);
      cy.get('input[formControlName="password"]').focus().blur();
      cy.wait(300);
      cy.get('input[formControlName="confirmPassword"]').focus().blur();
      cy.wait(300);

      cy.contains('Ce champ est requis').should('exist');
      cy.wait(300);
    });

    it('remplit automatiquement les champs depuis le SIRET', () => {
      cy.intercept('GET', '**/api/v1/company/getCompanyInfo/**', {
        companyName: 'GreenEcoSwap SAS',
        numeroVoie: '15',
        typeVoie: 'Avenue',
        libelleVoie: 'des Écologistes',
        postalCode: '75012',
        city: 'Paris'
      }).as('getCompanyInfo');

      cy.get('input[formControlName="siret"]').clear().type('82889014500018');
      cy.wait('@getCompanyInfo');
      cy.wait(500);

      cy.get('input[formControlName="companyName"]').should('have.value', 'GreenEcoSwap SAS');
      cy.wait(300);
      cy.get('input[formControlName="address"]').should('have.value', '15 Avenue des Écologistes');
      cy.wait(300);
      cy.get('input[formControlName="postalCode"]').should('have.value', '75012');
      cy.wait(300);
      cy.get('input[formControlName="city"]').should('have.value', 'Paris');
    });

    it('n’effectue pas d’appel API si le SIRET est invalide', () => {
      cy.intercept('GET', '**/getCompanyInfo/**').as('getCompanyInfo');

      cy.get('input[formControlName="siret"]').clear().type('123');
      cy.wait(600); // attendre le debounce
      cy.get('@getCompanyInfo.all').should('have.length', 0);

      cy.get('input[formControlName="companyName"]').should('have.value', '');
      cy.wait(300);
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

      cy.get('input[formControlName="siret"]').clear().type('82889014500018').blur();
      cy.wait('@getCompanyInfo');
      cy.wait(500);

      cy.get('input[formControlName="description"]').type('Entreprise spécialisée dans l’écologie');
      cy.wait(300);
      cy.get('input[formControlName="username"]').type('green_user');
      cy.wait(300);
      cy.get('input[formControlName="email"]').type('contact@greeneco.fr');
      cy.wait(300);
      cy.get('input[formControlName="password"]').type('Aa123456!');
      cy.wait(300);
      cy.get('input[formControlName="confirmPassword"]').type('Aa123456!');
      cy.wait(300);

      const fileName = 'kbis.pdf';
      cy.fixture(fileName, 'base64').then(fileContent => {
        cy.get('input[type="file"]').attachFile({
          fileContent,
          fileName,
          mimeType: 'application/pdf'
        });
      });
      cy.wait(500);

      cy.intercept('POST', '**/submitRequest', { statusCode: 200 }).as('submitCompany');

      cy.get('app-button[type="submit"]').click();
      cy.wait('@submitCompany');
    });

  });

  context('🔗 Navigation', () => {
    it('retourne à la page de connexion', () => {
      cy.contains('Revenir à la page de connexion').click();
      cy.wait(500);
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });


});
