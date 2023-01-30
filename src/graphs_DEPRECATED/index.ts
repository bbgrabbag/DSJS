import { Queue } from "../queue";

/**@deprecated */
export type GraphNodeId = string;

/**@deprecated */
export class InvalidGraphNodeChildError implements Error {
  name = "InvalidGraphNodeChildError";
  message = "Child nodes must belong to the same graph";
}

/**@deprecated */
export class DuplicateGraphNodeChildError implements Error {
  name = "DuplicateGraphNodeChildError";
  message: string;
  constructor(id: GraphNodeId) {
    this.message = `Parent node already contains child with id (${id})`;
  }
}

/**@deprecated */
export class GraphNode<V> {
  private _value: V;
  protected _children: GraphNode<V>[] = [];
  readonly _id: GraphNodeId;
  graph: Graph;

  constructor(value: V, id: GraphNodeId, graph: Graph) {
    this._id = id;
    this._value = value;
    this.graph = graph;
    this.graph.registerNode(this);
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

  get childValues(): Readonly<V[]> {
    return this._children.map((child) => child.value);
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

/**@deprecated */
export interface GraphComparator {
  <V>(val1: V, val2: V): boolean;
}

/**@deprecated */
export interface GraphIdGenerator {
  (): GraphNodeId;
}

/**@deprecated */
export const serialIdGeneratorFactory = (): GraphIdGenerator => {
  let id = 0;
  return () => String(id++);
};

/**@deprecated */
export class Graph {
  private genId: GraphIdGenerator;
  private _registry: Record<GraphNodeId, GraphNode<unknown>>;

  constructor(idGenerator: GraphIdGenerator = serialIdGeneratorFactory()) {
    this.genId = idGenerator;
    this._registry = {};
  }

  unregisterNode(id: GraphNodeId): void {
    if (this._registry[id]) delete this._registry[id];
  }

  registerNode<V>(node: GraphNode<V>): void {
    this._registry[node.id] = node;
  }

  getNodeIds(): Array<GraphNodeId> {
    return Object.keys(this._registry);
  }

  getNodeById<V>(id: GraphNodeId): GraphNode<V> | null {
    return (this._registry[id] as GraphNode<V>) || null;
  }

  createNode<V>(value: V, id?: GraphNodeId): GraphNode<V> {
    const node = new GraphNode(value, id ?? this.genId(), this);
    return node;
  }

  fromNodeOrValue<V>(
    nodeOrValue: V | GraphNode<V>,
    id?: GraphNodeId
  ): GraphNode<V> {
    return nodeOrValue instanceof GraphNode
      ? nodeOrValue
      : this.createNode(nodeOrValue, id);
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

  breadthSearch<V>(
    start: GraphNode<V>,
    compare: (node: GraphNode<V>) => boolean,
    checklist: { [K: string]: boolean } = {}
  ): null | GraphNode<V> {
    const queue = new Queue<GraphNode<V>>();
    queue.enqueue(start);
    while (queue.length) {
      const current = queue.dequeue();
      if (compare(current)) return current;
      checklist[current.id] = true;
      for (const node of current.children) {
        if (!checklist[node.id]) queue.enqueue(node);
      }
    }
    return null;
  }

  shortestPath<V>(
    start: GraphNode<V>,
    finish: GraphNode<V>
  ): null | GraphNode<V>[] {
    const checklist: Record<GraphNodeId, boolean> = {};
    const nodePairs: Record<GraphNodeId, GraphNodeId | null> = {};
    const queue = new Queue<[GraphNode<V>, GraphNode<V> | null]>();
    queue.enqueue([start, null]);

    const producePathFromNodePairs = (
      finish: GraphNode<V>
    ): Array<GraphNode<V>> => {
      const output: Array<GraphNode<V>> = [finish];
      let next = nodePairs[finish.id];
      while (next) {
        output.push(this.getNodeById(next) as GraphNode<V>);
        next = nodePairs[next];
      }
      return output;
    };

    while (queue.length) {
      const [node, parent] = queue.dequeue();
      checklist[node.id] = true;
      nodePairs[node.id] = parent?.id ?? null;
      if (node.id == finish.id) return producePathFromNodePairs(node);
      node.children.forEach((child) => {
        if (!checklist[child.id]) queue.enqueue([child, node]);
      });
    }
    return null;
  }
}
