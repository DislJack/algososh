import React, { useState } from "react";
import styles from './string.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { findElementsToSwapOrSwap, TObjectLetters } from './utils';

export const StringComponent: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [stringArray, setStringArray] = useState<TObjectLetters[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const delayString = 1000;

  // tick функция описывает всю анимацию
  const tick = (arr: TObjectLetters[], head: number, tail: number) => {
    arr = findElementsToSwapOrSwap(arr, head, tail, ElementStates.Modified)
    setStringArray([...arr]);
    head++;
    tail--;
    if (head < tail) {
      arr = findElementsToSwapOrSwap(arr, head, tail, ElementStates.Changing)
      setStringArray([...arr]);
      setTimeout(() => tick(arr, head, tail), delayString);
    } else if (head === tail) {
      arr = findElementsToSwapOrSwap(arr, head, tail, ElementStates.Modified)
      setStringArray([...arr]);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }

  /* 
  Эта функция сортирует массив обектов через равные интервалы в 1 секунду
  Если число элементов в массиве нечетное, тогда сортируются все пары и в конце подсвечивается 
  последний оставшийся элемент как отсортированный.
  Если число элементов -  четное, тогда просто сортируются все пары.
  В самом конце меняется флаг, отвечающий за блокировку всех кнопок на странице. */
  const sortArray = (arr: TObjectLetters[], head: number = 0, tail: number = arr.length - 1): void => {
    if (arr.length <= 1) {
      return;
    }
    arr = findElementsToSwapOrSwap(arr, head, tail, ElementStates.Changing);
    setStringArray([...arr]);
    setTimeout(() => tick(arr, head, tail), delayString);
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
        <Button 
          type="submit" 
          text="Развернуть" 
          isLoader={isLoading} 
          disabled={!value.match(/^[A-Za-z-а-яА-ЯЁё]+$/)} 
        />
      </form>
      <div className={`${styles.container} ${styles.circles}`}>
        {stringArray.map((circle, index) => <Circle letter={circle.letter} key={index} state={circle.state}/>)}
      </div>
      
    </SolutionLayout>
  );
};
