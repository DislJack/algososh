describe('Тестирование компонента <Queue /> и его структуры данных', () => {
  it('Тестирование состояния кнопки disabled при пустом инпуте', () => {
    cy.visit('/queue');
    cy.get('input').should('have.value', '');
    cy.get('button p').contains('Добавить').parent().should('be.disabled');
  })

  it('Тестирование заполнения очереди, удаления из очереди и очистки очереди', () => {
    cy.visit('/queue');
    const clickToAddSeveralTimes = (numberOfClicks: number, index: number = 0, number: number = 5) => {
      if( numberOfClicks > index) {
        cy.get('input').clear().type(String(number));
        cy.get('button p').contains('Добавить').parent().click();
        cy.get('p.text_type_input').contains(String(index)).prev()
          .should('have.css', 'border', '4px solid rgb(210, 82, 225)');
        cy.wait(500).then(() => {
          cy.get('.text_type_circle').contains(String(number))
            .parent().should('have.css', 'border', '4px solid rgb(0, 50, 255)');
          if (index === 0) {
            cy.get('.text_type_circle').contains(String(number)).parent().prev().should('have.text', 'head');
          }
          cy.get('.text_type_circle').contains(String(number)).parent().next().next().should('have.text', 'tail');
          index++;
          number++;
          clickToAddSeveralTimes(numberOfClicks, index, number);
        })
      } else {
        return;
      }
    }
    const clickToRemoveSeveralTimes = (numberOfClicks: number, index: number = 0) => {
      if (numberOfClicks > index) {
        cy.get('button p').contains('Удалить').parent().click();
        cy.get('p.text_type_input').contains(String(index)).prev().should('have.css', 'border', '4px solid rgb(210, 82, 225)')
        
        cy.wait(500).then(() => {
          cy.get('p.text_type_input').contains(String(index)).prev().should('have.css', 'border', '4px solid rgb(0, 50, 255)')
          index++;
          cy.get('p.text_type_input').contains(String(index)).prev().prev().should('have.text', 'head');
          clickToRemoveSeveralTimes(numberOfClicks, index);
        })
      } else {
        return;
      }
    }
    clickToAddSeveralTimes(4);
    clickToRemoveSeveralTimes(2);
    cy.get('button p').contains('Очистить').parent().click();
    cy.get('.text_type_circle').should('have.text', '');
  })
})