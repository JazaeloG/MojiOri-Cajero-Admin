describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.intercept('GET', '**/productos/obtenerDisponibles', {
      fixture: 'productos.json'
    }).as('getProductos');
  });

  it('Debería iniciar sesión exitosamente con credenciales válidas', () => {
    cy.get('ion-input#cuenta_Telefono')
      .shadowFind('input')
      .type('2790000000');

    cy.get('ion-input#cuenta_Contrasena')
      .shadowFind('input')
      .type('12345678');

    cy.get('ion-button#btn').click();

    cy.url().should('include', '/cajero/ventas');

    cy.contains('Ventas').should('exist');
    cy.visit('/cajero/ventas');

    cy.wait('@getProductos');
    cy.contains('Café Moji').should('exist');
  });

  it('Debería mostrar error con credenciales inválidas', () => {
    cy.visit('/login');

    cy.get('ion-input#cuenta_Telefono')
      .shadowFind('input')
      .type('1111111111');

    cy.get('ion-input#cuenta_Contrasena')
      .shadowFind('input')
      .type('contrasenaIncorrecta');

    cy.get('ion-button#btn').click();

    cy.get('ion-toast', { timeout: 5000 }).should('exist').then(($toast) => {
      cy.wrap($toast)
        .shadowFind('.toast-message')
        .should('contain.text', 'Credenciales Invalidas. Verifique e intente nuevamente.');
    });
  });

});
