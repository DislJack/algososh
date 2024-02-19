import { ElementStates } from "../../types/element-states";
import { TObjectLetters, findElementsToSwapOrSwap } from "./utils";

function sortArray(arr: string[], start: number = 0, end: number = arr.length - 1) {
  let array: TObjectLetters[] = arr.map(letter => {return {letter: letter, state: ElementStates.Default}});
  while(start < end) {
    if (start < end) {
      array = findElementsToSwapOrSwap(array, start, end, ElementStates.Modified);
      start++;
      end--;
    }
  }

  return array.map(element => element.letter);
}

describe('Тестирование алгоритма разворота строки', () => {
  it('Тестирование разворота с чётным колличеством символов', () => {
    const array = sortArray(['к', 'о', 'г', 'о', 'т', 'ь']);
    expect(array).toEqual(['ь', 'т', 'о', 'г', 'о', 'к']);
  });

  it('Тестирование разворота с нечётным колличеством символов', () => {
    const array = sortArray(['к', 'о', 'ш', 'к', 'а']);
    expect(array).toEqual(['а', 'к', 'ш', 'о', 'к']);
  });

  it('Тестирование разворота с 1 символом', () => {
    const array = sortArray(['А']);
    expect(array).toEqual(['А']);
  });

  it('Тестирование разворота с пустым массивом', () => {
    const array = sortArray([]);
    expect(array).toEqual([]);
  })
})