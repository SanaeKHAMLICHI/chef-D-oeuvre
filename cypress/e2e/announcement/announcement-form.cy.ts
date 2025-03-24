/// <reference types="cypress" />

describe("Formulaire d'annonce", () => {
  let testUser: { email: string; password: string };

  before(() => {
    cy.fixture('users.json').then((users) => {
      testUser = users.testUser;
    });
  });

  beforeEach(() => {
    cy.login(testUser.email, testUser.password);
    cy.visit('/create');
  });

  it('gère l\'upload d\'images', () => {
    cy.fixture('test-image.png', 'base64').then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName: 'test-image.png',
        mimeType: 'image/png',
        encoding: 'base64'
      });
    });

    cy.get('img[alt="Preview"]').should('have.attr', 'src');
    cy.get('button[type="button"]').first().click();
    cy.get('.relative.w-32').should('not.exist');
  });

  it('refuse les fichiers trop volumineux', () => {
    cy.fixture('large-image.jpg', 'base64').then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName: 'large-image.jpg',
        mimeType: 'image/jpeg',
        encoding: 'base64'
      });
    });

    cy.contains('Le fichier dépasse la taille maximale de 1 Mo.').should('be.visible');
  });

  it('valide le champ titre', () => {
    cy.get('input[formControlName="title"]').focus().blur();
    cy.contains('Ce champ est requis').should('be.visible');

    cy.get('input[formControlName="title"]').type('ab').blur();
    cy.contains('Minimum 3 caractères').should('be.visible');

    cy.get('input[formControlName="title"]').clear().type('Titre valide');
    cy.get('input[formControlName="title"]').should('not.have.class', 'border-red-500');
  });

  it('valide le champ description', () => {
    cy.get('textarea[formControlName="description"]').focus().blur();
    cy.contains('Ce champ est requis').should('be.visible');

    cy.get('textarea[formControlName="description"]').type('Court').blur();
    cy.contains('Minimum 10 caractères').should('be.visible');

    cy.get('textarea[formControlName="description"]').clear().type('Description valide et complète');
    cy.get('textarea[formControlName="description"]').should('not.have.class', 'border-red-500');
  });

  it('sélectionne une catégorie valide', () => {
    cy.get('select[formControlName="category"]').select('Sports');
    cy.get('select[formControlName="category"]').should('not.have.class', 'border-red-500');
  });

  it('sélectionne un état valide', () => {
    cy.get('select[formControlName="state"]').select('Neuf');
    cy.get('select[formControlName="state"]').should('not.have.class', 'border-red-500');
  });

  it('sélectionne une couleur valide', () => {
    cy.get('select[formControlName="color"]').select('Blanc');
    cy.get('select[formControlName="color"]').should('not.have.class', 'border-red-500');
  });

  it('sélectionne une matière valide', () => {
    cy.get('select[formControlName="material"]').select('Bois');
    cy.get('select[formControlName="material"]').should('not.have.class', 'border-red-500');
  });

  it('valide le champ code postal', () => {
    cy.get('input[formControlName="postalCode"]').type('75001');
    cy.get('input[formControlName="postalCode"]').should('not.have.class', 'border-red-500');
  });

  it('soumet le formulaire avec succès', () => {
    cy.get('input[formControlName="title"]').type('Titre de test');
    cy.get('textarea[formControlName="description"]').type('Description détaillée du test');
    cy.get('select[formControlName="category"]').select('Sports');
    cy.get('select[formControlName="state"]').select('Neuf');
    cy.get('select[formControlName="color"]').select('Blanc');
    cy.get('select[formControlName="material"]').select('Bois');
    cy.get('input[formControlName="postalCode"]').type('75001');

    cy.fixture('test-image.png', 'base64').then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName: 'test-image.png',
        mimeType: 'image/jpeg',
        encoding: 'base64'
      });
    });

    cy.get('app-button[type="submit"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('affiche les erreurs si le formulaire est vide', () => {
    cy.get('app-button[type="submit"]').click();

    ['title', 'description', 'category', 'state', 'color', 'material', 'postalCode'].forEach(field => {
      cy.get(`[formControlName="${field}"]`).focus().blur().should('have.class', 'border-red-500');
    });
  });
});
