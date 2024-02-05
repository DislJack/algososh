import React, { useEffect, useMemo, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from './queuq-page.module.css';
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { ElementStates } from "../../types/element-states";
import { Circle } from "../ui/circle/circle";
import { Queue } from "../../utils/queue";

type TQueueElement = {
  element: string;
  state: ElementStates
}

type TIsLoading = {
  add: boolean;
  remove: boolean;
  clear: boolean;
}

export const QueuePage: React.FC = () => {
  // Стейт на инпут.
  const [value, setValue] = useState<string>('');
  // Стейт на загрузку с блокировкой кнопок.
  const [isLoading, setIsLoading] = useState<TIsLoading>({
    add: false,
    remove: false,
    clear: false
  });

  // Создание очереди из структуры.
  const queue = useMemo(() => new Queue<TQueueElement>(7), []);

  const queueDelay = 500;


  // Метод описывающий добавление элемента в очередь с анимацией
  const enqueue = () => {
    setIsLoading({...isLoading, add: true});
    // Сам метод добавления в очередь.
    queue.elements[queue.tail] = {...queue.elements[queue.tail], state: ElementStates.Changing};
    setTimeout(() => {
      queue.enqueue({element: value, state: ElementStates.Default})
      setValue('');
      setIsLoading({...isLoading, add: false});
    }, queueDelay)
  }


  // Метод удаления элементов из очереди с анимацией.
  const dequeue = () => {
    setIsLoading({...isLoading, remove: true});
    queue.elements[queue.head] = {...queue.elements[queue.head], state: ElementStates.Changing};
    setTimeout(() => {
      // Сам метод удаления из очереди.
      queue.dequeue();
      // Хитрые манипуляции, чтобы очередь была заполнена, но пустым элементом.
      queue.elements.unshift({element: '', state: ElementStates.Default});
      setIsLoading({...isLoading, remove: false});
    }, queueDelay);
  }


  // Метод обновления очереди и заполения пустыми элементами.
  const clear = () => {
    setIsLoading({...isLoading, clear: true})
    queue.clear();
    for (let i = 0; i < 7; i++) {
      queue.enqueue({element: '', state: ElementStates.Default});
    }
    queue.tail = 0;
    setIsLoading({...isLoading, clear: false});
  }

  useEffect(() => {
    clear();
  }, [])

  return (
    <SolutionLayout title="Очередь" isLoading={isLoading.add || isLoading.remove || isLoading.clear}>
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
          text="Добавить" 
          isLoader={isLoading.add}
          disabled={
            !value.match(/^[0-9]+$/) || 
            isLoading.remove || isLoading.clear || 
            queue.tail - 1 === 6 ? true : false} 
          onClick={enqueue} 
        />
        <Button 
          extraClass={styles.button} 
          text="Удалить" 
          disabled={
            isLoading.add || isLoading.clear || 
            queue.head > queue.tail - 1} 
          onClick={dequeue} 
        />
        <Button 
          extraClass={styles.button} 
          text="Очистить" 
          disabled={
            isLoading.add || isLoading.remove || queue.head > queue.tail - 1} 
          onClick={clear} 
        />
      </div>
      <div className={styles.container}>
        {queue.elements && queue.elements.map((element, index) => {
        return <Circle 
          letter={element.element} 
          index={index} 
          key={index} 
          state={element.state} 
          head={
            queue.head === index && 
            element.element !== '' ? 'head' : ''} 
          tail={
            queue.tail - 1 === index ? 'tail' : ''} 
        />})}
      </div>
    </SolutionLayout>
  );
};
