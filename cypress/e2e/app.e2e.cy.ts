describe('Проверка запуска приложения', () => {
  it('проверяем что приложение поднялось', () => {
    cy.visit('/');
  });

  it('Проверка доступности роутинга', () => {
    cy.visit('/recursion');
    cy.visit('/fibonacci');
    cy.visit('/sorting');
    cy.visit('/stack');
    cy.visit('/queue');
    cy.visit('/list');
  })
})