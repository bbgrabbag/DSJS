import { Queue } from '.';

describe('Queue data structure', () => {

    it('Should initialize as empty', () => {
        const queue = new Queue();
        expect(queue.peek()).toBe(null);
        expect(queue.remove()).toBe(null);
        expect(queue.length).toBe(0);
    });

    it('Should add items to the end', () => {
        const queue = new Queue();
        queue.add(1);
        expect(queue.length).toBe(1);
        expect(queue.peek()).toBe(1);
        queue.add(2);
        expect(queue.length).toBe(2);
        expect(queue.peek()).toBe(1);
    });

    it('Should remove items from the bottom', () => {
        const queue = new Queue<number>();
        let i = 0;
        const length = 5;
        while (++i < length) queue.add(i);
        let j = 0;
        while (++j < length) {
            expect(queue.remove()).toBe(j);
            expect(queue.length).toBe(length - j - 1);
        }
        expect(queue.peek()).toBe(null);
    });
});