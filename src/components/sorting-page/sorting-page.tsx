import React, { useEffect, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from './sorting-page.module.css';
import { Direction } from "../../types/direction";
import { Button } from "../ui/button/button";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Column } from "../ui/column/column";
import { ElementStates } from "../../types/element-states";

type TColumn = {
  size: number; 
  state: ElementStates;
}

export const SortingPage: React.FC = () => {
  const [checkedInputs, setCheckedInputs] = useState<{first: boolean; second: boolean;}>({
    first: true,
    second: false
  });
  const [columnArray, setColumnArray] = useState<TColumn[]>([]);
  const [isLoading, setIsLoading] = useState({
    descending: false,
    ascending: false
  })

  // Функция создания случайного массива чисел.
  const randomArr = () => {
    let columnNumber = Math.floor(Math.random()*17);
    if (columnNumber < 3) {
      columnNumber = 3;
    }
    let arr: TColumn[] = []
    for (let i = 0; i < columnNumber; i++) {
      arr = [...arr, {size: Math.floor(Math.random()*100), state: ElementStates.Default}];
    }
    setColumnArray(arr);
  }

  // Функция сортировки Выбором
  const startChoiceSorting = (arr: TColumn[], sortingRule: Direction): void => {
    // Входные данные размера сортировки и индексы.
    let start = 0;
    let end = columnArray.length - 1;
    let index = start + 1;
    let buffer = start;
    
    // Первичная анимация
    arr[start] = {...arr[start], state: ElementStates.Changing};
    arr[index] = {...arr[index], state: ElementStates.Changing};
    setColumnArray([...arr]);

    // Гиганская функция описывающая весь процесс анимации
    setTimeout(function tick() {
      if (sortingRule === Direction.Ascending ? 
        arr[buffer].size > arr[index].size : 
        arr[buffer].size < arr[index].size) 
        {
          buffer = index;
      }
      arr[index] = {...arr[index], state: ElementStates.Default};
      index++;
      if (index <= end) {
        arr[index] = {...arr[index], state: ElementStates.Changing};
      } else {
        if (buffer !== start) {
          const memory = arr[start];
          arr[start] = {...arr[buffer], state: ElementStates.Modified};
          arr[buffer] = {...memory, state: ElementStates.Default};
        } else {
          arr[start] = {...arr[start], state: ElementStates.Modified};
        }
        start++;
        buffer = start;
        index = start + 1;
        if (index <= end) {
          arr[start] = {...arr[start], state: ElementStates.Changing};
          arr[index] = {...arr[index], state: ElementStates.Changing};
        } else {
          arr[start] = {...arr[start], state: ElementStates.Modified};
        }
      }
      setColumnArray([...arr]);
      
      // Условие повторения анимации и условие выхода из анимации.
      if (start < end) {
        setTimeout(tick, 1000);
      } else {
        setIsLoading({ascending: false, descending: false});
      }
    }, 1000);
  }

  // Функция сортировки пузырьком
  const startBubbleSorting = (arr: TColumn[], sortingType: Direction) => {
    // Это нужно для того чтобы потом перезаписывать значения.
    let start = 0;
    let end = arr.length - 1;
    let curr = start;
    let next = start + 1;

    // Тут анимация первичная
    arr[curr] = {...arr[curr], state: ElementStates.Changing};
    arr[next] = {...arr[next], state: ElementStates.Changing};
    setColumnArray([...arr]);

    // Гиганская функция описывающая анимацию всего процесса.
    setTimeout(function tick() {
      if (sortingType === Direction.Ascending ? 
        arr[curr].size > arr[next].size : 
        arr[curr].size < arr[next].size) 
        {
          const buffer = arr[curr];
          arr[curr] = arr[next];
          arr[next] = buffer;
      }
      arr[curr] = {...arr[curr], state: ElementStates.Default};
      curr++;
      next++;
      if (next <= end) {
        arr[next] = {...arr[next], state: ElementStates.Changing};
      } else {
        arr[curr] = {...arr[curr], state: ElementStates.Modified};
        curr = start;
        next = start + 1;
        end--;
        if (curr !== end) {
          arr[curr] = {...arr[curr], state: ElementStates.Changing};
          arr[next] = {...arr[next], state: ElementStates.Changing};
        } else {
          arr[curr] = {...arr[curr], state: ElementStates.Modified};
        }
      }
      setColumnArray([...arr]);

      if (start < end) {
        // Зацикливание анимации с условием выхода.
        setTimeout(tick, 1000);
      } else {
        setIsLoading({ascending: false, descending: false});
      }
    }, 1000);
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
    randomArr();
  }, []);

  return (
    <SolutionLayout 
      title="Сортировка массива" 
      isLoading={
        isLoading.ascending === true || 
        isLoading.descending === true ? true : false}
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
          disabled={isLoading.descending === true ? true : false} 
          type="button" onClick={() => startSort(Direction.Ascending)} 
        />
        <Button 
          text="По убыванию" 
          sorting={Direction.Descending} 
          isLoader={isLoading.descending} 
          extraClass={styles.button} 
          disabled={isLoading.ascending === true ? true : false} 
          type="button" onClick={() => startSort(Direction.Descending)} 
        />
        <Button 
          text="Новый массив" 
          extraClass={styles.button} 
          type="button" onClick={randomArr} 
          disabled={
            isLoading.ascending === true || 
            isLoading.descending === true ? true : false} 
        />
      </form>
      <div className={styles.columns}>
        {columnArray.map((column, index) => <Column index={column.size} key={index} state={column.state} />)}
      </div>
    </SolutionLayout>
  );
};
