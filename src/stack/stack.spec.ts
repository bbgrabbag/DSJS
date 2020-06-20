import { Stack } from '.';

describe('Stacks', () => {
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