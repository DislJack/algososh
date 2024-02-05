

export function countNextFibonacciElement(arr: string[], start: number, buffer: number, next: number, count: number) {
  buffer = next;
  next += start;
  arr = [...arr, next.toString()];
  
  
  start = buffer;
  count++;
  return {arr, start, buffer, next, count};
}