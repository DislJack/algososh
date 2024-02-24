describe('Тестирование страницы с последовательносью Фибоначчи', () => {
  it('Тестирование заблокированной кнопки при пустом инпуте', () => {
    cy.visit('/fibonacci')
    cy.get('input')
      .should('have.value', '');
    cy.get('button')
      .should('be.disabled');
  })

  it('Проверка корректного вывода чисел в последовательности Фибонвччи', () => {
    cy.visit('/fibonacci');
    const number = 5;
    const calculateFibonacci = (prev: number = 0, next: number = 1, index: number = 1) => {
      if (number >= index) {
        const buffer = prev;
        prev = next;
        next += buffer;
        index++;
        cy.get('.text_type_circle').contains(String(next)).should('exist');
        cy.wait(500).then(() => calculateFibonacci(prev, next, index))
      } else {
        return;
      }
    }
    cy.get('input').type(String(number));
    cy.get('button[type="submit"]').click();
    cy.get('.text_type_circle').contains('1').should('exist');
    cy.wait(500).then(() => calculateFibonacci())
  })
})