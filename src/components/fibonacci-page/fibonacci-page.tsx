import React, { useState } from "react";
import styles from './fibonacci-page.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { countNextFibonacciElement } from "./utils";

export const FibonacciPage: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [fibonacciArray, setFibonacciArray] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const delayFibonacci = 500;
  /* 
  Так как инпут возвращает только текстовые типы данных, создадим число из 
  текстовых данных через объект Number.
  */  
  const numberValue = Number(value);


  const tick = (arr: string[], start: number, buffer: number, next: number, count: number) => {
    const result = countNextFibonacciElement(arr, start, buffer, next, count)
    setFibonacciArray([...result.arr]);
    if (result.count < numberValue) {
      setTimeout(() => tick(result.arr, result.start, result.buffer, result.next, result.count), delayFibonacci);
    } else {
      setIsLoading(false);
    }
  }

  /* Эта функция отвечает за начало анимации создания последовательности Фибоначчи
  в зависимотси от колличества, которе задано значением в инпуте. */
  const startAnimation = (
      evt : React.SyntheticEvent, 
      start: number = 0, 
      next: number = 1, 
      buffer: number = start,
      count: number = 0,
      arr: string[] = ['1']) => {
        
    evt.preventDefault();
    setIsLoading(true);
    // Запишем массив в стейт.
    setFibonacciArray(arr);
    if (count < numberValue) {

      // Запустим отложенную функцию, в которой будет производится расчёт последовательности фиббоначи
      // и сравнение счётчика с введенным значением членов последовательности Фиббоначи.
      setTimeout(() => tick(arr, start, buffer, next, count), delayFibonacci);
    }
  }

  return (
    <SolutionLayout title="Последовательность Фибоначчи" isLoading={isLoading}>
      <form className={styles.container}>
        <Input state={value} setState={setValue} max={19} type="tel" isLimitText={true} />
        <Button 
          type="submit" 
          text="Рассчитать" 
          onClick={startAnimation} 
          disabled={
            numberValue < 0 || 
            numberValue > 19 || 
            !value.match(/^[0-9]+$/)} 
          isLoader={isLoading} 
        />
      </form>
      <div className={`${styles.container} ${styles.circles}`}>
        {fibonacciArray.map((number, index) => {
          return <Circle letter={number} key={index} index={index} />
        })}
      </div>
    </SolutionLayout>
  );
};
