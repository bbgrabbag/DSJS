export class TreeNode<D>{
    protected _value: D;
    protected _children: TreeNode<D>[] = [];
    protected _size: number;
    protected _length = 0;

    constructor(value: D, size = 2) {
        this._value = value;
        this._size = size;
    }

    protected _invalidIndex(index: number): boolean {
        return index >= this._size || index < 0;
    }

    insert(node: TreeNode<D>, index: number,): void {
        if (this._invalidIndex(index)) throw Error(`Invalid index (${index}). Attempting to add children which exceeds capacity`);
        this._children[index] = node;
        this._length++;
    }

    remove(index: number): void {
        if (this._invalidIndex(index)) throw Error(`Invalid index (${index})`);
        if (!this._children[index]) throw Error(`Node does not exist at index (${index})`);
        this._children.splice(index, 1);
        this._length--;
    }

    getChildNode(index: number): TreeNode<D> | null {
        if (this._invalidIndex(index)) throw Error(`Invalid index (${index})`);
        return this._children[index] || null;
    }

    get value(): D {
        return this._value;
    }

    get size(): number {
        return this._size;
    }

    get childrenLength(): number {
        return this._length;
    }

    get children(): readonly TreeNode<D>[] {
        return Object.freeze(this._children);
    }
}

export class Tree {
    static createNode<D>(value: D, size: number): TreeNode<D> {
        return new TreeNode<D>(value, size);
    }

    private static _depthTraverse<D>(node: TreeNode<D>, output: D[]): D[] {
        output.push(node.value);
        node.children.forEach(child => this._depthTraverse(child, output));
        return output;
    }

    static depthTraverse<D>(root: TreeNode<D>): D[] {
        return this._depthTraverse<D>(root, []);
    }
}