import { Stack, ArrayStack, IntStack } from '.';

xdescribe('Stacks', () => {
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

xdescribe('Array Stacks', () => {
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
        expect(() => stack.pop()).toThrowError('Cannnot remove from empty stack');
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
        const ints = [4, 2, 5, 9, -1, 2];
        ints.forEach((x, i) => {
            stack.push(x);
            if (i === 0) expect(stack.min).toBe(4);
            if (i === 1) expect(stack.min).toBe(2);
            if (i === 2) expect(stack.min).toBe(2);
            if (i === 3) expect(stack.min).toBe(2);
            if (i === 4) expect(stack.min).toBe(-1);
            if (i === 5) expect(stack.min).toBe(-1);
        });
        expect(stack.length).toBe(ints.length);

        ints.forEach((x, i) => {
            if (i === 0) expect(stack.min).toBe(-1);
            if (i === 1) expect(stack.min).toBe(-1);
            if (i === 2) expect(stack.min).toBe(2);
            if (i === 3) expect(stack.min).toBe(2);
            if (i === 4) expect(stack.min).toBe(2);
            if (i === 5) expect(stack.min).toBe(4);
            stack.pop();
        });

        expect(stack.length).toBe(0);
        expect(stack.min).toBe(null);
        expect(stack.peek()).toBe(null);

        expect(() => stack.pop()).toThrowError('Cannot remove from empty stack');

    });
});