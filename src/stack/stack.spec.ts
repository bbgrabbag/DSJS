import { Stack, ArrayStack, IntStack, StackSet, SortStack } from '.';

describe('Stacks', () => {
    it('Should initialize as empty', () => {
        const stack = new Stack<void>();
        expect(stack.length).toBe(0);
    });

    it('Should add items to the stack', () => {
        const stack = new Stack<number>();
        stack.push(1);
        expect(stack.peek()).toBe(1);
        stack.push(2);
        expect(stack.peek()).toBe(2);
        stack.push(3);
        expect(stack.peek()).toBe(3);
        expect(stack.length).toBe(3);
    });

    it('Should remove items from the top', () => {
        const stack = new Stack<number>();
        let i = 0;
        while (++i < 10) stack.push(i);
        expect(stack.peek()).toBe(9);
        expect(stack.length).toBe(9);
        while (--i > 0) expect(stack.pop()).toBe(i);
        expect(stack.peek()).toBe(null);
        expect(stack.length).toBe(0);

        expect(() => stack.pop()).toThrowError('Cannot remove from empty stack');
    });
});

describe('Array Stacks', () => {
    it('Should initialize as empty with default or specified size', () => {
        const stack = new ArrayStack();
        expect(stack.peek()).toBe(null);
        expect(stack.size).toBe(256);
        expect(stack.length).toBe(0);
    });
    it('Should add items', () => {
        const stack = new ArrayStack(3);
        expect(stack.size).toBe(3);
        expect(stack.length).toBe(0);
        stack.add(1);
        expect(stack.peek()).toBe(1);
        stack.add(2);
        expect(stack.peek()).toBe(2);
        stack.add(3);
        expect(stack.peek()).toBe(3);
        expect(stack.size).toBe(3);
        expect(stack.length).toBe(3);
        expect(() => stack.add(4)).toThrowError('Stack has reached maximum capacity');
    });
    it('Should remove items', () => {
        const stack = new ArrayStack(3);
        stack.add(1);
        stack.add(2);
        stack.add(3);
        expect(stack.pop()).toBe(3);
        expect(stack.pop()).toBe(2);
        expect(stack.pop()).toBe(1);
        expect(stack.size).toBe(3);
        expect(stack.length).toBe(0);
        expect(() => stack.pop()).toThrowError('Cannot remove from empty stack');
    });
});


describe('Int Stack', () => {
    it('Should initialize as null', () => {
        const stack = new IntStack();
        expect(stack.length).toBe(0);
        expect(stack.peek()).toBe(null);
        expect(stack.min).toBe(null);
    });
    it('Should add items and track min', () => {
        const stack = new IntStack();
        stack.push(1);
        expect(stack.length).toBe(1);
        expect(stack.min).toBe(1);
        expect(stack.peek()).toBe(1);
        stack.push(2);
        expect(stack.length).toBe(2);
        expect(stack.min).toBe(1);
        expect(stack.peek()).toBe(2);
        stack.push(-10);
        expect(stack.length).toBe(3);
        expect(stack.min).toBe(-10);
        expect(stack.peek()).toBe(-10);
        stack.push(3);
        expect(stack.length).toBe(4);
        expect(stack.min).toBe(-10);
        expect(stack.peek()).toBe(3);
    });

    it('Should remove items and update min', () => {
        const stack = new IntStack();
        const ints = Array.from(Array(100)).map(() => Math.floor(Math.random() * 500));
        ints.forEach((x, i) => {
            stack.push(x);
            const min = Math.min(...ints.slice(0, i + 1));
            expect(stack.min).toBe(min);
            expect(stack.peek()).toBe(ints[i]);
        });
        expect(stack.length).toBe(ints.length);

        ints.forEach((x, i) => {
            const min = Math.min(...ints.slice(0, ints.length - i));
            expect(stack.min).toBe(min);
            expect(stack.pop()).toBe(ints[ints.length - i - 1]);
        });

        expect(stack.length).toBe(0);
        expect(stack.min).toBe(null);
        expect(stack.peek()).toBe(null);

        expect(() => stack.pop()).toThrowError('Cannot remove from empty stack');

    });
});

describe('Stack Set', () => {
    it('Should initialize empty', () => {
        const stack = new StackSet<number>();
        expect(stack.length).toBe(0);
        expect(stack.size).toBe(256);
    });
    it('Should add new items', () => {
        const stack = new StackSet<number>(3);
        expect(stack.size).toBe(3);
        stack.push(1);
        stack.push(2);
        stack.push(3);
        expect(stack.length).toBe(3);
        stack.push(4);
        expect(stack.length).toBe(4);
    });

    it('Should remove items', () => {
        const stack = new StackSet<number>(3);
        let i = 0;
        while (++i < 5) {
            stack.push(i);
        }
        expect(stack.length).toBe(4);
        while (--i > 0) {
            expect(stack.pop()).toBe(i);
        }
        expect(stack.length).toBe(0);
        expect(() => stack.pop()).toThrowError('Cannot remove from empty stack');

    });
});

describe('Sort Stack', () => {
    it('Should intialize as empty', () => {
        const stack = new SortStack<number>();
        expect(stack.length).toBe(0);
        expect(stack.peek()).toBe(null);
        expect(() => stack.pop()).toThrowError('Cannot remove from empty stack');
    });

    it('Should add items and order them', () => {
        const stack = new SortStack<number>();
        const ints = Array.from(Array(100)).map(() => Math.floor(Math.random()));

        let i = 0;
        while (i < ints.length) {
            stack.push(ints[i]);
            expect(stack.length).toBe(i + 1);
            expect(stack.peek()).toBe(Math.min(...ints.slice(0, i + 1)));
            i++;
        }
    });

    it('Should remove the min item', () => {
        const stack = new SortStack<number>();
        const ints = Array.from(Array(100)).map(() => Math.floor(Math.random()));
        const sorted = ints.sort((x, y) => x <= y ? -1 : 1);

        ints.forEach(x => stack.push(x));
        let i = 0;
        while (i < ints.length) {
            const value = stack.pop();
            expect(value).toBe(sorted[i]);
            expect(stack.length).toBe(ints.length - i - 1);
            i++;
        }
    });

    it('Should support custom sort', () => {
        const stack = new SortStack<string>((x, y) => x > y ? -1 : 1);
        stack.push('a');
        expect(stack.peek()).toBe('a');
        stack.push('c');
        expect(stack.peek()).toBe('c');
        stack.push('b');
        expect(stack.peek()).toBe('c');
    });
});