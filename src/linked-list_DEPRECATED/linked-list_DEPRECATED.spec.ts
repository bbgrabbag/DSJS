import { LinkedList, LinkedListNode, DoublyLinkedListNode } from '.';

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
    it('Should create nodes correctly', () => {
        const node = new LinkedListNode<number>(1);
        node.next = new LinkedListNode<number>(3);
        expect(node.value).toBe(1);
        expect(node.next?.value).toBe(3);

        node.next = new LinkedListNode<number>(2);
        expect(node.next?.value).toBe(2);
        expect(node.next?.next).toBe(null);

        node.next = null;
        expect(node.next).toBeNull();

    });
    it('Should insert nodes correctly', () => {
        const node = new LinkedListNode<number>(1);
        node.insert(2);
        expect(node.next?.value).toBe(2);
        node.insert(1.5);
        expect(node.next?.value).toBe(1.5);
        expect(node.next?.next?.value).toBe(2);
    });
});

describe('Linked list', () => {
    it('Should initialize with no value', () => {
        const ll = new LinkedList<number>();
        expect(ll.constructor.name).toBe('LinkedList');
        expect(ll.head).toBeNull();
    });
    it('Should initialize with null', () => {
        const ll = new LinkedList<number>(null);
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
        expect([...ll].length).toBe(2);
    });

    it('Should initialize with array of values', () => {

        const ll = new LinkedList<number>([1, 2, 3]);
        expect(ll.head?.value).toBe(1);
        expect(ll.head?.next?.value).toBe(2);
        expect(ll.head?.next?.next?.value).toBe(3);
        expect(ll.head?.next?.next?.next).toBe(null);
    });

    it('Should iterate over node values in list', () => {
        const ll = new LinkedList<{ key: string }>([
            { key: 'test' },
            { key: 'test1' },
            { key: 'test2' },
            { key: 'test3' },
        ]);
        expect([...ll]).toEqual([
            { key: 'test' },
            { key: 'test1' },
            { key: 'test2' },
            { key: 'test3' },
        ]);
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
        expect([...ll].length).toBe(2);
    });
    it('Should find a node from the list', () => {
        const ll = new LinkedList<number>([1, 2, 3, 4]);
        const node = ll.find(n => n.value === 3);
        expect(node).toEqual(ll.head?.next?.next);
        const nothing = ll.find(n => n.value === 10);
        expect(nothing).toBeUndefined();
    });

    it('Should loop through the list', () => {
        const ll = new LinkedList<number>([1, 2, 3, 4]);
        let x = 1;
        ll.forEach(node => {
            expect(node.value).toBe(x);
            x++;
        });
    });
});

describe('Doubly Linked List Node', () => {
    it('Should initialize with a value', () => {
        const node = new DoublyLinkedListNode<number>(1);
        expect(node.value).toBe(1);
        expect(node.next).toBe(null);
        expect(node.prev).toBe(null);
    });

    it('Should add items', () => {
        const node = new DoublyLinkedListNode<number>(1);
        node.next = new DoublyLinkedListNode<number>(2);
        node.next.next = new DoublyLinkedListNode<number>(3);

        expect(node.prev).toBe(null);
        expect(node.next.value).toBe(2);
        expect(node.next.prev).toBe(node);
        expect(node.next.next.value).toBe(3);
        expect(node.next.next.prev).toBe(node.next);
        expect(node.next.next.next).toBe(null);

    });

    it('Should nullify items', () => {
        const node = new DoublyLinkedListNode<number>(1);
        const second = node.next = new DoublyLinkedListNode<number>(2);
        const third = node.next.next = new DoublyLinkedListNode<number>(3);

        third.prev = null;
        expect(second.next).toBe(null);
        node.next = null;
        expect(second.prev).toBe(null);

    });
});