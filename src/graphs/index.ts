export class GraphNode<V> {
  private _value: V;
  private _children: GraphNode<V>[] = [];

  constructor(value: V) {
    this._value = value;
  }

  get value(): V {
    return this._value;
  }

  set value(v: V) {
    this._value = v;
  }

  getNodeAtIndex(i: number): GraphNode<V> | void {
    return this._children[i];
  }

  getValueAtIndex(i: number): V | void {
    return this._children[i]?.value;
  }

  get children(): Readonly<GraphNode<V>[]> {
    return Object.freeze(this._children);
  }

  get length(): number {
    return this._children.length;
  }

  append(nodeOrValue: V | GraphNode<V>): void {
    const node =
      nodeOrValue instanceof GraphNode
        ? nodeOrValue
        : new GraphNode(nodeOrValue);
    this._children.push(node);
  }
}
