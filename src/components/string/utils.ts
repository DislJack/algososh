import { ElementStates } from "../../types/element-states";

// Тип для элементов
export type TObjectLetters = {
  letter: string
  state: ElementStates
}


// Эта функция либо ищет элементы, которые нужно поменять, подсвечивая их, либо меняет их местами.
export const findElementsToSwapOrSwap = (arr: TObjectLetters[], head: number, tail: number, changeType: 'changing' | 'modified'): TObjectLetters[] => {
  if (changeType === ElementStates.Changing) {
    arr[head] = {...arr[head], state: ElementStates.Changing};
    arr[tail] = {...arr[tail], state: ElementStates.Changing};
  } else {
    const buffer = arr[head].letter;
    arr[head] = {
      letter: arr[tail].letter,
      state: ElementStates.Modified
    };
    arr[tail] = {
      letter: buffer,
      state: ElementStates.Modified
    };
  }
  
  return [...arr];
}