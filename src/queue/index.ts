import { Stack } from '../stack';

class QueueNode<D>{
    private _data: D;
    private _next: QueueNode<D> | null = null;
    constructor(data: D) {
        this._data = data;
    }

    public get data() {
        return this._data;
    }

    public get next(): QueueNode<D> | null {
        return this._next;
    }

    public set next(node: QueueNode<D> | null) {
        this._next = node;
    }
}

export class Queue<D> {
    private _head: QueueNode<D> | null = null;
    private _last: QueueNode<D> | null = null;
    protected _length = 0;

    public get length(): number {
        return this._length;
    }

    peek(): D | null {
        return this._head?.data || null;
    }

    enqueue(data: D): void {
        const node = new QueueNode<D>(data);
        if (this._head === null || this._last === null) {
            this._head = node;
            this._last = this._head;
        } else {
            this._last.next = node;
            this._last = node;
        }
        this._length++;
    }

    dequeue(): D {
        if (this._head === null || this._last === null) throw Error('Cannot dequeue from an empty queue');
        const node = this._head;
        if (node === this._last) this._last = null;
        this._head = this._head.next;
        this._length--;
        return node.data;
    }

}

export class QueueStack<D> extends Queue<D>{

    private _adder = new Stack<D>();
    private _remover = new Stack<D>();
    private _next: QueueNode<D> | null = null;

    constructor() {
        super();
    }

    private _reverse(from: Stack<D>, to: Stack<D>): void {
        while (from.length) to.push(from.pop());
    }

    peek(): D | null {
        return this._next?.data || null;
    }


    enqueue(data: D): void {
        if (this._next === null) this._next = new QueueNode<D>(data);
        if (this._remover.length) {
            this._reverse(this._remover, this._adder);
        }
        this._adder.push(data);
        this._length++;
    }

    dequeue(): D {
        if (!this._remover.length) {
            if (!this._adder.length) throw Error('Cannot dequeue from an empty queue');
            this._reverse(this._adder, this._remover);
        }
        const output = this._remover.pop();
        const next = this._remover.peek();
        this._next = next === null ? null : new QueueNode<D>(next);
        this._length--;
        return output;
    }
}