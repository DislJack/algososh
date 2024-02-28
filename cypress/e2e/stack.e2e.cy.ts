describe('Тестирование страницы <Stack /> со структурой Stack', () => {
  beforeEach(() => {
    cy.visit('/stack');
    cy.get('button p').contains('Удалить').parent()
      .should('be.disabled');
    cy.get('button p').contains('Очистить').parent()
      .should('be.disabled');
    const clickToAddSeveralTimes = (numberOfClicks: number, index: number = 0, number: number = 5) => {
      if( numberOfClicks > index) {
        cy.get('input').clear().type(String(number));
        cy.get('button p').contains('Добавить').parent().click();
        cy.get('.text_type_circle').contains(String(number))
          .parent().should('have.css', 'border', '4px solid rgb(210, 82, 225)');
        cy.wait(500).then(() => {
          cy.get('.text_type_circle').contains(String(number))
            .parent().should('have.css', 'border', '4px solid rgb(0, 50, 255)');
          index++;
          number++;
          clickToAddSeveralTimes(numberOfClicks, index, number);
        })
      }
    }
    
    clickToAddSeveralTimes(2);
    cy.get('input').clear();
  })
  it('Тестирование состояние disabled для кнопки при пустом input', () => {
    cy.get('input').should('have.value', '');
    cy.get('button p').contains('Добавить').parent()
      .should('be.disabled');
  })

  it('Тестирование корректного добавления', () => {
    cy.get('input').type('234');
    cy.get('button p').contains('Добавить').parent().click();
    cy.get('.text_type_circle').contains('234')
      .parent().should('have.css', 'border', '4px solid rgb(210, 82, 225)');
    cy.wait(500).then(() => {
      cy.get('.text_type_circle').contains('234')
        .parent().should('have.css', 'border', '4px solid rgb(0, 50, 255)');
    })
  })

  it('Тестирование корректного удаления элементов из стека', () => {
    const clickToRemoveSeveralTimes = (numberOfClicks: number, index: number = 0) => {
      if (numberOfClicks > index) {
        cy.get('button p').contains('Удалить').parent().click();
        cy.get('.text_type_circle').last().parent().should('have.css', 'border', '4px solid rgb(210, 82, 225)')
        index++;
        cy.wait(500).then(() => clickToRemoveSeveralTimes(numberOfClicks, index))
      } else {
        return;
      }
    }
    clickToRemoveSeveralTimes(2);
  });

  it('Тестирование корректной очистки стека', () => {
    cy.get('input').clear();
    cy.get('button p').contains('Очистить').parent().click();
    cy.get('button p').contains('Добавить').parent().should('be.disabled');
    cy.get('.text_type_circle').should('not.exist');
  })
})