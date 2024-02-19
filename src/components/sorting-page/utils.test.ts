import { Direction } from "../../types/direction";
import { ElementStates } from "../../types/element-states";
import { bubbleSorting, choiceSorting, TColumn } from "./utils";

function sortWithBuble(
  arrNum: number[], 
  sortingDirection: Direction,
  begin: number = 0, 
  finish: number = arrNum.length - 1, 
  current: number = begin,
  nextElement: number = begin + 1 
  ) {
  let array: TColumn[] = arrNum.map(number => {return {size: number, state: ElementStates.Default}});
  while(finish > 0) {
    const {arr, start, end, curr, next} = bubbleSorting(array, begin, finish, current, nextElement, sortingDirection);
    array = arr;
    begin = start;
    finish = end;
    current = curr;
    nextElement = next;
  }

  return array.map(element => element.size);
}

function sortWithChoice(
  arrNum: number[],
  sortingDirection: Direction,
  begin: number = 0, 
  finish: number = arrNum.length - 1, 
  buff: number = begin,
  ind: number = begin + 1 
  ) {
    let array: TColumn[] = arrNum.map(number => {return {size: number, state: ElementStates.Default}});
    while(begin < finish) {
      const {arr, start, end, curr, next} = choiceSorting(array, begin, finish, buff, ind, sortingDirection);
      array = arr;
      begin = start;
      finish = end;
      buff = curr;
      ind = next;
    }

    return array.map(element => element.size);
}

describe('Тестирование алгоритмов сортировки', () => {
  describe('Тестирование алгоритма пузырьком', () => {
    it('по возрастанию', () => {
      const array = sortWithBuble([80, 102, 60, 35, 106], Direction.Ascending);
      expect(array).toEqual([35, 60, 80, 102, 106]);
    });

    it('По убыванию', () => {
      const array = sortWithBuble([80, 102, 60, 35, 106], Direction.Descending);
      expect(array).toEqual([106, 102, 80, 60, 35]);
    });

    it('Тестирование массива с 1 элементом', () => {
      const array = sortWithBuble([50], Direction.Ascending);
      expect(array).toEqual([50]);
    });

    it('Тестирование пустого массива', () => {
      const array = sortWithBuble([], Direction.Ascending);
      expect(array).toEqual([]);
    })
  });

  describe('Тестирование алгоритма выбором', () => {
    it('По возрастанию', () => {
      const array = sortWithChoice([28, 36, 12, 80, 60], Direction.Ascending);
      expect(array).toEqual([12, 28, 36, 60, 80]);
    })

    it('По убыванию', () => {
      const array = sortWithChoice([28, 36, 12, 80, 60], Direction.Descending)
      expect(array).toEqual([80, 60, 36, 28, 12]);
    })

    it('Тестирование массива с 1 элементом', () => {
      const array = sortWithChoice([50], Direction.Ascending);
      expect(array).toEqual([50]);
    })

    it('Тестирование пустого массива', () => {
      const array = sortWithChoice([], Direction.Ascending);
      expect(array).toEqual([]);
    })
  })
})