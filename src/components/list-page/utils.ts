import { ElementStates } from "../../types/element-states";
import { LinkedListNode } from "../../utils/linked-list";

export type TElement = {
  element: string;
  state: ElementStates;
}

// метод создания случайного массива чисел. (ограничен от 3 до 6)
export const renderRandomArray = (): TElement[] => {
  const quantity = Math.floor(Math.random()*6);
  return Array.from({length: quantity < 3 ? 3 : quantity}, () => ({element: Math.floor(Math.random()*100).toString(), state: ElementStates.Default}));
}

export const showElementBeforeAddition = (i: number, prev: LinkedListNode<TElement> | null, curr: LinkedListNode<TElement> | null) => {
  if (i !== 0 && prev !== null) {
    prev.value = {...prev.value, state: ElementStates.Changing}; 
  }
  if (curr !== null && curr.next !== null) {
    prev = curr;
    curr = curr.next;
  }
  return {prev, curr};
}

export const showElementBeforeDelition = (i: number, prev: LinkedListNode<TElement> | null, curr: LinkedListNode<TElement> | null) => {
  console.log(curr);
  if (curr !== null) {
    curr.value = {...curr.value, state: ElementStates.Changing}; 
    prev = curr;
    curr = curr.next;
  }
  return {curr, prev}
}

export const makeDefaultState = (curr: LinkedListNode<TElement> | null, prev: LinkedListNode<TElement> | null) => {
  if (curr !== null) {
    curr.value = {...curr.value, state: ElementStates.Default};
  }
  while (curr !== null) {
    if (prev !== null) {
      prev.value = {...prev.value, state: ElementStates.Default}
      prev = curr;
      curr = curr.next;
    }
  }
}