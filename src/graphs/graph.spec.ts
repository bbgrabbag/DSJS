import { GraphNode, Graph, InvalidGraphNodeChildError } from "./";

describe("Graph", () => {
  it("Should be able to create nodes", () => {
    const graph = new Graph();
    const node = graph.createNode(0);
    expect(node instanceof GraphNode).toBe(true);
    expect(node.value).toBe(0);
  });

  it("Should assign id's upon creating nodes", () => {
    const graph = new Graph();
    const node1 = graph.createNode(0);
    const node2 = graph.createNode(0);
    const node3 = graph.createNode(0);
    expect(node1.id).toBe(0);
    expect(node2.id).toBe(1);
    expect(node3.id).toBe(2);
  });

  it("Should validate nodes that belong to the graph", () => {
    const graph = new Graph();
    const other = new Graph();
    const node = graph.createNode(0);
    const otherNode = other.createNode(0);
    expect(graph.validateNode(node)).toBe(true);
    expect(graph.validateNode(otherNode)).toBe(false);
  });

  it("Should produce a node from a given value/node", () => {
    const graph = new Graph();
    const node = graph.createNode(0);
    const sameNode = graph.fromNodeOrValue(node);
    const newNode = graph.fromNodeOrValue(0);
    expect(node).toBe(sameNode);
    expect(node.id).toBe(0);
    expect(newNode instanceof GraphNode).toBe(true);
    expect(newNode.value).toBe(0);
    expect(newNode.id).toBe(1);
  });

  it("Should search nodes via depth search", () => {
    const graph = new Graph();
    const start = graph.createNode("start");
    const target = graph.createNode("target");
    start.insert(0, "a", "b", "c", "d", "e");
    const child = start.get(0) as GraphNode<string>;
    child.insert(0, "f", "g", "h");
    expect(graph.depthSearch(start, (node) => node.id === "none")).toBeNull();
    const grandChild = child.get(0) as GraphNode<string>;
    grandChild.insert(0, "i", "j", "k", start, target);
    const comparator = jest.fn((node: GraphNode<string>) => node === target);
    expect(graph.depthSearch(start, comparator)).toBe(target);
    expect(comparator).toHaveBeenCalledTimes(7);
  });

  // it("Should search nodes via breadth search", () => {});
});

describe("Graph Node", () => {
  it("Should initialize", () => {
    const graph = new Graph();
    const node = graph.createNode(100);
    expect(node.id).toBe(0);
    expect(node.value).toBe(100);
    expect(node.children).toEqual([]);
    expect(node.length).toEqual(0);
    expect(node.graph).toBe(graph);
  });

  it("Should insert nodes and values", () => {
    const graph = new Graph();
    const node = graph.createNode<number | string>(100);
    node.insert(0, 1, 2, 3);
    expect(node.length).toBe(3);
    node.insert(
      0,
      graph.createNode(100),
      graph.createNode(100),
      graph.createNode(100)
    );
    expect(node.length).toBe(6);
    node.append("appended");
    expect(node.last?.value).toBe("appended");
    node.prepend("prepended");
    expect(node.first?.value).toBe("prepended");
  });

  it("Should remove nodes", () => {
    const graph = new Graph();
    const node = graph.createNode(0);
    node.insert(0, 1, 2, 3, 4);
    node.delete(0);
    node.delete(2);
    expect(node.length).toBe(2);
    expect(node.get(0)?.value).toBe(2);
    expect(node.get(1)?.value).toBe(3);
  });

  it("Should not allow nodes to append other nodes from a different graph", () => {
    const graph = new Graph();
    const other = new Graph();
    const graphNode = graph.createNode(100);
    const otherGraphNode = other.createNode(101);
    expect(() => graphNode.append(otherGraphNode)).toThrowError(
      InvalidGraphNodeChildError
    );
  });

  it("Should not allow insertion of duplicate direct child nodes", () => {
    const graph = new Graph();
    const node = graph.createNode(0);
    const duplicate = graph.createNode(0);
    expect(() => node.insert(0, duplicate, duplicate)).toThrowError(
      "Parent node already contains child with id (1)"
    );
  });

  it("Should update values", () => {
    const graph = new Graph();
    const node = graph.createNode(100);
    node.value = 101;
    node.append(200);
    (node.get(0) as GraphNode<number>).value = 202;
    expect(node.value).toBe(101);
    expect((node.get(0) as GraphNode<number>).value).toBe(202);
  });
});
