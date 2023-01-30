import { Graph, BaseGraphNode } from ".";

describe("Graphs (beta)", () => {
  it("Should initialize with no defined types", () => {
    const graph = new Graph();
    const node = graph.createNode("1");
    expect(node instanceof BaseGraphNode).toBe(true);
    expect(node.graph).toBe(graph);
  });

  it("Should initialize with defined types", () => {
    const graph = new Graph<string>();
    const node = graph.createNode("1");
    expect(node instanceof BaseGraphNode).toBe(true);
    expect(node.graph).toBe(graph);
  });

  it("Should increase graph size as new nodes are added", () => {
    const graph = new Graph<string>();
    expect(graph.size).toBe(0);
    graph.createNode("1");
    expect(graph.size).toBe(1);
  });

  it("Should append nodes and increment graph size", () => {
    const graph = new Graph<number>();
    expect(graph.size).toBe(0);
    const node = graph.createNode(1);
    expect(graph.size).toBe(1);
    expect(node.childCount).toBe(0);
    node.append(graph.createNode(2));
    expect(graph.size).toBe(2);
    expect(node.childCount).toBe(1);
  });

  it("Should find child node if it exists", () => {
    const graph = new Graph<number>();
    const node = graph.createNode(1);
    const nope = graph.createNode(1);
    const yep = graph.createNode(1);
    node.append(yep);
    expect(node.hasChild(yep)).toBe(true);
    expect(node.hasChild(nope)).toBe(false);
  });

  it("Should remove child nodes but not change graph size", () => {
    const graph = new Graph<number>();
    const node = graph.createNode(1);
    const child = graph.createNode(2);
    node.append(child);
    expect(node.childCount).toBe(1);
    expect(graph.size).toBe(2);
    node.remove(child);
    expect(node.childCount).toBe(0);
    expect(graph.size).toBe(2);
  });

  it("Should delete graph node, decrement graph size, and remove it from all other node children", () => {
    const graph = new Graph<string>();
    const node = graph.createNode("node");
    const uncle = graph.createNode("uncle");
    const child = node.append("child");
    node.append("sibling");
    uncle.append(child);
    expect(graph.size).toBe(4);
    expect(node.childCount).toBe(2);
    expect(uncle.childCount).toBe(1);
    expect(node.hasChild(child)).toBe(true);
    expect(uncle.hasChild(child)).toBe(true);
    graph.deleteNode(child);
    expect(node.hasChild(child)).toBe(false);
    expect(uncle.hasChild(child)).toBe(false);
    expect(graph.size).toBe(3);
  });

  it("Should not allow duplicate children", () => {
    const graph = new Graph<string>();
    const node = graph.createNode("node");
    const child = node.append("child");
    expect(graph.size).toBe(2);
    expect(node.childCount).toBe(1);
    node.append(child);
    expect(graph.size).toBe(2);
    expect(node.childCount).toBe(1);
  });

  it("Should clone nodes", () => {
    const graph = new Graph<number>();
    const node = graph.createNode(0);
    node.append(1);
    node.append(2);
    node.append(3);
    const clone = graph.cloneNode(node);
    expect(clone.childCount).toBe(3);
    expect(clone.childNodes).toEqual(node.childNodes);
  });

  it("Should find via depth search if node exists as a nested child", () => {
    const graph = new Graph<string>();
    const node = graph.createNode("start");
    const lookingFor = graph.createNode("finish");

    const spy = jest.spyOn(node, "depthSearch");

    Array.from(Array(100)).forEach((_, i) => {
      node.append(String(i));
    });
    node.childNodes.forEach((child) => {
      Array.from(Array(100)).forEach((_, i) => {
        child.append(String(i));
      });
      child.childNodes.forEach((grandChild) => {
        Array.from(Array(100)).forEach((_, i) => {
          grandChild.append(String(i));
        });
      });
    });

    node.childNodes[0].childNodes[0].childNodes[0].append(lookingFor);

    expect(node.depthSearch(lookingFor)).toBe(true);
    expect(spy).toHaveBeenCalledTimes(5);
  });

  it("Should not find via depth search if node doesn't exist in child tree", () => {
    const graph = new Graph<string>();
    const node = graph.createNode("start");
    const nope = graph.createNode("nope");

    const spy = jest.spyOn(node, "depthSearch");

    Array.from(Array(3)).forEach((_, i) => {
      node.append(String(i) + " child");
    });
    node.childNodes.forEach((child, j) => {
      Array.from(Array(3)).forEach((_, i) => {
        child.append(String(i) + String(j) + " grandchild");
      });
      child.childNodes.forEach((grandChild, k) => {
        Array.from(Array(3)).forEach((_, i) => {
          grandChild.append(
            String(i) + String(j) + String(k) + " great-grandchild"
          );
        });
      });
    });

    expect(node.depthSearch(nope)).toBe(false);
    expect(spy).toHaveBeenCalledTimes(40);
  });

  it("Should find nodes via breadth search", () => {
    const graph = new Graph<string>();
    const node = graph.createNode("start");
    const lookingFor = graph.createNode("finish");
    const nope = graph.createNode("nope");

    Array.from(Array(10)).forEach((_, i) => {
      node.append(String(i));
    });
    node.childNodes.forEach((child) => {
      Array.from(Array(10)).forEach((_, i) => {
        child.append(String(i));
      });
      child.childNodes.forEach((grandChild) => {
        Array.from(Array(10)).forEach((_, i) => {
          grandChild.append(String(i));
        });
      });
    });

    node.childNodes[0].childNodes[0].childNodes[0].append(lookingFor);

    expect(node.breadthSearch(lookingFor)).toBe(true);
    expect(node.breadthSearch(nope)).toBe(false);
  });

  it("Should get shortest path", () => {
    const graph = new Graph<string>();
    const node = graph.createNode("0,0");
    const nope = graph.createNode("nope");
    const destination = graph.createNode("2,2");
    node.append("1,0").append("2,0").append("2,1").append(destination);

    const path = node.shortestPath(destination);
    const noSolution = node.shortestPath(nope);
    expect(path?.map((n) => n.value)).toEqual([
      "0,0",
      "1,0",
      "2,0",
      "2,1",
      "2,2",
    ]);
    expect(noSolution).toBe(null);
  });

  it("Should find nodes", () => {
    const graph = new Graph<number>();
    const node = graph.createNode(0).append(1).append(2).append(3).append(4);
    expect(graph.findNode(n => n.value == 4)).toBe(node);
    expect(graph.findAllNodes(n => n.value == 4)).toEqual([node]);
    expect(graph.findNode(n => n.value == 5)).toBe(undefined);
    expect(graph.findAllNodes(n => n.value == 5)).toEqual([]);
  });
});
