export class TreeNode<D> {
  protected _value: D;
  protected _size: number;
  protected _children: TreeNode<D>[] = [];

  constructor(value: D, size = 2) {
    this._value = value;
    this._size = size;
  }

  protected _invalidIndex(index: number): boolean {
    return index >= this._size || index < 0;
  }

  insert(node: TreeNode<D>, index: number): void {
    // allow optional index argument
    if (this._invalidIndex(index))
      throw Error(
        `Invalid index (${index}). Attempting to add children which exceeds capacity`
      );
    this._children[index] = node;
  }

  remove(index: number): void {
    if (this._invalidIndex(index)) throw Error(`Invalid index (${index})`);
    if (!this._children[index])
      throw Error(`Node does not exist at index (${index})`);
    this._children.splice(index, 1);
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
    node.children.forEach((child) => this._depthTraverse(child, output));
    return output;
  }

  static depthTraverse<D>(root: TreeNode<D>): D[] {
    return this._depthTraverse<D>(root, []);
  }
}

export class BinaryTreeNode<D> extends TreeNode<D> {
  constructor(value: D) {
    super(value, 2);
  }

  insert(node: BinaryTreeNode<D>, index: 0 | 1): void {
    this._children[index] = node;
  }

  getChildNode(index: 0 | 1): BinaryTreeNode<D> | null {
    return this._children[index] || null;
  }

  remove(index: 0 | 1): void {
    if (!this._children[index])
      throw Error(`Node does not exist at index (${index})`);
    this._children.splice(index, 1);
  }
}

export class BinaryTree extends Tree {
  static createNode<D>(value: D): BinaryTreeNode<D> {
    return new BinaryTreeNode(value);
  }

  private static _inOrderTraversal<D>(
    node: BinaryTreeNode<D> | null,
    output: D[]
  ): D[] {
    if (node !== null) {
      const [left = null, right = null] = node.children;
      this._inOrderTraversal(left, output);
      output.push(node.value);
      this._inOrderTraversal(right, output);
    }
    return output;
  }

  static inOrderTraversal<D>(root: BinaryTreeNode<D>): D[] {
    return this._inOrderTraversal(root, []);
  }

  private static _preOrderTraversal<D>(
    node: BinaryTreeNode<D> | null,
    output: D[]
  ): D[] {
    if (node !== null) {
      const [left = null, right = null] = node.children;
      output.push(node.value);
      this._preOrderTraversal(left, output);
      this._preOrderTraversal(right, output);
    }
    return output;
  }

  static preOrderTraversal<D>(root: BinaryTreeNode<D>): D[] {
    return this._preOrderTraversal(root, []);
  }

  private static _postOrderTraversal<D>(
    node: BinaryTreeNode<D> | null,
    output: D[]
  ): D[] {
    if (node !== null) {
      const [left = null, right = null] = node.children;
      this._postOrderTraversal(right, output);
      output.push(node.value);
      this._postOrderTraversal(left, output);
    }
    return output;
  }

  static postOrderTraversal<D>(root: BinaryTreeNode<D>): D[] {
    return this._postOrderTraversal(root, []);
  }
}

type Comparator<D> = (x: D, y: D) => -1 | 0 | 1;
export class Heap<D> {
  protected _nodes: D[] = [];
  protected _comparator: Comparator<D>;

  constructor(
    initializer?: D,
    comparator: Comparator<D> = (x, y): 1 | 0 | -1 =>
      x < y ? -1 : x > y ? 1 : 0
  ) {
    if (initializer !== undefined) this._nodes.push(initializer);
    this._comparator = comparator;
  }

  protected _getParentIndex(childIndex: number): number {
    return Math.floor((childIndex - 1) / 2);
  }

  protected _getChildrenIndices(parentIndex: number): number[] {
    const c = parentIndex * 2 + 1;
    return [c, c + 1];
  }

  protected _swap(childIndex: number, parentIndex: number): void {
    const tmp = this._nodes[childIndex];
    this._nodes[childIndex] = this._nodes[parentIndex];
    this._nodes[parentIndex] = tmp;
  }

  append(value: D): number {
    this._nodes.push(value);
    let childIndex = this._nodes.length - 1;
    let parentIndex = this._getParentIndex(childIndex);

    while (parentIndex >= 0) {
      const comparison = this._comparator(
        this._nodes[childIndex],
        this._nodes[parentIndex]
      );
      switch (comparison) {
        case 1:
          return this._nodes.length;
        case -1:
          this._swap(childIndex, parentIndex);
          childIndex = parentIndex;
          parentIndex = this._getParentIndex(childIndex);
          break;
        case 0:
          childIndex = parentIndex;
          parentIndex = this._getParentIndex(childIndex);
      }
    }
    return this._nodes.length;
  }

  extractRoot(): D | undefined {
    if (!this._nodes.length) return undefined;
    const output = this._nodes.shift() as D;
    if (!this._nodes.length) return output;
    this._nodes.unshift(this._nodes.pop() as D);

    let parentIndex = 0;
    let childrenIndices = this._getChildrenIndices(0);

    while (!childrenIndices.every((c) => this._nodes[c] === undefined)) {
      const [f, l] = childrenIndices;
      let childIndexToSwap: number;
      if (this._nodes[l] === undefined) childIndexToSwap = f;
      else {
        const childComparison = this._comparator(
          this._nodes[f],
          this._nodes[l]
        );
        if (childComparison === -1) childIndexToSwap = f;
        else childIndexToSwap = l;
      }

      const parentChildComparison = this._comparator(
        this._nodes[parentIndex],
        this._nodes[childIndexToSwap]
      );

      if (parentChildComparison < 1) return output;

      this._swap(childIndexToSwap, parentIndex);
      parentIndex = childIndexToSwap;
      childrenIndices = this._getChildrenIndices(parentIndex);
    }

    return output;
  }

  get root(): D {
    return this._nodes[0];
  }

  get size(): number {
    return this._nodes.length;
  }
}

type Alphabet =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

export class TrieNode extends TreeNode<Alphabet> {
  protected _children: TrieNode[] = [];
  protected _isTerminal: boolean;

  constructor(value: Alphabet, size = 26, isTerminal = false) {
    super(value, size);
    this._isTerminal = isTerminal;
  }

  getChildNode(index: number): TrieNode | null {
    if (this._invalidIndex(index)) throw Error(`Invalid index (${index})`);
    return this._children[index] || null;
  }

  insert(node: TrieNode, index: number): void {
    if (this._invalidIndex(index))
      throw Error(
        `Invalid index (${index}). Attempting to add children which exceeds capacity`
      );
    if (this.isTerminal)
      throw Error(`Invalid operation: TrieNode attribute 'isTerminal' is true`);
    this._children[index] = node;
  }

  getNodeWithPrefix(value: string): TrieNode | null {
    if (value === "" || value === this._value) return this;
    if (value.length === 1) return null;
    const child = this._children.find((child) => child.value === value[1]);
    if (!child) return null;
    return child.getNodeWithPrefix(value.slice(1));
  }

  get isTerminal(): boolean {
    return this._isTerminal;
  }
}
