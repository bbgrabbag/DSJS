export class LinkedListNode<D> {
    public value: D
    protected _next: LinkedListNode<D> | null = null

    constructor(value: D) {
        this.value = value;
    }

    get next(): LinkedListNode<D> | null {
        return this._next;
    }

    set next(node: LinkedListNode<D> | null) {
        this._next = node;
    }

    insert(value: D): LinkedListNode<D>
    insert(node: LinkedListNode<D>): LinkedListNode<D>
    insert(arg: D | LinkedListNode<D>): LinkedListNode<D> {
        const node = arg instanceof LinkedListNode ? arg : new LinkedListNode<D>(arg);
        if (this.next === null) {
            return this.next = node;
        } else {
            const tmp = this.next;
            node.next = tmp;
            return this.next = node;
        }
    }
}

export class LinkedList<D> {
    private _head: LinkedListNode<D> | null = null

    constructor(headValue?: D)
    constructor(empty?: null)
    constructor(head?: LinkedListNode<D>)
    constructor(values?: D[])
    constructor(initializer?: D | D[] | LinkedListNode<D> | null) {
        if (initializer === undefined || initializer === null) return;
        if (Array.isArray(initializer)) {
            if (!initializer.length) return;
            this._head = new LinkedListNode<D>(initializer.shift() as D);
            let next = this._head;
            initializer.forEach(v => {
                next.next = new LinkedListNode<D>(v);
                next = next.next;
            });
        } else if (initializer instanceof LinkedListNode) {
            this._head = initializer;
        } else {
            this._head = new LinkedListNode<D>(initializer);
        }
    }

    set head(node: LinkedListNode<D> | null) {
        this._head = node;
    }

    get head(): LinkedListNode<D> | null {
        return this._head;
    }

    prepend(value: D): LinkedListNode<D>
    prepend(node: LinkedListNode<D>): LinkedListNode<D>
    prepend(arg: D | LinkedListNode<D>): LinkedListNode<D> {
        const node = arg instanceof LinkedListNode ? arg : new LinkedListNode<D>(arg);
        if (this.head === null) return this.head = node;
        node.next = this.head;
        return this.head = node;
    }

    append(value: D): LinkedListNode<D>
    append(node: LinkedListNode<D>): LinkedListNode<D>
    append(arg: D | LinkedListNode<D>): LinkedListNode<D> {
        const node = arg instanceof LinkedListNode ? arg : new LinkedListNode<D>(arg);

        if (this.head === null) return this.head = node;

        let next: LinkedListNode<D> | null = this.head;
        while (next?.next !== null) {
            next = this.head.next;
        }
        return next.next = node;
    }

    find(cb: (node: LinkedListNode<D>) => boolean): LinkedListNode<D> | undefined {
        let next = this.head;
        while (next !== null) {
            if (cb(next)) return next;
            next = next.next;
        }
    }

    remove(node: LinkedListNode<D>): LinkedListNode<D> | null {
        if (this.head === null) return null;
        if (node === this.head) {
            const tmp = this.head;
            this.head = null;
            return this.head = tmp.next;
        }

        let next = this.head.next;
        let prev = this.head;

        while (next !== null) {
            if (node === next) {
                const tmp = next;
                next = null;
                return prev.next = tmp.next;
            }
            prev = next;
            next = next.next;
        }

        return null;
    }

    forEach(cb: (node: LinkedListNode<D>) => void): void {
        let next = this.head;
        while (next !== null) {
            cb(next);
            next = next.next;
        }
    }

    *[Symbol.iterator](): Generator<D> {
        let nextNode = this.head;
        while (nextNode !== null) {
            yield nextNode.value;
            nextNode = nextNode.next;
        }
    }
}


export class DoublyLinkedListNode<D>{
    protected _prev: DoublyLinkedListNode<D> | null = null;
    protected _next: DoublyLinkedListNode<D> | null = null;
    public value: D;

    constructor(value: D) {
        this.value = value;
    }

    set next(node: DoublyLinkedListNode<D> | null) {
        if (node) node._prev = this;
        else if (this.next) this.next._prev = null;
        this._next = node;
    }

    get next(): DoublyLinkedListNode<D> | null {
        return this._next;
    }

    set prev(node: DoublyLinkedListNode<D> | null) {
        if (node) node._next = this;
        else if (this.prev) this.prev._next = null;
        this._prev = node;
    }

    get prev(): DoublyLinkedListNode<D> | null {
        return this._prev;
    }
}
