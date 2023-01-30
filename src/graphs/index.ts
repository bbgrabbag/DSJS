import { Queue } from "../queue";

export type NodeOrValue<V> = BaseGraphNode<V> | V;

export class BaseGraphNode<V = unknown> {
  value: V;
  private children: Map<BaseGraphNode<V>, V>;
  graph: Graph<V>;

  constructor(value: V, graph: Graph<V>) {
    this.value = value;
    this.children = new Map<BaseGraphNode<V>, V>();
    this.graph = graph;
  }

  get childCount(): number {
    return this.children.size;
  }

  get childNodes(): Array<BaseGraphNode<V>> {
    return Array.from(this.children.keys());
  }

  hasChild(node: BaseGraphNode<V>): boolean {
    return this.children.has(node);
  }

  append(nodeOrValue: V | this): BaseGraphNode<V> {
    const node =
      nodeOrValue instanceof BaseGraphNode
        ? nodeOrValue
        : this.graph.createNode(nodeOrValue);
    this.children.set(node, node.value);
    return node;
  }

  remove(node: BaseGraphNode<V>): void {
    this.children.delete(node);
  }

  depthSearch(
    lookingFor: BaseGraphNode<V>,
    startingNode: BaseGraphNode<V> = this,
    searched = new Map<BaseGraphNode<V>, true>()
  ): boolean {
    if (startingNode == lookingFor) return true;
    searched.set(startingNode, true);

    for (const child of startingNode.childNodes) {
      if (!searched.has(child)) {
        const found = this.depthSearch(lookingFor, child, searched);
        if (found) return found;
      }
    }
    return false;
  }

  breadthSearch(lookingFor: BaseGraphNode<V>): boolean {
    const searched = new Map<BaseGraphNode<V>, true>();
    const queue = new Queue<BaseGraphNode<V>>();
    queue.enqueue(this);
    while (queue.length) {
      const node = queue.dequeue();
      if (node == lookingFor) return true;
      if (searched.has(node)) continue;
      searched.set(node, true);
      for (const child of node.childNodes) {
        if (!searched.has(child)) queue.enqueue(child);
      }
    }
    return false;
  }

  shortestPath(destination: BaseGraphNode<V>): null | BaseGraphNode<V>[] {
    const searched = new Map<BaseGraphNode<V>, true>();
    const nodePairs = new Map<BaseGraphNode<V>, BaseGraphNode<V> | null>();
    const queue = new Queue<[BaseGraphNode<V>, BaseGraphNode<V> | null]>();

    queue.enqueue([this, null]);

    while (queue.length) {
      const [node, parent] = queue.dequeue();
      if (searched.has(node)) continue;
      nodePairs.set(node, parent);
      searched.set(node, true);
      if (node == destination) break;
      for (const child of node.childNodes) {
        if (!searched.has(child)) queue.enqueue([child, node]);
      }
    }

    if (!nodePairs.has(destination)) return null;

    const path = [];
    let current = destination;
    while (current) {
      path.unshift(current);
      current = nodePairs.get(current) as BaseGraphNode<V>;
    }

    return path;
  }
}

export class Graph<V = unknown> {
  private nodeRegistry: Set<BaseGraphNode<V>>;

  constructor() {
    this.nodeRegistry = new Set<BaseGraphNode<V>>();
  }

  get size(): number {
    return this.nodeRegistry.size;
  }

  createNode(value: V): BaseGraphNode<V> {
    const node = new BaseGraphNode<V>(value, this);
    this.nodeRegistry.add(node);
    return node;
  }

  deleteNode(node: BaseGraphNode<V>): void {
    this.nodeRegistry.delete(node);
    this.nodeRegistry.forEach((v, registeredNode) => {
      registeredNode.remove(node);
    });
  }

  cloneNode(node: BaseGraphNode<V>): BaseGraphNode<V> {
    const clone = this.createNode(node.value);
    node.childNodes.forEach((child) => clone.append(child));
    return clone;
  }

  findNode(cb: (n: BaseGraphNode<V>) => boolean): BaseGraphNode<V> | void {
    for (const node of this.nodeRegistry.values()) if (cb(node)) return node;
  }

  findAllNodes(cb: (n: BaseGraphNode<V>) => boolean): BaseGraphNode<V>[] {
    const output = [];
    for (const node of this.nodeRegistry.values())
      if (cb(node)) output.push(node);
    return output;
  }
}
