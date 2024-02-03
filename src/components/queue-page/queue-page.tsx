import React, { useEffect, useState } from "react";
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

export const QueuePage: React.FC = () => {
  // Стейт на инпут.
  const [value, setValue] = useState<string>('');
  // Стейт на загрузку с блокировкой кнопок.
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Стейт для обновления класса очереди.
  const [queueElements, setQueueElements] = useState<TQueueElement[]>([]);
  // Стейт, который
  const [body, setBody] = useState<{head: number ; tail: number }>({head: 0, tail: 0});

  // Создание очереди из структуры.
  const queue = new Queue<TQueueElement>(queueElements, body.head, body.tail);


  // Метод описывающий добавление элемента в очередь с анимацией
  const enqueue = () => {
    setIsLoading(true);
    // Сам метод добавления в очередь.
    queue.enqueue({...queue.elements[queue.tail], state: ElementStates.Changing})
    setQueueElements([...queue.elements]);
    setTimeout(() => {
      queue.elements[queue.tail - 1] = {element: value, state: ElementStates.Default};
      setQueueElements([...queue.elements]);
      setValue('');
      if (queue.tail <= 7) {
        setBody({head: queue.head, tail: queue.tail});
      }
      setIsLoading(false);
    }, 500)
  }


  // Метод удаления элементов из очереди с анимацией.
  const dequeue = () => {
    setIsLoading(true);
    queue.elements[queue.head] = {...queue.elements[queue.head], state: ElementStates.Changing};
    setTimeout(() => {
      // Сам метод удаления из очереди.
      queue.dequeue();
      // Хитрые манипуляции, чтобы очередь была заполнена, но пустым элементом.
      queue.elements.unshift({element: '', state: ElementStates.Default});
      if (queue.head <= 6) {
        setBody({head: queue.head, tail: queue.tail});
      }
      setIsLoading(false);
    }, 500);
  }


  // Метод обновления очереди и заполения пустыми элементами.
  const clear = () => {
    queue.clear();
    setQueueElements([...queue.elements]);
    for (let i = 0; i < 7; i++) {
      queueElements[i] = {element: '', state: ElementStates.Default};
      setQueueElements([...queueElements]);
    }
    setBody({head: queue.head, tail: queue.tail});
  }

  useEffect(() => {
    clear();
  }, [])

  return (
    <SolutionLayout title="Очередь" isLoading={isLoading}>
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
          disabled={
            !value.match(/^[0-9]+$/) || 
            isLoading === true || 
            queue.tail - 1 === 6 ? true : false} 
          onClick={enqueue} 
        />
        <Button 
          extraClass={styles.button} 
          text="Удалить" 
          disabled={
            queueElements.length === 0 || 
            (queue.head === 6 && queue.elements[queue.head].element === '') || 
            isLoading === true || 
            queue.head > queue.tail - 1 ? true : false} 
          onClick={dequeue} 
        />
        <Button 
          extraClass={styles.button} 
          text="Очистить" 
          disabled={
            queue.isEmpty() === 0 || 
            isLoading === true ? true : false} 
          onClick={clear} 
        />
      </div>
      <div className={styles.container}>
        {queue.elements.map((element, index) => {
        return <Circle 
          letter={element.element} 
          index={index} 
          key={index} 
          state={element.state} 
          head={
            body.head === index && 
            element.element !== undefined ? 'head' : ''} 
          tail={
            queue.tail - 1 === index && 
            queueElements[body.tail - 1].element !== '' ? 'tail' : ''} 
        />})}
      </div>
    </SolutionLayout>
  );
};
