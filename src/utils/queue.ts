type TQueue<T> = {
  enqueue: (item: T) => void;
  dequeue: () => T | undefined;
  clear: () => void;
}

export class Queue<T> implements TQueue<T> {
  elements: T[];
  head: number;
  tail: number;
  isEmpty: number;
  size: number;
  constructor(size: number) {
    this.elements = [];
    this.head = 0;
    this.tail = 0;
    this.size = size;
    this.isEmpty = this.elements.length;
  }

  enqueue(item: T) {
    this.elements[this.tail % this.size] = item;
    this.tail++;
  }

  dequeue() {
    const head =  this.elements[this.head];
    this.elements.splice(this.head, 1);
    this.head++;
    return head;
  }

  clear() {
    this.elements = [];
    this.head = 0;
    this.tail = 0;
  }
}