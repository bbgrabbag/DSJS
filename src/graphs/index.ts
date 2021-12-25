export type GraphNodeId = string | number;

export class InvalidGraphNodeChildError implements Error {
  name = "InvalidGraphNodeChildError";
  message = "Child nodes must belong to the same graph";
}

export class GraphNode<V> {
  private _value: V;
  private _children: GraphNode<V>[] = [];
  readonly _id: GraphNodeId;
  graph: Graph;

  constructor(value: V, id: GraphNodeId, graph: Graph) {
    this._id = id;
    this._value = value;
    this.graph = graph;
  }

  get id(): GraphNodeId {
    return this._id;
  }

  get value(): V {
    return this._value;
  }

  set value(v: V) {
    this._value = v;
  }

  get(i: number): GraphNode<V> | undefined {
    return this._children[i];
  }

  get last(): GraphNode<V> | undefined {
    return this._children[this.length - 1];
  }

  get first(): GraphNode<V> | undefined {
    return this._children[0];
  }

  get children(): Readonly<GraphNode<V>[]> {
    return Object.freeze(this._children);
  }

  get length(): number {
    return this._children.length;
  }

  append(nodeOrValue: V | GraphNode<V>): void {
    this.insert(this.length, nodeOrValue);
  }

  prepend(nodeOrValue: V | GraphNode<V>): void {
    this.insert(0, nodeOrValue);
  }

  delete(index: number): void {
    this._children.splice(index, 1);
  }

  insert(start: number, ...nodeOrValues: (V | GraphNode<V>)[]): void {
    this._children.splice(
      start,
      0,
      ...nodeOrValues.map((n) => {
        const node = this.graph.fromNodeOrValue(n);
        if (!this.graph.validateNode(node))
          throw new InvalidGraphNodeChildError();
        return node;
      })
    );
  }

  // bfSearch(){}
  // dfSearch(){}
}

export interface GraphComparator {
  <V>(val1: V, val2: V): boolean;
}

export interface GraphIdGenerator {
  (): GraphNodeId;
}

export const serialIdGeneratorFactory = (): GraphIdGenerator => {
  let id = 0;
  return () => id++;
};

export class Graph {
  private genId: GraphIdGenerator;

  constructor(idGenerator: GraphIdGenerator = serialIdGeneratorFactory()) {
    this.genId = idGenerator;
  }

  createNode<V>(value: V): GraphNode<V> {
    return new GraphNode(value, this.genId(), this);
  }

  fromNodeOrValue<V>(nodeOrValue: V | GraphNode<V>): GraphNode<V> {
    return nodeOrValue instanceof GraphNode
      ? nodeOrValue
      : this.createNode(nodeOrValue);
  }

  validateNode<V>(node: GraphNode<V>): boolean {
    return this === node.graph;
  }
}
