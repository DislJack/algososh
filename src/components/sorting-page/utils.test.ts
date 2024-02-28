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
    describe('По возрастанию', () => {
      it('С нечётным колличеством символов', () => {
        const array = sortWithBuble([80, 102, 60, 35, 106], Direction.Ascending);
        expect(array).toEqual([35, 60, 80, 102, 106]);
      });

      it('С чётным колличеством символов', () => {
        const array = sortWithBuble([80, 102, 60, 68, 35, 106], Direction.Ascending);
        expect(array).toEqual([35, 60, 68, 80, 102, 106]);
      });

      it('С повторяющимися элементами', () => {
        const array = sortWithBuble([80, 102, 60, 60, 35, 106], Direction.Ascending);
        expect(array).toEqual([35, 60, 60, 80, 102, 106]);
      });

      it('С отрицательными числами', () => {
        const array = sortWithBuble([80, 102, 60, -68, 35, 106], Direction.Ascending);
        expect(array).toEqual([-68, 35, 60, 80, 102, 106]);
      });

      it('Уже отсортированный массив', () => {
        const array = sortWithBuble([35, 36, 60, 68, 69], Direction.Ascending);
        expect(array).toEqual([35, 36, 60, 68, 69]);
      });

      it('Тестирование массива с 1 элементом', () => {
        const array = sortWithBuble([50], Direction.Ascending);
        expect(array).toEqual([50]);
      });
  
      it('Тестирование пустого массива', () => {
        const array = sortWithBuble([], Direction.Ascending);
        expect(array).toEqual([]);
      })
    })

    describe('По убыванию', () => {
      it('С нечетным колличеством элементов', () => {
        const array = sortWithBuble([80, 102, 60, 35, 106], Direction.Descending);
        expect(array).toEqual([106, 102, 80, 60, 35]);
      });

      it('С четным колличеством элементов', () => {
        const array = sortWithBuble([80, 102, 60, 68, 35, 106], Direction.Descending);
        expect(array).toEqual([106, 102, 80, 68, 60, 35]);
      });

      it('С повторяющимися элементами', () => {
        const array = sortWithBuble([80, 102, 60, 60, 35, 106], Direction.Descending);
        expect(array).toEqual([106, 102, 80, 60, 60, 35]);
      });

      it('С отрицательными значениями', () => {
        const array = sortWithBuble([80, 102, 60, -38, 35, 106], Direction.Descending);
        expect(array).toEqual([106, 102, 80, 60, 35, -38]);
      });

      it('С уже отсортированным массивом', () => {
        const array = sortWithBuble([102, 100, 60, 60, 58, -20], Direction.Descending);
        expect(array).toEqual([102, 100, 60, 60, 58, -20]);
      });

      it('Тестирование массива с 1 элементом', () => {
        const array = sortWithBuble([50], Direction.Descending);
        expect(array).toEqual([50]);
      });
  
      it('Тестирование пустого массива', () => {
        const array = sortWithBuble([], Direction.Descending);
        expect(array).toEqual([]);
      })
    })
  });

  describe('Тестирование алгоритма выбором', () => {
    describe('По возрастанию', () => {
      it('С нечётным колличеством символов', () => {
        const array = sortWithChoice([28, 36, 12, 80, 60], Direction.Ascending);
        expect(array).toEqual([12, 28, 36, 60, 80]);
      })

      it('С чётным колличеством символов', () => {
        const array = sortWithChoice([36, 80, 90, 25], Direction.Ascending);
        expect(array).toEqual([25, 36, 80, 90]);
      })

      it('Тестирование сортировки с повторяющимися значениями', () => {
        const array = sortWithChoice([13, 25, 13, 26, 25, 18, 19], Direction.Ascending);
        expect(array).toEqual([13, 13, 18, 19, 25, 25, 26]);
      })

      it('Тестирование сортировки с отрицательными значениями', () => {
        const array = sortWithChoice([25, -15, 18, 14, -15, -14], Direction.Ascending);
        expect(array).toEqual([-15, -15, -14, 14, 18, 25]);
      })

      it('Тестирование сортировки уже отсортированного массива', () => {
        const array = sortWithChoice([12, 17, 18, 19, 26], Direction.Ascending);
        expect(array).toEqual([12, 17, 18, 19, 26]);
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
    

    describe('По убыванию', () => {
      it('С нечётным колличеством элементов', () => {
        const array = sortWithChoice([28, 36, 12, 80, 60], Direction.Descending)
        expect(array).toEqual([80, 60, 36, 28, 12]);
      })

      it('С чётным колличеством элементов', () => {
        const array = sortWithChoice([28, 36, 12, 16,  80, 60], Direction.Descending)
        expect(array).toEqual([80, 60, 36, 28, 16, 12]);
      })

      it('С повторяющимися значениями', () => {
        const array = sortWithChoice([28, 36, 12, 12, 80, 60], Direction.Descending)
        expect(array).toEqual([80, 60, 36, 28, 12, 12]);
      })

      it('С отрицательными значениями', () => {
        const array = sortWithChoice([28, 36, 12, -13, 80, 60], Direction.Descending)
        expect(array).toEqual([80, 60, 36, 28, 12, -13]);
      })

      it('Уже отсортированный массив', () => {
        const array = sortWithChoice([90, 60, 59, 58, 58, 12], Direction.Descending)
        expect(array).toEqual([90, 60, 59, 58, 58, 12]);
      })

      it('Тестирование массива с 1 элементом', () => {
        const array = sortWithChoice([50], Direction.Descending);
        expect(array).toEqual([50]);
      })

      it('Тестирование пустого массива', () => {
        const array = sortWithChoice([], Direction.Descending);
        expect(array).toEqual([]);
      })
    })
  })
})