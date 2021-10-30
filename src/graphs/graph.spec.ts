import {GraphNode} from './';

describe('Graph Node', () => {
    it('Should initialize', () => {
        const graphNode = new GraphNode(100);
        expect(graphNode.value).toBe(100);
        expect(graphNode.children).toEqual([]);
        expect(graphNode.length).toEqual(0);
    });

    it('Should insert and retrieve nodes and values', () => {
        const graphNode = new GraphNode(100);
        graphNode.append(101);
        graphNode.append(new GraphNode(102));

        expect(graphNode.length).toBe(2);
        const firstChild = graphNode.getNodeAtIndex(0) as GraphNode<number>;
        expect(firstChild.value).toBe(101);
        const secondChildValue = graphNode.getValueAtIndex(1) as number;
        expect(secondChildValue).toBe(102);
        const nonexistant = graphNode.getValueAtIndex(-1);
        expect(nonexistant).toBe(undefined);

    });

    it('Should update values', () => {
        const graphNode = new GraphNode(100);
        graphNode.value = 101;
        graphNode.append(200);
        graphNode.children[0].value = 202;
        
        expect(graphNode.value).toBe(101);
        expect(graphNode.children[0].value).toBe(202);
    });
});