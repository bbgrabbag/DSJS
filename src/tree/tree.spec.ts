import { TreeNode, Tree } from './tree';

describe('Tree Node', () => {
    it('Should initialize empty', () => {
        const node = new TreeNode<number>(10);
        expect(node.size).toBe(2);
        expect(node.value).toBe(10);
        expect(node.childrenLength).toBe(0);
        expect(node.getChildNode(0)).toBe(null);
        expect(node.getChildNode(1)).toBe(null);
        expect(() => node.getChildNode(10)).toThrowError('Invalid index (10)');
        expect(() => node.getChildNode(-10)).toThrowError('Invalid index (-10)');
    });

    it('Should add items', () => {
        const node = new TreeNode<number>(1);
        node.insert(new TreeNode<number>(2), 0);
        expect(node.childrenLength).toBe(1);
        expect(node.getChildNode(0)?.value).toBe(2);
        expect(() => node.insert(new TreeNode<number>(10), 10)).toThrowError('Invalid index (10). Attempting to add children which exceeds capacity');
    });

    it('Should remove items', () => {
        const node = new TreeNode<number>(1);
        node.insert(new TreeNode<number>(2), 0);
        node.remove(0);
        expect(node.childrenLength).toBe(0);
        expect(() => node.remove(-1)).toThrowError('Invalid index (-1)');
        expect(() => node.remove(0)).toThrowError('Node does not exist at index (0)');
    });
});

describe('Tree', () => {
    it('Should initialze node', () => {
        const node = Tree.createNode(1, 2);
        expect(node.value).toBe(1);
    });

    it('Should depth traverse', () => {
        const node = Tree.createNode(1, 3);
        node.insert(Tree.createNode(2, 3), 0);
        node.insert(Tree.createNode(3, 3), 1);
        node.insert(Tree.createNode(4, 3), 2);

        node.getChildNode(0).insert(Tree.createNode(2.1, 3), 0);
        node.getChildNode(0).insert(Tree.createNode(2.2, 3), 1);
        node.getChildNode(0).insert(Tree.createNode(2.3, 3), 2);

        expect(Tree.depthTraverse(node)).toEqual([1, 2, 2.1, 2.2, 2.3, 3, 4]);
    });
});