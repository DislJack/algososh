describe('Тестирование компонента <String />.', () => {
  it('Тестирование состояния disabled на кнопке, при пустом input', () => {
    cy.visit('/recursion');
    cy.get('input[type="text"]')
      .should('have.value', '');
    cy.get('button[type="submit"]')
      .should('be.disabled');
  });

  it('Тестирование корректного разворота строки', () => {
    cy.visit('/recursion');
    const getFirstAndLastElement = (arr: string[], start: number, end: number, result: string) => {
      cy.get('.text_type_circle').contains(`${arr[start]}`).parent()
        .should('have.css', 'border', result);
      cy.get('.text_type_circle').contains(`${arr[end]}`).parent()
        .should('have.css', 'border', result);
    }
    const animationCheck = (arr: string[], start: number = 0, end = arr.length - 1) => {
      getFirstAndLastElement(arr, start, end, '4px solid rgb(127, 224, 81)');
      start++;
      end--;
      if (start < end) {
        getFirstAndLastElement(arr, start, end, '4px solid rgb(210, 82, 225)');
        cy.wait(1000).then(() => {
          animationCheck(arr, start, end);
        })
      } else {
        return;
      }
    }

    const string = 'привет';
    let array = string.split('');
    cy.get('input[type="text"]')
      .type(string);
    cy.get('button[type="submit"]')
      .click();
    getFirstAndLastElement(array, 0, array.length - 1, '4px solid rgb(210, 82, 225)');
    animationCheck(array);
  })
})