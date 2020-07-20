import { LinkedList, LinkedListNode } from '.';

fdescribe('Linked List v2', () => {
    it('Should initialize empty', () => {
        const node = LinkedList.createNode(1);
        expect(node instanceof LinkedListNode);
        expect(node.value).toBe(1);
        expect(node.next).toBe(null);

        const ll = new LinkedList();
        expect(ll.head).toBe(null);
        expect(ll.last).toBe(null);

        const ll2 = new LinkedList(1);
        expect(ll2.head?.value).toBe(1);
        expect(ll2.last?.value).toBe(1);

    });

    it('Should insert items', () => {
        const node = LinkedList.createNode(1);
        LinkedList.insert(2, node);
        expect(node.next?.value).toBe(2);
        LinkedList.insert(3, node);
        expect(node.next?.value).toBe(3);
        expect(node.next?.next?.value).toBe(2);
    });

    it('Should prepend items', () => {
        const node = LinkedList.createNode(1);
        const prev = LinkedList.prepend(2, node);
        expect(prev.value).toBe(2);
        expect(prev.next).toBe(node);
    });

    it('Should set new head', () => {
        const ll = new LinkedList(1);
        ll.prepend(0);

        expect(ll.head?.value).toBe(0);
        expect(ll.head?.next?.value).toBe(1);
        expect(ll.last).toBe(ll.head?.next);

    });

    it('Should append to the end', () => {
        const ll = new LinkedList(1);
        ll.append(2);
        expect(ll.last?.value).toBe(2);
        expect(ll.head?.value).toBe(1);

        const ll2 = new LinkedList();
        ll2.append(1);
        expect(ll2.head?.value).toBe(1);
    });
});