type TQueue<T> = {
  enqueue: (item: T) => void;
  dequeue: () => void;
  clear: () => void;
  isEmpty: () => number;
}

export class Queue<T> implements TQueue<T> {
  elements: T[] = [];
  head: number = 0;
  tail: number = 0;
  constructor(elements: T[], head: number, tail: number) {
    this.elements = elements;
    this.head = head;
    this.tail = tail;
  }

  enqueue(item: T) {
    this.elements[this.tail] = item;
    this.tail++;
  }

  dequeue() {
    this.elements.splice(this.head, 1);
    this.head++;
  }

  clear() {
    this.elements = [];
    this.head = 0;
    this.tail = 0;
  }

  isEmpty() {
    return this.elements.length;
  }
}