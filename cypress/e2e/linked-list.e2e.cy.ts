describe('Тестирование связанного списка', () => {
  beforeEach(() => {
    cy.visit('/list');
    cy.get('input').first().as('firstInput');
    cy.get('input').last().as('lastInput');
    cy.get('button p').contains('Добавить в head').parent().as('addToHead');
    cy.get('button p').contains('Добавить в tail').parent().as('addToTail');
    cy.get('button p').contains('Добавить по индексу').parent().as('addByIndex');
    cy.get('button p').contains('Удалить по индексу').parent().as('removeByIndex');
    cy.get('button p').contains('Удалить из head').parent().as('removeFromHead');
    cy.get('button p').contains('Удалить из tail').parent().as('removeFromTail');

  })
  it('Тестирование состояния disabled у кнопок добавления и удаления элементов при пустом input', () => {
    cy.get('@firstInput').should('have.value', '');
    cy.get('@lastInput').last().should('have.value', '');
    cy.get('@addToHead').should('be.disabled');
    cy.get('@addToTail').should('be.disabled');
    cy.get('@addByIndex').should('be.disabled');
    cy.get('@removeByIndex').should('be.disabled');
  });

  it('Тестирование корректной отрисовки начального списка', () => {
    cy.get('.text_type_circle').parent().should('exist');
  });

  it('Тестирование добавление элемента в head', () => {
    const addSeveralElementsToHead = (numberOfClicks: number, index: number = 0, element: number = 101) => {
      if (numberOfClicks > index) {
        cy.get('@firstInput').clear().type(String(element));
        cy.get('@addToHead').click();
        cy.get('p.text_type_input').contains('0').prev().prev()
          .children().first().children().should('have.text', String(element));
        cy.wait(500).then(() => {
          cy.get('.text_type_circle').contains(String(element)).parent().should('have.css', 'border', '4px solid rgb(127, 224, 81)');
          cy.wait(500).then(() => {
            cy.get('.text_type_circle').contains(String(element)).parent().should('have.css', 'border', '4px solid rgb(0, 50, 255)');
            index++;
            element++;
            addSeveralElementsToHead(numberOfClicks, index, element);
          })
          
        })
      }
      
    }
    
    addSeveralElementsToHead(2);
    
  })

  it('Тестирование удаления элементов из head', () => {
    const removeSeveralElementsFromHead = (numberOfClicks: number, index: number = 0) => {
      if (numberOfClicks > index) {
        cy.get('@removeFromHead').click();
        // Попали в Head у Circle
        cy.get('p.text_type_input').contains('0').prev().prev()
          .children().first()  // Попали в новый circle в head
          .children().first().next().should('have.css', 'border', '4px solid rgb(210, 82, 225)'); //Проверили что сверху circle меняет цвет
        cy.wait(500).then(() => {
          cy.get('p.text_type_input').contains('0').prev().prev().should('have.text', '');
          index++;
          removeSeveralElementsFromHead(numberOfClicks, index);
        })
      }
    }
    removeSeveralElementsFromHead(2);
  })

  it('Тестирование добавление элемента в tail', () => {
    const addSeveralElementsToTail = (numberOfClicks: number, index: number = 0, element: number = 101) => {
      if (numberOfClicks > index) {
        cy.get('@firstInput').clear().type(String(element));
        cy.get('@addToTail').click();
        cy.get('p.text_type_input').last().prev().prev()
          .children().first().children().should('have.text', String(element));
        cy.wait(500).then(() => {
          cy.get('.text_type_circle').contains(String(element)).parent().should('have.css', 'border', '4px solid rgb(127, 224, 81)');
          cy.wait(500).then(() => {
            cy.get('.text_type_circle').contains(String(element)).parent().should('have.css', 'border', '4px solid rgb(0, 50, 255)');
            index++;
            element++;
            addSeveralElementsToTail(numberOfClicks, index, element);
          })
          
        })
      }
      
    }
    
    addSeveralElementsToTail(2);
    
  })

  it('Тестирование удаления элементов из tail', () => {
    const removeSeveralElementsFromTail = (numberOfClicks: number, index: number = 0) => {
      if (numberOfClicks > index) {
        cy.get('@removeFromTail').click();
        // Попали в Tail у Circle
        cy.get('p.text_type_input').last().prev().prev()
          .children().first()  // Попали в новый circle в tail
          .children().first().next().should('have.css', 'border', '4px solid rgb(210, 82, 225)'); //Проверили что сверху circle меняет цвет
        cy.wait(500).then(() => {
          cy.get('p.text_type_input').last().prev().prev().should('have.text', '');
          index++;
          removeSeveralElementsFromTail(numberOfClicks, index);
        })
      }
    }
    removeSeveralElementsFromTail(2);
  })

  it('Тестирование добавления элемента по индексу', () => {
    const moveElementToAdd = (index: number, step: number = 0) => {
      cy.get('p.text_type_input').contains(String(step)).prev().prev()
          .children().children().first().next().should('have.css', 'border', '4px solid rgb(210, 82, 225)')
      if (index !== step) {
        cy.wait(500).then(() => {
          cy.get('p.text_type_input').contains(String(step)).prev()
            .should('have.css', 'border', '4px solid rgb(210, 82, 225)')
          step++;
          moveElementToAdd(index, step);
        })
      } else {
        cy.wait(500).then(() => {
          cy.get('p.text_type_input').contains(String(step)).prev()
            .should('have.css', 'border', '4px solid rgb(127, 224, 81)')
            return;
        })
      }
    }
    
    const addElementByIndex = (index: number, element: number) => {
      cy.get('@firstInput').clear().type(String(element));
      cy.get('@lastInput').clear().type(String(index));
      cy.get('@addByIndex').click();
      moveElementToAdd(index);
    }
    
    addElementByIndex(2, 101);
    addElementByIndex(2, 102);
    
  })

  it('Тестирование удаления элементов из списка по индексу', () => {
    const moveElementToRemove = (index: number, step: number = 0) => {
      cy.get('p.text_type_input').contains(String(step)).prev().should('have.css', 'border', '4px solid rgb(210, 82, 225)');
      step++;
      if (index !== step) {
        cy.wait(500).then(() => {
          moveElementToRemove(index, step);
        });
      } else {
        cy.wait(500).then(() => {
          cy.get('p.text_type_input').contains(String(step)).prev().prev()
            .children().children().first().next().should('have.css', 'border', '4px solid rgb(210, 82, 225)')
        })
      }
    }
    const removeElementByIndex = (index: number) => {
      cy.get('@lastInput').clear().type(String(index));
      cy.get('@removeByIndex').click();
      moveElementToRemove(index);
    }
    removeElementByIndex(2);
    removeElementByIndex(1);
  })
})