import React, { useEffect, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from './sorting-page.module.css';
import { Direction } from "../../types/direction";
import { Button } from "../ui/button/button";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Column } from "../ui/column/column";
import { ElementStates } from "../../types/element-states";
import { bubbleSorting, choiceSorting, randomArr, TColumn } from "./utils";

type TCheckedInputs = {
  first: boolean; 
  second: boolean;
}

export const SortingPage: React.FC = () => {
  const [checkedInputs, setCheckedInputs] = useState<TCheckedInputs>({
    first: true,
    second: false
  });
  const [columnArray, setColumnArray] = useState<TColumn[]>([]);
  const [isLoading, setIsLoading] = useState({
    descending: false,
    ascending: false
  });
  const sortingDelay = 1000;

  
  // Функция описывающая анимацию процесса рендеринга
  function tick(arr: TColumn[], start: number, end = arr.length - 1, curr: number, next: number, sortingDir: Direction, sortingType: 'bubble' | 'choice') {

    // Смотрим какой тип сортировки у нас и вызываем соответсвующую функцию.
    const sortingResult = sortingType === 'bubble' ? 
      bubbleSorting(arr, start, end, curr, next, sortingDir) :
      choiceSorting(arr, start, end, curr, next, sortingDir);
    // Сохраняем полученные значения в стейт.
    setColumnArray([...sortingResult.arr]);

    // Проверяем, дошли ли мы до конца. Если нет, то запускаем снова функцию
    if (sortingResult.start < sortingResult.end) {
      // Зацикливание анимацию с условием выхода.
      setTimeout(() => {tick(
        sortingResult.arr, 
        sortingResult.start, 
        sortingResult.end, 
        sortingResult.curr, 
        sortingResult.next,
        sortingDir,
        sortingType)
      }, sortingDelay);
    } else {
      setIsLoading({ascending: false, descending: false});
    }
  }


  // Функция сортировки Выбором
  const startChoiceSorting = (arr: TColumn[], sortingRule: Direction): void => {
    // Входные данные размера сортировки и индексы.
    let start = 0;
    let end = arr.length - 1;
    let index = start + 1;
    let buffer = start;
    
    // Первичная анимация
    arr[start] = {...arr[start], state: ElementStates.Changing};
    arr[index] = {...arr[index], state: ElementStates.Changing};
    setColumnArray([...arr]);

    // Гиганская функция описывающая весь процесс анимации
    setTimeout(() => tick(arr, start, end, buffer, index, sortingRule, 'choice'), sortingDelay);
  }


  // Функция сортировки пузырьком (начальные значения теперь в параметрах функции)
  const startBubbleSorting = (
    arr: TColumn[], 
    sortingType: Direction, 
    end: number = arr.length - 1,
    start: number = 0, 
    curr: number = start, 
    next:number = start + 1) => {

      // Тут анимация первичная
      arr[curr] = {...arr[curr], state: ElementStates.Changing};
      arr[next] = {...arr[next], state: ElementStates.Changing};
      setColumnArray([...arr]);

      // Анимация процесса.
      setTimeout(() => {tick(arr, start, end, curr, next, sortingType, 'bubble')
    }, sortingDelay);
  }


  // Функция запускающая сортировку в зависимости от типа сортировки и направления
  const startSort = (sortingType: Direction): void => {
    sortingType === 'ascending' ? 
      setIsLoading({...isLoading, ascending: true}) : 
      setIsLoading({...isLoading, descending: true});
    let arr = [...columnArray];
    for (let i = 0; i < columnArray.length; i++) {
      arr[i] = {...arr[i], state: ElementStates.Default};
    };
    setColumnArray([...arr]);
    if (checkedInputs.first === true) {
      startChoiceSorting(arr, sortingType);
    } else {
      startBubbleSorting(arr, sortingType);
    }
  }


  useEffect(() => {
    setColumnArray(randomArr());
  }, []);

  
  return (
    <SolutionLayout 
      title="Сортировка массива" 
      isLoading={
        isLoading.ascending || 
        isLoading.descending}
    >
      <form className={styles.form}>
        <fieldset className={styles.choices}>
          <RadioInput 
            label='Выбор' 
            checked={checkedInputs.first} 
            onChange={() => setCheckedInputs({first: true, second: false})} />
          <RadioInput 
            label="Пузырёк" 
            checked={checkedInputs.second} 
            onChange={() => setCheckedInputs({first: false, second: true})} />
        </fieldset>
        <Button 
          text='По возрастанию' 
          sorting={Direction.Ascending} 
          isLoader={isLoading.ascending} 
          extraClass={styles.button} 
          disabled={isLoading.descending} 
          type="button" onClick={() => startSort(Direction.Ascending)} 
        />
        <Button 
          text="По убыванию" 
          sorting={Direction.Descending} 
          isLoader={isLoading.descending} 
          extraClass={styles.button} 
          disabled={isLoading.ascending} 
          type="button" onClick={() => startSort(Direction.Descending)} 
        />
        <Button 
          text="Новый массив" 
          extraClass={styles.button} 
          type="button" onClick={() => setColumnArray(randomArr)} 
          disabled={
            isLoading.ascending || 
            isLoading.descending} 
        />
      </form>
      <div className={styles.columns}>
        {columnArray.map((column, index) => <Column index={column.size} key={index} state={column.state} />)}
      </div>
    </SolutionLayout>
  );
};
