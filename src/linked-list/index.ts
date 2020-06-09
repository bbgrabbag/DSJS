export class LinkedListNode<D> {
    private _value: D
    private _next: LinkedListNode<D> | null = null

    constructor(value: D) {
        this._value = value;
    }

    set value(value: D) {
        this._value = value;
    }

    get value(): D {
        return this._value;
    }

    set next(node: LinkedListNode<D> | null) {
        if (this.next !== null) {
            if (node !== null) {
                const tmp: LinkedListNode<D> = this.next;
                node.next = tmp;
            }
        }
        this._next = node;
    }

    get next(): LinkedListNode<D> | null {
        return this._next;
    }
}

export class LinkedList<D> {
    private _head: LinkedListNode<D> | null = null

    constructor(headValue?: D)
    constructor(head?: LinkedListNode<D>)
    constructor(values?: D[])
    constructor(initializer?: D | D[] | LinkedListNode<D>) {
        if (initializer === undefined) return;
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

    remove(node: LinkedListNode<D>): void {
        if (this.head === null) return;
        if (node === this.head) {
            this.head = this.head.next;
            return;
        }

        let next = this.head.next;
        let prev = this.head;

        while (next !== null) {
            if (node === next) {
                prev.next = next.next;
                next = null;
                return;
            }
            prev = next;
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