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
    private _length = 0;

    public get length(): number {
        return this._length;
    }

    peek(): D | null {
        return this._head?.data || null;
    }

    add(data: D): void {
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

    remove(): D | null {
        if (this._head === null || this._last === null) return null;
        const node = this._head;
        if (node === this._last) this._last = null;
        this._head = this._head.next;
        this._length--;
        return node.data;
    }

}