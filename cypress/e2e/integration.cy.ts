describe('Ventas - Prueba de integración', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/productos/obtenerDisponibles', {
      fixture: 'productos.json'
    }).as('getProductos');

    cy.visit('/cajero/ventas');
  });

  it('Debe mostrar productos correctamente al cargar la página', () => {
    cy.wait('@getProductos');

    // Asegúrate de que tu fixture productos.json tenga por ejemplo un producto "Café Moji"
    cy.contains('Café Moji').should('exist');
  });
});
