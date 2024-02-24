import React, { useMemo, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import styles from './stack-page.module.css';
import { ElementStates } from "../../types/element-states";
import { Circle } from "../ui/circle/circle";
import { Stack } from "../../utils/stack";

type TStackElements = {
  element: string;
  state: ElementStates;
}

type TIsLoading = {
  add: boolean; 
  remove: boolean; 
  clear: boolean
}

export const StackPage: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<TIsLoading>({
    add: false,
    remove: false,
    clear: false
  });

  // Сам стек. 
  const stack = useMemo(() => new Stack<TStackElements>(), []);
  

  // Метод добавления в стек элементов с анимацией.
  const push = () => {
    setIsLoading({...isLoading, add: true});
    // Сам метод стека на добавление элемента. (Остальное ниже -  анимация)
    stack.push({element: value, state: ElementStates.Changing});
    setTimeout(() => {
      stack.elements[stack.size - 1] = {...stack.elements[stack.size - 1], state: ElementStates.Default};
      setIsLoading({...isLoading, add: false});
    }, 500);
  }


  // Метод удаления элемента из Стека с анимацией.
  const pop = () => {
    setIsLoading({...isLoading, remove: true});
    // Сам метод удаления Стека.
    stack.elements[stack.size - 1] = {...stack.elements[stack.size - 1], state: ElementStates.Changing};
    setTimeout(() => {
      stack.pop();
      setIsLoading({...isLoading, remove: false});
    }, 500);
  }


  // Метод обновления стека
  const clear = () => {
    setIsLoading({...isLoading, clear: true});
    // Сам метод удаления. Лоадеры нужны только для того, чтобы был быстрый перерендер и обновился Стек.
    stack.clear();
    setTimeout(() => {
      setIsLoading({...isLoading, clear: false});
    })
  }

  return (
    <SolutionLayout 
      title="Стек" 
      isLoading={isLoading.add === true || isLoading.remove === true ? true : false}
    >
      <div className={styles.container}>
        <Input 
          state={value} 
          setState={setValue} 
          maxLength={4} 
          isLimitText={true} 
          extraClass={styles.input} 
        />
        <Button 
          extraClass={styles.button} 
          isLoader={isLoading.add} 
          text="Добавить" 
          disabled={
            !value.match(/^[0-9]+$/) || 
            isLoading.remove} 
            onClick={push} 
        />
        <Button 
          extraClass={styles.button} 
          isLoader={isLoading.remove} 
          text="Удалить" 
          disabled={
            stack.size === 0 || 
            isLoading.add} 
            onClick={pop} 
        />
        <Button 
          extraClass={styles.button} 
          text="Очистить" 
          disabled={
            stack.size === 0 || 
            isLoading.add || 
            isLoading.remove} 
            onClick={clear} 
        />
      </div>
      <div className={styles.container}>
        {stack.elements.map((element, index) => {
          return <Circle 
            letter={element.element} 
            index={index} 
            key={index} 
            state={element.state} 
            head={stack.size - 1 === index ? 'top' : ''} />})}
      </div>
    </SolutionLayout>
  );
};
