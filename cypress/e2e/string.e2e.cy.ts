describe('Тестирование компонента <String />.', () => {
  beforeEach(() => {
    cy.visit('/recursion');
    cy.get('input[type="text"]').as('input');
    cy.get('button[type="submit"]').as('button');
  })
  it('Тестирование состояния disabled на кнопке, при пустом input', () => {
    cy.get('@input')
      .should('have.value', '');
    cy.get('@button')
      .should('be.disabled');
  });

  it('Тестирование корректного разворота строки с четным колличеством символов', () => {
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
      }
    }

    const string = 'привет';
    let array = string.split('');
    cy.get('@input')
      .type(string);
    cy.get('@button')
      .click();
    getFirstAndLastElement(array, 0, array.length - 1, '4px solid rgb(210, 82, 225)');
    animationCheck(array);
  })

  it('Тестирование корректного разворота строки с нечетным колличеством символов', () => {
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
        getFirstAndLastElement(arr, start, end, '4px solid rgb(127, 224, 81)');
      }
    }

    const string = 'кот';
    let array = string.split('');
    cy.get('@input')
      .type(string);
    cy.get('@button')
      .click();
    getFirstAndLastElement(array, 0, array.length - 1, '4px solid rgb(210, 82, 225)');
    animationCheck(array);
  })

  it('Тестирование корректного разворота строки с 1 символом', () => {
    const string = 'а';
    cy.get('@input')
      .type(string);
    cy.get('@button')
      .click();
    cy.get('.text_type_circle').contains(`а`).parent().as('solo')
      .should('have.css', 'border', '4px solid rgb(210, 82, 225)')
    cy.get('@solo').should('have.css', 'border', '4px solid rgb(127, 224, 81)');
  })
})