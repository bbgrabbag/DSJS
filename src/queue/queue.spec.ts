import { Queue, QueueStack } from ".";

describe("Queue data structure", () => {
  it("Should initialize as empty", () => {
    const queue = new Queue();
    expect(queue.peek()).toBe(null);
    expect(queue.length).toBe(0);
    expect(() => queue.dequeue()).toThrowError(
      "Cannot dequeue from an empty queue"
    );
  });

  it("Should add items to the end", () => {
    const queue = new Queue();
    queue.enqueue(1);
    expect(queue.length).toBe(1);
    expect(queue.peek()).toBe(1);
    queue.enqueue(2);
    expect(queue.length).toBe(2);
    expect(queue.peek()).toBe(1);
  });

  it("Should remove items from the bottom", () => {
    const queue = new Queue<number>();
    let i = 0;
    const length = 5;
    while (++i < length) queue.enqueue(i);
    let j = 0;
    while (++j < length) {
      expect(queue.dequeue()).toBe(j);
      expect(queue.length).toBe(length - j - 1);
    }
    expect(queue.peek()).toBe(null);
    expect(() => queue.dequeue()).toThrowError(
      "Cannot dequeue from an empty queue"
    );
  });
});

describe("QueueStack data structure", () => {
  it("Should initialize empty", () => {
    const queue = new QueueStack<number>();
    expect(queue.length).toBe(0);
    expect(queue.peek()).toBe(null);
  });

  it("Should add items", () => {
    const queue = new QueueStack<number>();
    let i = 0;
    while (++i < 10) {
      queue.enqueue(i);
      expect(queue.length).toBe(i);
      expect(queue.peek()).toBe(1);
    }
  });

  it("Should remove items", () => {
    const queue = new QueueStack<number>();
    let i = 0;
    while (++i < 5) {
      queue.enqueue(i);
    }
    i = 0;
    while (++i < 4) {
      const value = queue.dequeue();
      expect(value).toBe(i);
      expect(queue.length).toBe(4 - i);
      expect(queue.peek()).toBe(i + 1);
    }
    const value = queue.dequeue();
    expect(value).toBe(4);
    expect(queue.peek()).toBe(null);
    expect(queue.length).toBe(0);
    expect(() => queue.dequeue()).toThrowError(
      "Cannot dequeue from an empty queue"
    );
  });

  it("Should add and remove items", () => {
    const queue = new QueueStack<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    expect(queue.length).toBe(3);
    queue.dequeue();
    expect(queue.peek()).toBe(2);
    expect(queue.length).toBe(2);
    queue.enqueue(4);
    expect(queue.length).toBe(3);
    expect(queue.peek()).toBe(2);
    queue.dequeue();
    queue.dequeue();
    expect(queue.length).toBe(1);
    expect(queue.peek()).toBe(4);
    queue.dequeue();
    expect(queue.length).toBe(0);
    expect(queue.peek()).toBe(null);
  });
});
