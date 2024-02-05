import { ElementStates } from "../../types/element-states";
import { Direction } from '../../types/direction';


export type TColumn = {
  size: number; 
  state: ElementStates;
}


// Функция создания случайного массива чисел.
export function randomArr() {
  return Array.from(
    {length: Math.floor(Math.random()*14 + 3)}, 
    () => ({
      size: Math.floor(Math.random()*100), 
      state: ElementStates.Default})
    );
}


// Функция замены элементов, если тип сортировки "пузырьком"
function changeElements(arr: TColumn[], curr: number, next: number) {
  const buffer = arr[curr];
  arr[curr] = arr[next];
  arr[next] = buffer;
}


// Общая функция в зависимости от направления сортировки
export function sortingDirection(sortingDirection: Direction, sortingType: 'bubble' | 'choice', curr: number, next: number, arr: TColumn[]): void | number {
  // Условие определяющее сортировку по возрастанию или убыванию
  if (sortingDirection === Direction.Ascending ? 
    arr[curr].size > arr[next].size : 
    arr[curr].size < arr[next].size) 
    {
      // Если тип сортировки "выбором", то будет сохранён индекс нового элемента и позже возвращён из функции
      // Если тип сортировки "пузырьком", то будут поменяны местами элементы. При этом ничего возвращаться не будет.
      sortingType === 'choice' ? curr = next : changeElements(arr, curr, next);
  }

  // Изменение параметров элемента в зависимости от видов сортировки.
  arr[sortingType === 'choice' ? next : curr] = {...arr[sortingType === 'choice' ? next : curr], state: ElementStates.Default};
  if (sortingType === 'choice') {
    return curr;
  }
}


// Общая функция определения следующего элемента сортировки
export function showNextStartingSortingElements(arr: TColumn[], end: number, curr: number, next: number, sortingType: 'bubble' | 'choice'): void {
  // При сортировке выбором могут быть проблемы с последним элементом.
  if (sortingType === 'bubble' ? curr < end : next <= end) {
    arr[curr] = {...arr[curr], state: ElementStates.Changing};
    arr[next] = {...arr[next], state: ElementStates.Changing};
  } else {
    arr[curr] = {...arr[curr], state: ElementStates.Modified};
  }
}


// Функция сортировки "выбором", которая позже помещается в tick функцию для анимации.
export function choiceSorting(arr: TColumn[], start: number, end: number, curr: number, next: number, sortingDir: Direction) {

  // Если есть новый элемент, удовлетворяющий сортировке, то получим его.
  const resultCurr = sortingDirection(sortingDir, 'choice', curr, next, arr);
  next++;

  // Если мы не дошли до конца, то просто подсветим следующий элемент сортировки и текущее значение
  // удовлетворяющего элемента.
  if (next <= end) {
    arr[next] = {...arr[next], state: ElementStates.Changing};
    if (resultCurr) {
      curr = resultCurr;
    }

    // (А это - если всё плохо! Шучу.) Если мы дошли до конца, то проверяем текущее значение с 
    // началом на совпадение значений. Если не совпадают, то запишем и поменяем элементы. 
    // А если совпадают, то просто покажем, что мы его поменяли.
  } else {
    if (resultCurr !== start && resultCurr) {
      const memory = arr[start];
      arr[start] = {...arr[resultCurr], state: ElementStates.Modified};
      arr[resultCurr] = {...memory, state: ElementStates.Default};
    } else {
      arr[start] = {...arr[start], state: ElementStates.Modified};
    }

    // Тут мы двинулись дальше по элементам.
    start++;
    curr = start;
    next = start + 1;

    // Подсветили новые элементы.
    showNextStartingSortingElements(arr, end, start, next, 'choice');
  }

  // Вернули элементы, чтобы обработать в tick функции.
  return {arr, start, end, curr, next};
}

// Это функция для сортировки пузырьком
export function bubbleSorting(arr: TColumn[], start: number, end: number, curr: number, next: number, sortingDir: Direction) {

  // Сравниваем и меняем значения.
  sortingDirection(sortingDir, 'bubble', curr, next, arr);
  curr++;
  next++;

  // Проверяем дошли ли до конца или нет. Если дошли, то выделим элемент удовлетворяющий условию, если нет -
  // идём дальше.
  if (next <= end) {
    arr[next] = {...arr[next], state: ElementStates.Changing};
  } else {
    arr[curr] = {...arr[curr], state: ElementStates.Modified};
    // Двинулись дальше
    curr = start;
    next = start + 1;
    end--;

    // Подсветили новые элементы
    showNextStartingSortingElements(arr, end, curr, next, 'bubble');
  }
  return {arr, start, end, curr, next};
}