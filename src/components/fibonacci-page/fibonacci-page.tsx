import React, { useState } from "react";
import styles from './fibonacci-page.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";

export const FibonacciPage: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [fibonacciArray, setFibonacciArray] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  /* 
  Так как инпут возвращает только текстовые типы данных, создадим число из 
  текстовых данных через объект Number.
  */  
  const numberValue = Number(value);

  /* Эта функция отвечает за начало анимации создания последовательности Фибоначчи
  в зависимотси от колличества, которе задано значением в инпуте. */
  const startAnimation = (evt : React.SyntheticEvent) => {
    evt.preventDefault();
    setIsLoading(true);

    // создадим начальные значения последовательности Фибоначчи.
    let start = 0;
    let next = 1;

    // Создадим буфферное хранилище для промежуточных данных.
    let buffer;

    // Создадим счетчик, который будет считать сколько членов последовательности уже добавлено.
    let count = 0;

    // Создадим начальный массив, который будет выводится для 0 значения тоже и в который будут добавляться новые
    // члены последовательности
    let arr = ['1'];

    // Запишем массив в стейт.
    setFibonacciArray(arr);
    if (count < numberValue) {

      // Запустим отложенную функцию, в которой будет производится расчёт последовательности фиббоначи
      // и сравнение счётчика с введенным значением членов последовательности Фиббоначи.
      setTimeout(function tick() {
      
        buffer = next;
        next += start;
        arr = [...arr, next.toString()];
        setFibonacciArray(arr);
        
        start = buffer;
        count++;

        if (count < numberValue) {
          setTimeout(tick, 500);
        } else {
          setIsLoading(false);
        }
      }, 500)
    }
  }

  return (
    <SolutionLayout title="Последовательность Фибоначчи" isLoading={isLoading}>
      <form className={styles.container}>
        <Input state={value} setState={setValue} max={19} type="tel" isLimitText={true} />
        <Button type="submit" text="Рассчитать" onClick={startAnimation} disabled={numberValue < 0 || numberValue > 19 || !value.match(/^[0-9]+$/) ? true : false} isLoader={isLoading} />
      </form>
      <div className={`${styles.container} ${styles.circles}`}>
        {fibonacciArray.map((number, index) => {
          return <Circle letter={number} key={index} index={index} />
        })}
      </div>
    </SolutionLayout>
  );
};
