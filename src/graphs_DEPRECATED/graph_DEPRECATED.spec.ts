import { GraphNode, Graph, InvalidGraphNodeChildError } from ".";

describe("Graph data structure", () => {
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
    expect(node1.id).toBe("0");
    expect(node2.id).toBe("1");
    expect(node3.id).toBe("2");
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
    expect(node.id).toBe("0");
    expect(newNode instanceof GraphNode).toBe(true);
    expect(newNode.value).toBe(0);
    expect(newNode.id).toBe("1");
  });

  it("Should register nodes on create/insert", () => {
    const graph = new Graph();
    const node = graph.createNode(0);
    expect(graph.getNodeById("0")).toBe(node);
    node.append(1);
    const child = node.first;
    expect(graph.getNodeById("1")).toBe(child);
    node.insert(1, 2);
    const sibling = node.last;
    expect(graph.getNodeById("2")).toBe(sibling);
    expect(graph.getNodeIds()).toEqual(["0", "1", "2"]);
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

  it("Should search nodes via breadth search", () => {
    const graph = new Graph();
    const start = graph.createNode("start");
    const target = graph.createNode("target");
    start.insert(0, "a", "b", "c", "d", "e");
    const child = start.get(0) as GraphNode<string>;
    child.insert(0, "f", "g", "h", "i", "j", start, target);
    expect(graph.breadthSearch(start, (node) => node.id === "none")).toBeNull();
    const comparator = jest.fn((node: GraphNode<string>) => node === target);
    expect(graph.breadthSearch(start, comparator)).toBe(target);
    expect(comparator).toHaveBeenCalledTimes(12);
  });

  it("Should get shortest path between nodes", () => {
    const graph = new Graph();
    const start = graph.createNode("start", "start");
    const finish = graph.createNode("finish", "finish");
    const first = graph.createNode("first", "first");
    const second = graph.createNode("second", "second");
    const third = graph.createNode("third", "third");
    const fourth = graph.createNode("fourth", "fourth");
    start.insert(0, "0", "1", "2", first, "3", "4", "5");
    first.insert(0, "0", "1", "2", second, "3", "4", "5");
    second.insert(0, "0", "1", "2", third, "3", "4", "5");
    third.insert(0, "0", "1", "2", fourth, "3", "4", "5");
    fourth.insert(0, "0", "1", "2", finish, "3", "4", "5");
    const path = graph.shortestPath(start, finish);
    expect(path?.map((n) => n.id)).toEqual([
      finish.id,
      fourth.id,
      third.id,
      second.id,
      first.id,
      start.id,
    ]);
  });
  it("Should return null of no path is possible", () => {
    const graph = new Graph();
    const start = graph.createNode("start", "start");
    const finish = graph.createNode("finish", "finish");
    const first = graph.createNode("first", "first");
    const second = graph.createNode("second", "second");
    const third = graph.createNode("third", "third");
    start.insert(0, "0", "1", "2", first, "3", "4", "5");
    first.insert(0, "0", "1", "2", second, "3", "4", "5");
    second.insert(0, "0", "1", "2", third, "3", "4", "5");
    third.insert(0, "0", "1", "2", "3", "4", "5");
    const path = graph.shortestPath(start, finish);
    expect(path).toBeNull();
  });
});

describe("GraphNode data structure", () => {
  it("Should initialize", () => {
    const graph = new Graph();
    const node = graph.createNode(100);
    expect(node.id).toBe("0");
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
    expect(node.childValues).toEqual([1, 2, 3]);
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
    node.insert(1, 201);
    expect(node.childValues).toEqual([
      "prepended",
      201,
      100,
      100,
      100,
      1,
      2,
      3,
      "appended",
    ]);
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
