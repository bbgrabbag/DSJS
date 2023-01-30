export class LinkedListNode<D> {
  value: D;
  next: LinkedListNode<D> | null = null;

  constructor(value: D) {
    this.value = value;
  }
}

export class LinkedList<D> {
  head: LinkedListNode<D> | null = null;
  last: LinkedListNode<D> | null = null;

  constructor(initializer?: D) {
    if (initializer !== undefined) {
      this.head = new LinkedListNode<D>(initializer);
      this.last = this.head;
    }
  }

  append(value: D): LinkedListNode<D> {
    const node = new LinkedListNode(value);
    if (this.head === null) this.head = node;
    if (this.last === null) return (this.last = node);
    this.last.next = node;
    this.last = node;
    return node;
  }

  prepend(value: D): LinkedListNode<D> {
    const next = this.head;
    const node = new LinkedListNode(value);
    node.next = next;
    return (this.head = node);
  }

  static createNode<D>(value: D): LinkedListNode<D> {
    return new LinkedListNode<D>(value);
  }

  static insert<D>(value: D, node: LinkedListNode<D>): LinkedListNode<D> {
    const next = node.next;
    node.next = this.createNode<D>(value);
    node.next.next = next;
    return node;
  }

  static prepend<D>(value: D, node: LinkedListNode<D>): LinkedListNode<D> {
    const next = this.createNode<D>(value);
    next.next = node;
    return next;
  }
}
