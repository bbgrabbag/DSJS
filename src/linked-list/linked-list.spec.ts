import { LinkedList, LinkedListNode } from '.';

describe('Linked list nodes', () => {
    it('Should initialize with or without a null value', () => {
        const node = new LinkedListNode<number>(10);
        expect(node.value).toBe(10);
        expect(node.next).toBeNull();
    });
    it('Should be able to set new node values', () => {
        const node = new LinkedListNode<number>(10);
        node.value = 5;
        expect(node.value).toBe(5);
    });
    it('Should insert nodes correctly', () => {
        const node = new LinkedListNode<number>(1);
        node.next = new LinkedListNode<number>(3);
        expect(node.value).toBe(1);
        expect(node.next.value).toBe(3);

        node.next = new LinkedListNode<number>(2);
        expect(node.next.value).toBe(2);
        expect(node.next?.next?.value).toBe(3);

        node.next = null;
        expect(node.next).toBeNull();

    });
});

describe('Linked list', () => {
    it('Should initialize with no value', () => {
        const ll = new LinkedList<number>();
        expect(ll.constructor.name).toBe('LinkedList');
        expect(ll.head).toBeNull();
    });

    it('Should initialize with single value', () => {
        const ll = new LinkedList<number>(5);
        expect(ll.head?.value).toBe(5);
        expect(ll.head?.next).toBeNull();
    });

    it('Should initialize with node', () => {
        const node = new LinkedListNode<number>(5);
        node.next = new LinkedListNode<number>(3);
        const ll = new LinkedList<number>(node);
        expect(ll.head?.value).toBe(5);
        expect(ll.head?.next?.value).toBe(3);
        expect(ll.head?.next?.next).toBeNull();
    });

    it('Should initialize with array of values', () => {

        const ll = new LinkedList<number>([1, 2, 3]);
        expect(ll.head?.value).toBe(1);
        expect(ll.head?.next?.value).toBe(2);
        expect(ll.head?.next?.next?.value).toBe(3);
        expect(ll.head?.next?.next?.next).toBe(null);
    });

    it('Should iterate over node values in list', () => {
        const ll = new LinkedList<number>([1, 2, 3, 4, 5]);
        expect([...ll]).toEqual([1, 2, 3, 4, 5]);
    });
    it('Should append nodes to the list', () => {
        const ll = new LinkedList<number>();
        ll.append(1);
        expect(ll.head?.value).toBe(1);
        ll.append(2);
        expect(ll.head?.next?.value).toBe(2);

    });
    it('Should prepend nodes to the list', () => {
        const ll = new LinkedList<number>();
        ll.prepend(1);
        expect(ll.head?.value).toBe(1);
        ll.prepend(2);
        expect(ll.head?.value).toBe(2);
        expect(ll.head?.next?.value).toBe(1);

    });

    it('Should remove node from the list', () => {
        const ll = new LinkedList<number>([1, 2, 3, 4]);
        ll.remove(ll.head as LinkedListNode<number>);
        expect(ll.head?.value).toBe(2);
        ll.remove(ll.head?.next as LinkedListNode<number>);
        expect(ll.head?.next?.value).toBe(4);
        expect(ll.head?.value).toBe(2);

    });
    it('Should find a node from the list', () => {
        const ll = new LinkedList<number>([1, 2, 3, 4]);
        const node = ll.find(n => n.value === 3);
        expect(node).toEqual(ll.head?.next?.next);
        const nothing = ll.find(n => n.value === 10);
        expect(nothing).toBeUndefined();
    });
});