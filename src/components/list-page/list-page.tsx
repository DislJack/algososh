import React, { useEffect, useState, useMemo } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from './list-page.module.css';
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { LinkedList } from "../../utils/linked-list";
import { ElementStates } from "../../types/element-states";
import { Circle } from "../ui/circle/circle";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { makeDefaultState, renderRandomArray, showElementBeforeAddition, showElementBeforeDelition, TElement } from "./utils";

type TIsLoading = {
  addToHead: boolean;
  addToTail: boolean;
  removeFromHead: boolean;
  removeFromTail: boolean;
  addByIndex: boolean;
  removeByIndex: boolean;
}


export const ListPage: React.FC = () => {
  // это стейты для инпутов
  const [value, setValue] = useState<string>('');
  const [index, setIndex] = useState<string>('');
  // Это стейт для добавляемого элемента на страницу по индексу, в начало и хвост.
  const [elementToAdd, setElementToAdd] = useState<TElement & {index?: number}>();
  // Стейт только для первичного рендера
  const [isRedered, setIsRedered] = useState<boolean>(false);
  // Это сам связанный список с методами.
  const linkedList = useMemo(() => new LinkedList<TElement>(), []);
  // Это массив, который можно вернуть в процессе обновления связанного списка.
  const arrayElements = linkedList.toArray();

  const linkedListDelay = 500;
  
  

  const [isLoading, setIsLoading] = useState<TIsLoading>({
    addToHead: false,
    addToTail: false,
    removeFromHead: false,
    removeFromTail: false,
    addByIndex: false,
    removeByIndex: false
  });

  // Собираем все boolean элементы, отвечающие за лоадеры в одну константу.
  const isLoadingBlock = 
  isLoading.addToHead || 
  isLoading.addToTail ||
  isLoading.removeFromHead ||
  isLoading.removeFromTail || 
  isLoading.addByIndex ||
  isLoading.removeByIndex;

  // Общая функция валидации, которая определяет валидность кнопок в зависимости от условия валидации.
  function validation(validationCondition: 'value' | 'zero-elements' | 'index') {
    switch(validationCondition) {
      case 'value': {
        return !value.match(/^[0-9]+$/) || isLoadingBlock;
      }
      case 'zero-elements': {
        return arrayElements.length === 0 || isLoadingBlock;
      }
      case 'index': {
        return !index.match(/^[0-9]+$/)  || Number(index) > arrayElements.length - 1 || isLoadingBlock;
      }
      default: return;
    }
  }


  // Функция которая описывает анимацию и добавление элемента в начало списка.
  const addToHead = () => {
    setIsLoading(prevState => {return {...prevState, addToHead: true}});
    let element: TElement & {index?: number} = {element: value, state: ElementStates.Changing, index: 0};
    setElementToAdd(element);
    setTimeout(() => {
      element = {element: value, state: ElementStates.Modified};
      // метод добавления елемента в начало списка 
      linkedList.prepend(element);
      setElementToAdd(undefined);
      setTimeout(() => {
        if (linkedList.head !== null) {
          linkedList.head.value = {...linkedList.head?.value, state: ElementStates.Default};
        }
        setIsLoading(prevState => {return {...prevState, addToHead: false}});
      }, linkedListDelay);
    }, linkedListDelay);
  }


  // Функция которая описывает анимацию и добавляет элемент в конец списка.
  const addToTail = () => {
    setIsLoading(prevState => {return {...prevState, addToTail: true}});
    let element: TElement & {index?: number} = {element: value, state: ElementStates.Changing, index: arrayElements.length - 1};
    setElementToAdd(element);
    setTimeout(() => {
      element = {element: value, state: ElementStates.Modified};
      // метод добавления в список в конец.
      linkedList.append(element);
      setElementToAdd(undefined);
      setTimeout(() => {
        if (linkedList.tail !== null) {
          linkedList.tail.value = {...linkedList.tail.value, state: ElementStates.Default};
        }
        setIsLoading(prevState => {return {...prevState, addToTail: false}});
      }, linkedListDelay);
    }, linkedListDelay)
  }


  // Удаления элемента из начала списка
  const removeFromHead = () => {
    setIsLoading(prevState => {return {...prevState, removeFromHead: true}});
    setElementToAdd({...arrayElements[0], state: ElementStates.Changing, index: 0});
    if (linkedList.head !== null) {
      linkedList.head.value = {...linkedList.head.value, element: ''};
    }
    setTimeout(() => {
      // метод удаления элемента из начала списка
      linkedList.deleteHead();
      setElementToAdd(undefined);
      setIsLoading(prevState => {return {...prevState, removeFromHead: false}});
    }, linkedListDelay);
  }


  // Функция удаления из хвоста с анимацией.
  const removeFromTail = () => {
    setIsLoading(prevState => {return {...prevState, removeFromTail: true}});
    setElementToAdd({...arrayElements[arrayElements.length - 1], state: ElementStates.Changing, index: arrayElements.length - 1});
    if (linkedList.tail !== null) {
      linkedList.tail.value = {...linkedList.tail.value, element: ''}
    }
    setTimeout(() => {
      // метод удаления элемента из начала списка
      linkedList.deleteTail();
      setElementToAdd(undefined);
      setIsLoading(prevState => {return {...prevState, removeFromTail: false}});
    }, linkedListDelay);
  }


  // Метод описывающий добавление в список элемента по индексу с анимацией.
  const addByIndex = () => {
    setIsLoading(prevState => {return {...prevState, addByIndex: true}});
    let element: TElement & {index?: number} = {element: value, state: ElementStates.Changing, index: Number(index)};
    let i = 0;
    function tick(prev = linkedList.head, curr = linkedList.head) {
      const result = showElementBeforeAddition(i, prev, curr);
      setElementToAdd({...element, index: i});
      if (Number(index) !== i) {
        i++;
        // Тут спрятана анимация
        setTimeout(() => tick(result.prev, result.curr), linkedListDelay);
      } else {
        setTimeout(() => {
          element = {element: value, state: ElementStates.Modified};
          // метод добавления элемента в по индексу
          linkedList.addByIndex(element, i);
          setElementToAdd(undefined);
          setTimeout(() => {
            makeDefaultState(linkedList.head, linkedList.head);
            setIsLoading(prevState => {return {...prevState, addByIndex: false}});
          }, linkedListDelay);
        }, linkedListDelay);
      }
    }
    tick();
  }


  // метод описывающий даления элемента по индексу с анимацией.
  const removeByIndex = () => {
    setIsLoading(prevState => {return {...prevState, removeByIndex: true}});
    let i = 0;
    function tick(curr = linkedList.head, prev = linkedList.head) {
      const result = showElementBeforeDelition(i, prev, curr);
      setElementToAdd({element: '', state: ElementStates.Default});
      setTimeout(() => {
        if (i !== Number(index)) {
          i++;
          // Анимация метода.
          setElementToAdd(undefined);
          setTimeout(() => tick(result.curr, result.prev), linkedListDelay);
        } else {
          if (result.prev !== null) {
            const deleteElement = {...result.prev.value, state: ElementStates.Changing, index: i}
            result.prev.value = {element: '', state: ElementStates.Default};
            setElementToAdd(deleteElement);
          } 
          setTimeout(() => {
            // метод удаления элемента списка по индексу
            makeDefaultState(linkedList.head, linkedList.head);
            linkedList.deleteByIndex(i);
            setElementToAdd(undefined);
            setIsLoading(prevState => {return {...prevState, removeByIndex: false}});
          }, linkedListDelay);
        }
      })
      
    }
    tick();
  }

  // Первичный рендер случайного списка.
  useEffect(() => {
    renderRandomArray().forEach(element => {
      linkedList.append(element);
    });
    // Эта часть нужна чтобы был перерендер связанного списка
    setIsRedered(true);
  }, [])

  return (
    <SolutionLayout title="Связный список" isLoading={isLoadingBlock}>
      <div className={styles.grid}>
        <Input extraClass={styles.value} value={value} setState={setValue} maxLength={4} isLimitText />
        <Button 
          type="button" 
          extraClass={styles.additionHead} 
          isLoader={isLoading.addToHead} 
          text="Добавить в head" 
          onClick={addToHead} 
          disabled={validation('value')} 
        />
        <Button 
          type="button" 
          extraClass={styles.additionTail} 
          isLoader={isLoading.addToTail} 
          text="Добавить в tail" 
          onClick={addToTail} 
          disabled={validation('value')} 
        />
        <Button 
          type="button" 
          extraClass={styles.removeHead} 
          isLoader={isLoading.removeFromHead} 
          text="Удалить из head" 
          onClick={removeFromHead} 
          disabled={validation('zero-elements')} 
        />
        <Button 
          type="button" 
          extraClass={styles.removeTail} 
          isLoader={isLoading.removeFromTail} 
          text="Удалить из tail" 
          onClick={removeFromTail} 
          disabled={validation('zero-elements')} 
        />
        <Input extraClass={styles.index} value={index} setState={setIndex} />
        <Button 
          type="button" 
          extraClass={styles.additionIndex} 
          text="Добавить по индексу" 
          onClick={addByIndex}
          isLoader={isLoading.addByIndex} 
          disabled={validation('index')} 
        />
        <Button 
          type="button" 
          extraClass={styles.removeIndex} 
          text="Удалить по индексу" 
          onClick={removeByIndex} 
          isLoader={isLoading.removeByIndex}
          disabled={validation('index')}
        />
      </div>
      <div className={styles.container}>
        {isRedered && linkedList.toArray().map((element, index) => {
          return (
          <div className={styles.circledArrow} key={index}>
            <Circle 
            letter={element.element}  
            index={index} 
            state={element.state} 
            head={elementToAdd?.index === index ? 
              <Circle isSmall letter={elementToAdd?.element} state={elementToAdd.state} /> : 
              ''} />
            {arrayElements.length - 1 === index ? '' : <ArrowIcon />}
          </div>)
        })}
      </div>
    </SolutionLayout>
  );
};
