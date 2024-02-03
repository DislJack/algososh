import React, { useEffect, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from './list-page.module.css';
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { LinkedList } from "../../utils/linked-list";
import { ElementStates } from "../../types/element-states";
import { Circle } from "../ui/circle/circle";
import { ArrowIcon } from "../ui/icons/arrow-icon";

type TElement = {
  element: string;
  state: ElementStates;
}

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
  // Это стейт динамического массива списка (Нужен только для обновления стейта)
  const [elementsList, setElementsList] = useState<TElement[]>([]);
  // Это стейт для добавляемого элемента на страницу по индексу, в начало и хвост.
  const [elementToAdd, setElementToAdd] = useState<TElement & {index?: number}>();
  // Это сам связанный список с методами.
  const linkedList = new LinkedList<TElement>(elementsList);
  // Это массив, который можно вернуть в процессе обновления связанного списка.
  const arrayElements = linkedList.toArray();

  const [isLoading, setIsLoading] = useState<TIsLoading>({
    addToHead: false,
    addToTail: false,
    removeFromHead: false,
    removeFromTail: false,
    addByIndex: false,
    removeByIndex: false
  })


  // Функция которая описывает анимацию и добавление элемента в начало списка.
  const addToHead = () => {
    setIsLoading(prevState => {return {...prevState, addToHead: true}});
    let element: TElement & {index?: number} = {element: value, state: ElementStates.Changing, index: 0};
    setElementToAdd(element);
    setTimeout(() => {
      element = {element: value, state: ElementStates.Modified};
      // метод добавления елемента в начало списка 
      linkedList.prepend(element);
      setElementsList([...linkedList.toArray()]);
      setElementToAdd(undefined);
      setTimeout(() => {
        setElementsList(prevState => {
          prevState[0] = {...prevState[0], state: ElementStates.Default};
          return [...prevState];
        });
        setIsLoading(prevState => {return {...prevState, addToHead: false}});
      }, 500);
    }, 500);
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
      setElementsList([...linkedList.toArray()]);
      setElementToAdd(undefined);
      setTimeout(() => {
        setElementsList(prevState => {
          prevState[prevState.length - 1] = {...prevState[prevState.length - 1], state: ElementStates.Default};
          return [...prevState];
        });
        setIsLoading(prevState => {return {...prevState, addToTail: false}});
      }, 500);
    }, 500)
  }


  // Удаления элемента из начала списка
  const removeFromHead = () => {
    setIsLoading(prevState => {return {...prevState, removeFromHead: true}});
    setElementToAdd({...elementsList[0], state: ElementStates.Changing, index: 0});
    setElementsList(prevState => {
      prevState[0] = {...prevState[0], element: ''};
      return [...prevState];
    });
    setTimeout(() => {
      // метод удаления элемента из начала списка
      linkedList.deleteHead();
      setElementToAdd(undefined);
      setElementsList([...linkedList.toArray()]);
      setIsLoading(prevState => {return {...prevState, removeFromHead: false}});
    }, 500);
  }

  const removeFromTail = () => {
    setIsLoading(prevState => {return {...prevState, removeFromTail: true}});
    setElementToAdd({...elementsList[elementsList.length - 1], state: ElementStates.Changing, index: elementsList.length - 1});
    setElementsList(prevState => {
      prevState[prevState.length - 1] = {...prevState[prevState.length - 1], element: ''};
      return [...prevState];
    });
    setTimeout(() => {
      // метод удаления элемента из начала списка
      linkedList.deleteTail();
      setElementToAdd(undefined);
      setElementsList([...linkedList.toArray()]);
      setIsLoading(prevState => {return {...prevState, removeFromTail: false}});
    }, 500);
  }


  // Метод описывающий добавление в список элемента по индексу с анимацией.
  const addByIndex = () => {
    setIsLoading(prevState => {return {...prevState, addByIndex: true}});
    let element: TElement & {index?: number} = {element: value, state: ElementStates.Changing, index: Number(index)};
    let i = 0;
    function tick() {
      setElementToAdd({...element, index: i});
      if (Number(index) !== i) {
        i++;
        // Тут спрятана анимация
        setTimeout(tick, 500);
      } else {
        setTimeout(() => {
          element = {element: value, state: ElementStates.Modified};
          // метод добавления элемента в по индексу
          linkedList.addByIndex(element, i);
          setElementsList([...linkedList.toArray()]);
          setElementToAdd(undefined);
          setTimeout(() => {
            setElementsList(prevState => {
              prevState[i] = {...prevState[i], state: ElementStates.Default};
              return [...prevState];
            });
            setIsLoading(prevState => {return {...prevState, addByIndex: false}});
          }, 500);
        }, 500);
      }
    }
    tick();
  }


  // метод описывающий даления элемента по индексу с анимацией.
  const removeByIndex = () => {
    setIsLoading(prevState => {return {...prevState, removeByIndex: true}});
    let i = 0;
    function tick() {
      setElementsList(prevState => {
        prevState[i] = {...prevState[i], state: ElementStates.Changing};
        return [...prevState];
      });
      setTimeout(() => {
        if (i !== Number(index)) {
          i++;
          // Анимация метода.
          setTimeout(tick, 500);
        } else {
          setElementToAdd({...elementsList[i], state: ElementStates.Changing, index: i});
          setElementsList(prevState => {
            prevState[i] = {element: '', state: ElementStates.Default};
            return [...prevState];
          })
          setTimeout(() => {
            // метод удаления элемента списка по индексу
            linkedList.deleteByIndex(i);
            setElementsList([...linkedList.toArray()]);
            setElementToAdd(undefined);
            setIsLoading(prevState => {return {...prevState, removeByIndex: false}});
          }, 500);
        }
      })
      
    }
    tick();
  }

  // метод создания случайного массива чисел. (ограничен от 3 до 6)
  const renderRandomArray = () => {
    const quantity = Math.floor(Math.random()*6);
    const quantityNumbers = quantity < 3 ? 3 : quantity;
    const arr: TElement[] = [];
    for (let i = 0; i < quantityNumbers; i++) {
      arr.push({element: Math.floor(Math.random()*100).toString(), state: ElementStates.Default});
    }
    setElementsList([...arr]);
  }

  useEffect(() => {
    renderRandomArray();
  }, []);

  return (
    <SolutionLayout title="Связный список" 
      isLoading={
        isLoading.addToHead || 
        isLoading.addToTail ||
        isLoading.removeFromHead ||
        isLoading.removeFromTail || 
        isLoading.addByIndex ||
        isLoading.removeByIndex}>
      <div className={styles.grid}>
        <Input extraClass={styles.value} value={value} setState={setValue} maxLength={4} isLimitText />
        <Button 
          type="button" 
          extraClass={styles.additionHead} 
          isLoader={isLoading.addToHead} 
          text="Добавить в head" 
          onClick={addToHead} 
          disabled={
            !value.match(/^[0-9]+$/) || 
            isLoading.addToTail || 
            isLoading.removeFromHead || 
            isLoading.removeFromTail || 
            isLoading.addByIndex || 
            isLoading.removeByIndex} 
        />
        <Button 
          type="button" 
          extraClass={styles.additionTail} 
          isLoader={isLoading.addToTail} 
          text="Добавить в tail" 
          onClick={addToTail} 
          disabled={
            !value.match(/^[0-9]+$/) || 
            isLoading.addToHead || 
            isLoading.removeFromHead || 
            isLoading.removeFromTail || 
            isLoading.addByIndex || 
            isLoading.removeByIndex} 
        />
        <Button 
          type="button" 
          extraClass={styles.removeHead} 
          isLoader={isLoading.removeFromHead} 
          text="Удалить из head" 
          onClick={removeFromHead} 
          disabled={
            arrayElements.length === 0 || 
            isLoading.addToTail || 
            isLoading.addToHead || 
            isLoading.removeFromTail || 
            isLoading.addByIndex || 
            isLoading.removeByIndex} 
        />
        <Button 
          type="button" 
          extraClass={styles.removeTail} 
          isLoader={isLoading.removeFromTail} 
          text="Удалить из tail" 
          onClick={removeFromTail} 
          disabled={
            arrayElements.length === 0 || 
            isLoading.addToTail || 
            isLoading.removeFromHead || 
            isLoading.addToHead || 
            isLoading.addByIndex || 
            isLoading.removeByIndex} 
        />
        <Input extraClass={styles.index} value={index} setState={setIndex} />
        <Button 
          type="button" 
          extraClass={styles.additionIndex} 
          text="Добавить по индексу" 
          onClick={addByIndex}
          isLoader={isLoading.addByIndex} 
          disabled={
            !index.match(/^[0-9]+$/) || 
            isLoading.addToTail || 
            isLoading.removeFromHead || 
            isLoading.removeFromTail || 
            isLoading.addToHead || 
            isLoading.removeByIndex ||
            Number(index) > arrayElements.length - 1} 
        />
        <Button 
          type="button" 
          extraClass={styles.removeIndex} 
          text="Удалить по индексу" 
          onClick={removeByIndex} 
          isLoader={isLoading.removeByIndex}
          disabled={
            !index.match(/^[0-9]+$/) || 
            isLoading.addToTail || 
            isLoading.removeFromHead || 
            isLoading.removeFromTail || 
            isLoading.addByIndex || 
            isLoading.addToHead ||
            Number(index) > arrayElements.length - 1}
        />
      </div>
      <div className={styles.container}>
        {arrayElements.map((element, index) => {
          return (
          <div className={styles.circledArrow}>
            <Circle 
            letter={element.element} 
            key={index} 
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
