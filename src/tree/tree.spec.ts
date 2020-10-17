import {
    TreeNode,
    Tree,
    BinaryTree,
    BinaryTreeNode,
    Heap,
    TrieNode
} from '.';

describe('Tree Node', () => {
    it('Should initialize empty', () => {
        const node = new TreeNode<number>(10);
        expect(node.size).toBe(2);
        expect(node.value).toBe(10);
        expect(node.children.length).toBe(0);
        expect(node.getChildNode(0)).toBe(null);
        expect(node.getChildNode(1)).toBe(null);
        expect(() => node.getChildNode(10)).toThrowError('Invalid index (10)');
        expect(() => node.getChildNode(-10)).toThrowError('Invalid index (-10)');
    });

    it('Should add items', () => {
        const node = new TreeNode<number>(1);
        node.insert(new TreeNode<number>(2), 0);
        expect(node.children.length).toBe(1);
        expect(node.getChildNode(0)?.value).toBe(2);
        expect(() => node.insert(new TreeNode<number>(10), 10)).toThrowError('Invalid index (10). Attempting to add children which exceeds capacity');
    });

    it('Should remove items', () => {
        const node = new TreeNode<number>(1);
        node.insert(new TreeNode<number>(2), 0);
        node.remove(0);
        expect(node.children.length).toBe(0);
        expect(() => node.remove(-1)).toThrowError('Invalid index (-1)');
        expect(() => node.remove(0)).toThrowError('Node does not exist at index (0)');
    });
});

describe('Tree', () => {
    it('Should initialize node', () => {
        const node = Tree.createNode(1, 2);
        expect(node.value).toBe(1);
    });

    it('Should depth traverse', () => {
        const node = Tree.createNode(1, 3);
        node.insert(Tree.createNode(2, 3), 0);
        node.insert(Tree.createNode(3, 3), 1);
        node.insert(Tree.createNode(4, 3), 2);

        node.getChildNode(0)?.insert(Tree.createNode(2.1, 3), 0);
        node.getChildNode(0)?.insert(Tree.createNode(2.2, 3), 1);
        node.getChildNode(0)?.insert(Tree.createNode(2.3, 3), 2);

        expect(Tree.depthTraverse(node)).toEqual([1, 2, 2.1, 2.2, 2.3, 3, 4]);
    });
});

describe('Binary Tree', () => {
    it('Should create a BinaryTreeNode', () => {
        const node = BinaryTree.createNode(1);
        expect(node instanceof BinaryTreeNode).toBe(true);
        expect(node.size).toBe(2);
        expect(node.children.length).toBe(0);
    });

    it('Should traverse in order', () => {
        const node = BinaryTree.createNode(1);
        node.insert(BinaryTree.createNode(0), 0);
        node.insert(BinaryTree.createNode(2), 1);

        node.getChildNode(0)?.insert(BinaryTree.createNode(-1), 0);
        node.getChildNode(0)?.insert(BinaryTree.createNode(.5), 1);

        node.getChildNode(1)?.insert(BinaryTree.createNode(1.5), 0);
        node.getChildNode(1)?.insert(BinaryTree.createNode(3), 1);

        expect(BinaryTree.inOrderTraversal(node)).toEqual([-1, 0, .5, 1, 1.5, 2, 3]);

    });
    it('Should traverse pre order', () => {
        const node = BinaryTree.createNode(1);
        node.insert(BinaryTree.createNode(0), 0);
        node.insert(BinaryTree.createNode(2), 1);


        node.getChildNode(0)?.insert(BinaryTree.createNode(.5), 1);
        node.getChildNode(0)?.insert(BinaryTree.createNode(-1), 0);
        node.getChildNode(1)?.insert(BinaryTree.createNode(1.5), 0);
        node.getChildNode(1)?.insert(BinaryTree.createNode(3), 1);

        expect(BinaryTree.preOrderTraversal(node)).toEqual([1, 0, -1, .5, 2, 1.5, 3]);

    });

    it('Should traverse post order', () => {
        const node = BinaryTree.createNode(1);
        node.insert(BinaryTree.createNode(0), 0);
        node.insert(BinaryTree.createNode(2), 1);

        node.getChildNode(0)?.insert(BinaryTree.createNode(-1), 0);
        node.getChildNode(0)?.insert(BinaryTree.createNode(.5), 1);

        node.getChildNode(1)?.insert(BinaryTree.createNode(1.5), 0);
        node.getChildNode(1)?.insert(BinaryTree.createNode(3), 1);

        expect(BinaryTree.postOrderTraversal(node)).toEqual([3, 2, 1.5, 1, .5, 0, -1]);

    });
});

describe('Heap', () => {
    it('Should initialize', () => {
        const heap = new Heap<number>();
        expect(heap.root).toBeUndefined();
        expect(heap.size).toBe(0);

        const heap2 = new Heap(1);
        expect(heap2.root).toBe(1);
        expect(heap2.size).toBe(1);
    });

    it('Should add values', () => {
        const heap = new Heap(1);
        expect(heap.append(-1)).toBe(2);
        expect(heap.root).toBe(-1);

        expect(heap.append(2)).toBe(3);
        expect(heap.root).toBe(-1);

        heap.append(-1);
        expect(heap.root).toBe(-1);

        const cases = Array.from(Array(500)).map(() => Math.floor(Math.random() * 100));

        const heap2 = new Heap<number>();
        cases.forEach((x, i) => {
            heap2.append(x);
            expect(heap2.root).toBe(Math.min(...cases.slice(0, i + 1)));
        });

        const heap3 = new Heap<number>(undefined, (x, y) => x > y ? -1 : x < y ? 1 : 0);
        cases.forEach((x, i) => {
            heap3.append(x);
            expect(heap3.root).toBe(Math.max(...cases.slice(0, i + 1)));
        });
    });

    it('Should extract values (both min and max heaps)', () => {
        const minHeap = new Heap(1);
        expect(minHeap.extractRoot()).toBe(1);
        expect(minHeap.root).toBeUndefined();

        const cases = Array.from(Array(500)).map(() => Math.floor(Math.random() * 100));
        cases.forEach(c => minHeap.append(c));

        while (minHeap.root !== undefined) {
            const min = Math.min(...cases);
            const root = minHeap.extractRoot() as number;
            expect(root).toBe(min);
            cases.splice(cases.indexOf(root), 1);
        }

        const heap3 = new Heap<number>(undefined, (x, y) => x > y ? -1 : x < y ? 1 : 0);
        const maxCases = Array.from(Array(500)).map(() => Math.floor(Math.random() * 100));
        maxCases.forEach(x => heap3.append(x));

        while (heap3.root !== undefined) {
            const max = Math.max(...maxCases);
            const root = heap3.extractRoot() as number;
            expect(root).toBe(max);
            maxCases.splice(maxCases.indexOf(root), 1);
        }
    });
});

fdescribe('Trie Node', () => {
    it('Should initialize', () => {
        const node = new TrieNode('A', 32);
        expect(node instanceof TrieNode);
        expect(node.value).toBe('A');
        expect(node.size === 32);
        expect(node.isTerminal).toBe(false);
        expect(node.children).toEqual([]);
        expect(node.getChildNode(0)).toBeNull();
        expect(() => node.getChildNode(33)).toThrow('Invalid index (33)');
    });

    it('Should not allow inserting to a terminal node', () => {
        const node = new TrieNode(100, 16, true);
        expect(node.isTerminal);
        expect(() => node.insert(new TrieNode(101, 16), 0)).toThrow(`Invalid operation: TrieNode attribute 'isTerminal' is true`);
    });
});