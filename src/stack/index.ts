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