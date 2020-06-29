class StackNode<D>{
    public next: StackNode<D> | null = null;
    public data: D;

    constructor(data: D) {
        this.data = data;
    }

}

export class Stack<D>{

    protected top: StackNode<D> | null = null;
    protected _length = 0;

    public get length(): number {
        return this._length;
    }

    public pop(): D {
        if (this.top === null) throw Error('Cannot remove from empty stack');
        const output = this.top.data;
        this.top = this.top.next;
        this._length--;
        return output;
    }

    public push(data: D): void {
        const node = new StackNode<D>(data);
        node.next = this.top;
        this.top = node;
        this._length++;
    }

    public peek(): D | null {
        return this.top ? this.top.data : null;
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

    public pop(): D {
        if (this.index === -1) throw Error('Cannot remove from empty stack');
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

export class IntStack extends Stack<number>{
    private _min = new Stack<number>();

    constructor() {
        super();
    }

    get min(): number | null {
        return this._min.peek();
    }

    public push(x: number): void {
        super.push(x);
        if (this.min === null) return this._min.push(x);
        if (x <= this.min) this._min.push(x);
    }

    public pop(): number {
        const output = super.pop();
        if (output === this.min) this._min.pop();
        return output;
    }
}

export class StackSet<D> {

    private _size: number;
    private _length = 0;
    private _stacks = new Stack<Stack<D>>()

    constructor(size = 256) {
        this._size = size;
    }

    get length(): number {
        return this._length;
    }

    get size(): number {
        return this._size;
    }

    push(data: D): void {
        const stack = this._stacks.peek();
        if (stack === null || stack.length === this._size) {
            const newStack = new Stack<D>();
            newStack.push(data);
            this._stacks.push(newStack);
        } else {
            stack.push(data);
        }
        this._length++;
    }

    pop(): D {
        if (this.length === 0) throw Error('Cannot remove from empty stack');
        const stack = this._stacks.peek() as Stack<D>;
        const output = stack.pop();
        if (stack.length === 0) this._stacks.pop();
        this._length--;
        return output;
    }
}

type Sorter = <D>(x: D, y: D) => -1 | 0 | 1;

const defaultSort: Sorter = (x, y) => x < y ? -1 : x > y ? 1 : 0;

export class SortStack<D> extends Stack<D>{

    private _sort: Sorter;

    constructor(sorter?: Sorter) {
        super();
        this._sort = sorter || defaultSort;
    }

    private _swap(x: StackNode<D>, y: StackNode<D>): void {
        const tmp = x.data;
        x.data = y.data;
        y.data = tmp;
    }

    push(data: D): void {
        super.push(data);
        let next = this.top as StackNode<D>;
        let comparator = next?.next || null;
        while (comparator !== null) {
            switch (this._sort<D>(next.data, comparator.data)) {
                case 1:
                    this._swap(next, comparator);
                    next = this.top as StackNode<D>;
                    comparator = next.next;
                    break;
                default:
                    next = comparator;
                    comparator = comparator.next;
            }
        }
    }

}