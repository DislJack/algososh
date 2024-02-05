type TStack<T> = {
  push: (item: T) => void;
  pop: () => void;
  clear: () => void;
}

export class Stack<T> implements TStack<T> {
  elements: T[];
  size: number;
  constructor() {
    this.elements = [];
    this.size = 0;
  }

  push(item: T) {
    this.elements = [...this.elements, item];
    this.size++;
  }

  pop() {
    this.elements = [...this.elements.slice(0, this.size - 1)];
    this.size--;
  }

  clear() {
    this.elements = [];
    this.size = 0;
  }
}