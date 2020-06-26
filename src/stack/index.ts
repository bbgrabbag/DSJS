class StackNode<D>{
    private _data: D;
    private _next: StackNode<D> | null = null;
    constructor(data: D) {
        this._data = data;
    }

    public get data() {
        return this._data;
    }

    public get next(): StackNode<D> | null {
        return this._next;
    }

    public set next(node: StackNode<D> | null) {
        this._next = node;
    }
}

export class Stack<D>{

    private top: StackNode<D> | null = null;

    public get isEmpty(): boolean {
        return this.top === null;
    }

    public pop(): D | null {
        if (this.top === null) return null;
        const output = this.top.data;
        this.top = this.top.next;
        return output;
    }

    public push(data: D): void {
        const node = new StackNode<D>(data);
        node.next = this.top;
        this.top = node;
    }

    public peek(): D | null {
        return this.top?.data || null;
    }

}

export class ArrayStack<D>{

    private stack: D[];
    private index = -1;
    private _size: number;

    constructor(size = 256) {
        this.stack = Array(size);
        this._size = size;
    }

    get length(): number {
        return this.index + 1;
    }

    get size(): number {
        return this._size;
    }

    public add(data: D): D {
        if (this.length === this.size) throw Error('Stack has reached maximum capacity');
        this.index++;
        return this.stack[this.index] = data;
    }

    public pop(): D | null {
        if (this.index === -1) throw Error('Cannnot remove from empty stack');
        const output = this.stack[this.index];
        delete this.stack[this.index];
        this.index--;
        return output;
    }

    public peek(): D | null {
        if (this.length === 0) return null;
        return this.stack[this.index];
    }
}