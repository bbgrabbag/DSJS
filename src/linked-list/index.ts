export class LinkedListNode<D>{
    value: D;
    next: LinkedListNode<D> | null = null;

    constructor(value: D) {
        this.value = value;
    }

}

export class LinkedList<D>{

    protected _head: LinkedListNode<D> | null = null;
    protected _last: LinkedListNode<D> | null = null;

    constructor(initializer?: D) {
        if (initializer !== undefined) {
            this._head = new LinkedListNode<D>(initializer);
            this._last = this._head;
        }
    }

    get head(): LinkedListNode<D> | null {
        return Object.freeze(this._head);
    }

    get last(): LinkedListNode<D> | null {
        return Object.freeze(this._last);
    }

    append(value: D): LinkedListNode<D> {
        const node = new LinkedListNode(value);
        if (this.head === null) this._head = node;
        node.next = this.last;
        this._last = node;
        return node;
    }

    prepend(value: D): LinkedListNode<D> {
        const next = this.head;
        const node = new LinkedListNode(value);
        node.next = next;
        return this._head = node;
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