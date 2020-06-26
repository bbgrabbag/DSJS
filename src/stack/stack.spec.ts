import { Stack, ArrayStack } from '.';

xdescribe('Stacks', () => {
    it('Should initialize as empty', () => {
        const stack = new Stack<void>();
        expect(stack.isEmpty).toBe(true);
    });

    it('Should add items to the stack', () => {
        const stack = new Stack<number>();
        stack.push(1);
        expect(stack.peek()).toBe(1);
        stack.push(2);
        expect(stack.peek()).toBe(2);
        stack.push(3);
        expect(stack.peek()).toBe(3);
    });

    it('Should remove items from the top', () => {
        const stack = new Stack<number>();
        let i = 0;
        while (++i < 10) stack.push(i);
        expect(stack.peek()).toBe(9);
        while (--i > 0) expect(stack.pop()).toBe(i);
        expect(stack.peek()).toBe(null);
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
        expect(() => stack.pop()).toThrowError('Cannnot remove from empty stack');
    });
});