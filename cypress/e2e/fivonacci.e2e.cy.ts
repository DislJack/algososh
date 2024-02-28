describe('Тестирование страницы с последовательносью Фибоначчи', () => {
  beforeEach(() => {
    cy.visit('/fibonacci');
  })
  it('Тестирование заблокированной кнопки при пустом инпуте', () => {
    cy.get('input')
      .should('have.value', '');
    cy.get('button')
      .should('be.disabled');
  })

  it('Проверка корректного вывода чисел в последовательности Фибонвччи', () => {
    const number = 5;
    const FibonacciArray = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765];
    const findExistingFibonacciNumber = (index: number = 0) => {
      if (number > index) {
        index++;
        cy.get('.text_type_circle').last().contains(String(FibonacciArray[index])).should('exist');
        cy.wait(500).then(() => findExistingFibonacciNumber(index))
      }
    }
    cy.get('input').type(String(number));
    cy.get('button[type="submit"]').click();
    cy.get('.text_type_circle').contains('1').parent().should('exist');
    cy.wait(500).then(() => findExistingFibonacciNumber())
  })
})