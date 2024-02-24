describe('Тестирование связанного списка', () => {
  it('Тестирование состояния disabled у кнопок добавления и удаления элементов при пустом input', () => {
    cy.visit('/list');
    cy.get('input').first().should('have.value', '');
    cy.get('input').last().should('have.value', '');
    cy.get('button p').contains('Добавить в head').parent().should('be.disabled');
    cy.get('button p').contains('Добавить в tail').parent().should('be.disabled');
    cy.get('button p').contains('Добавить по индексу').parent().should('be.disabled');
    cy.get('button p').contains('Удалить по индексу').parent().should('be.disabled');
  });

  it('Тестирование корректной отрисовки начального списка', () => {
    cy.visit('/list');
    cy.get('.text_type_circle').parent().should('exist');
  });

  it('Тестирование добавление элемента в, и удаление элемента из head', () => {
    cy.visit('/list');
    const addSeveralElementsToHead = (numberOfClicks: number, index: number = 0, element: number = 101) => {
      if (numberOfClicks > index) {
        cy.get('input').first().clear().type(String(element));
        cy.get('button p').contains('Добавить в head').parent().click();
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
      } else {
        return;
      }
      
    }
    const removeSeveralElementsFromHead = (numberOfClicks: number, index: number = 0) => {
      if (numberOfClicks > index) {
        cy.get('button p').contains('Удалить из head').parent().click();
        // Попали в Head у Circle
        cy.get('p.text_type_input').contains('0').prev().prev()
          .children().first()  // Попали в новый circle в head
          .children().first().next().should('have.css', 'border', '4px solid rgb(210, 82, 225)'); //Проверили что сверху circle меняет цвет
        cy.wait(500).then(() => {
          cy.get('p.text_type_input').contains('0').prev().prev().should('have.text', '');
          index++;
          removeSeveralElementsFromHead(numberOfClicks, index);
        })
      } else {
        return;
      }
    }
    addSeveralElementsToHead(2);
    removeSeveralElementsFromHead(2);
  })

  it('Тестирование добавление элемента в, и удаление элемента из tail', () => {
    cy.visit('/list');
    const addSeveralElementsToTail = (numberOfClicks: number, index: number = 0, element: number = 101) => {
      if (numberOfClicks > index) {
        cy.get('input').first().clear().type(String(element));
        cy.get('button p').contains('Добавить в tail').parent().click();
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
      } else {
        return;
      }
      
    }
    const removeSeveralElementsFromTail = (numberOfClicks: number, index: number = 0) => {
      if (numberOfClicks > index) {
        cy.get('button p').contains('Удалить из tail').parent().click();
        // Попали в Tail у Circle
        cy.get('p.text_type_input').last().prev().prev()
          .children().first()  // Попали в новый circle в tail
          .children().first().next().should('have.css', 'border', '4px solid rgb(210, 82, 225)'); //Проверили что сверху circle меняет цвет
        cy.wait(500).then(() => {
          cy.get('p.text_type_input').last().prev().prev().should('have.text', '');
          index++;
          removeSeveralElementsFromTail(numberOfClicks, index);
        })
      } else {
        return;
      }
    }
    addSeveralElementsToTail(2);
    removeSeveralElementsFromTail(2);
  })

  it('Тестирование добавления и удаления элемента по индексу', () => {
    cy.visit('/list');
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
    const addElementByIndex = (index: number, element: number) => {
      cy.get('input').first().clear().type(String(element));
      cy.get('input').last().clear().type(String(index));
      cy.get('button p').contains('Добавить по индексу').parent().click();
      moveElementToAdd(index);
    }
    const removeElementByIndex = (index: number) => {
      cy.get('input').last().clear().type(String(index));
      cy.get('button p').contains('Удалить по индексу').parent().click();
      moveElementToRemove(index);
    }
    addElementByIndex(2, 101);
    addElementByIndex(2, 102);
    removeElementByIndex(3);
    removeElementByIndex(1);
  })
})