export class LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | null;
  constructor(value: T, next?: LinkedListNode<T> | null) {
    this.value = value;
    this.next = (next === undefined ? null : next);
  }
}

type TLinkedList<T> = {
  prepend: (item: T) => void;
  append: (item: T) => void;
  addByIndex: (item: T, index: number) => void;
  deleteByIndex: (index: number) => void;
  deleteHead: () => void;
  deleteTail: () => void;
  toArray: () => T[];
}

export class LinkedList<T> implements TLinkedList<T> {
  head: LinkedListNode<T> | null;
  tail: LinkedListNode<T> | null;
  constructor() {
    this.head = this.tail = null;
  }

  prepend(item: T) {
    let node = new LinkedListNode<T>(item);
    if (this.head === null) {
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
  }

  append(item: T) {
    let node = new LinkedListNode<T>(item);
    if (this.tail === null) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
  }

  addByIndex(item: T, index: number) {
    const node = new LinkedListNode<T>(item);
    if (this.head !== null) {
      let curr = this.head;
      let prev = this.head;
      if (curr.next !== null) {
        for (let i = 0; i < index; i++) {
          if (curr.next !== null) {
            prev = curr;
            curr = curr.next;
          }
        }
        if (index === 0) {
          node.next = this.head;
          this.head = node;
        } else {
          prev.next = node;
          node.next = curr;
        }
      } else {
        if (index === 0) {
          node.next = this.head;
          this.head = node;
        } 
        if (index === 1) {
          this.head.next = node;
        } 
      }
    } else {
      this.head = this.tail = node;
    }
  }

  deleteByIndex(index: number) {
    if (this.head === null) {
      return;
    } else {
      let curr: LinkedListNode<T> | null = this.head;
      let prev: LinkedListNode<T> | null = this.head;
      if (curr.next !== null) {
        for (let i = 0; i < index; i++) {
          if (curr.next !== null) {
            prev = curr;
            curr = curr.next;
          }
        }
        if (curr.next !== null) {
          if (index === 0) {
            this.deleteHead();
          } else {
            prev.next = curr.next;
          }
        } else {
          this.deleteTail();
        }
        
      } else {
        curr = null;
      }
    }
  }

  deleteHead() {
    if (this.head === null) {
      return;
    } else if (this.head.next === null) {
      this.head = this.tail = null;
    } else {
      const buffer = this.head;
      this.head = this.head.next;
      buffer.next = null;
    }
  }

  deleteTail() {
    if (this.tail === null) {
      return;
    } else if (this.head && this.head.next === null) {
      this.head = this.tail = null;
    } else {
      let curr = this.head;
      let prev = this.head;
      if (curr !== null && prev !== null) {
        while (curr.next !== null) {
          if (curr.next !== null) {
            prev = curr;
            curr = curr.next;
          }
        }
        this.tail = prev;
        this.tail.next = curr.next;
      }
    }
  }

  toArray() {
    const arr: T[] = []
    if (this.head !== null) {
      let list: LinkedListNode<T> | null = this.head;
      while (list !== null) {
        arr.push(list.value);
        list = list.next;
      }
    }
    return arr;
  }
}