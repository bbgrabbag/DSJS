// import {Queue} from '../queue';

export type GraphNodeId = string | number;

export class InvalidGraphNodeChildError implements Error {
  name = "InvalidGraphNodeChildError";
  message = "Child nodes must belong to the same graph";
}
export class DuplicateGraphNodeChildError implements Error {
  name = "DuplicateGraphNodeChildError";
  message: string;
  constructor(id: GraphNodeId) {
    this.message = `Parent node already contains child with id (${id})`;
  }
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
    return Object.freeze([...this._children]);
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

  hasChild(node: GraphNode<V>): boolean {
    return !!this._children.find((n) => n === node);
  }

  insert(start: number, ...nodeOrValues: (V | GraphNode<V>)[]): void {
    this._children.splice(
      start,
      0,
      ...nodeOrValues.map((n, i) => {
        const node = this.graph.fromNodeOrValue(n);
        if (nodeOrValues.indexOf(node, i + 1) > -1 || this.hasChild(node))
          throw new DuplicateGraphNodeChildError(node.id);
        if (!this.graph.validateNode(node))
          throw new InvalidGraphNodeChildError();
        return node;
      })
    );
  }
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

  depthSearch<V>(
    start: GraphNode<V>,
    compare: (node: GraphNode<V>) => boolean,
    checklist: { [K: string]: boolean } = {}
  ): null | GraphNode<V> {
    if (!checklist[start.id] && compare(start)) {
      checklist[start.id] = true;
      return start;
    }
    checklist[start.id] = true;
    for (const node of start.children) {
      if (checklist[node.id]) continue;
      const found = this.depthSearch(node, compare, checklist);
      if (found) return found;
    }
    return null;
  }
}
