import React, { useState } from "react";
import styles from './string.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";

type TObjectLetters = {
  letter: string
  state: ElementStates
}

export const StringComponent: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [stringArray, setStringArray] = useState<TObjectLetters[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Эта функция либо ищет элементы, которые нужно поменять, подсвечивая их, либо меняет их местами.

  const findElementsToSwapOrSwap = (arr: TObjectLetters[], head: number, tail: number, changeType: 'changing' | 'modified'): void => {
    const buffer = arr[head].letter;
    arr[head] = {
      letter: arr[tail].letter,
      state: changeType === ElementStates.Changing ? ElementStates.Changing : ElementStates.Modified
    };
    arr[tail] = {
      letter: buffer,
      state: changeType === ElementStates.Changing ? ElementStates.Changing : ElementStates.Modified
    };
    setStringArray([...arr]);
  }

  /* 
  Эта функция сортирует массив обектов через равные интервалы в 1 секунду
  Если число элементов в массиве нечетное, тогда сортируются все пары и в конце подсвечивается 
  последний оставшийся элемент как отсортированный.
  Если число элементов -  четное, тогда просто сортируются все пары.
  В самом конце меняется флаг, отвечающий за блокировку всех кнопок на странице. */
  const sortArray = (arr: TObjectLetters[]): void => {
    if (arr.length <= 1) {
      return;
    }
    
    let head = 0;
    let tail = arr.length - 1;
    findElementsToSwapOrSwap(arr, head, tail, ElementStates.Changing);
    setTimeout(function tick() {
      findElementsToSwapOrSwap(arr, head, tail, ElementStates.Modified);
      head++;
      tail--;
      if (head === tail) {
        findElementsToSwapOrSwap(arr, head, tail, ElementStates.Modified);
      }
      if (head < tail) {
        findElementsToSwapOrSwap(arr, head, tail, ElementStates.Changing);
        setTimeout(tick, 1000);
      }
      if (head >= tail) {
        setIsLoading(false);
      }
    }, 1000);
  }

  // Эта функция отвечает за начало анимации сортировки с блокировкой кнопок.
  const startAnimation = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    setIsLoading(true);
    const obj = value.split('').map(letter => {
      return {
        letter: letter,
        state: ElementStates.Default
      }
    })
    setStringArray([...obj]);
    sortArray(obj);
  }

  return (
    <SolutionLayout title="Строка" isLoading={isLoading}>
      <form className={styles.container} onSubmit={startAnimation} >
        <Input maxLength={11} isLimitText={true} type="text" state={value} setState={setValue}/>
        <Button type="submit" text="Развернуть" isLoader={isLoading} disabled={!value.match(/^[A-Za-z-а-яА-ЯЁё]+$/) ? true : false} />
      </form>
      <div className={`${styles.container} ${styles.circles}`}>
        {stringArray.map((circle, index) => <Circle letter={circle.letter} key={index} state={circle.state}/>)}
      </div>
      
    </SolutionLayout>
  );
};
