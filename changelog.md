2-21-2021

- Trie completed.

*Notes on Trie: Using a graph with keys as letters instead of an array would dramatically increase efficiency. For example:*

```js
class TrieNode {
    private _value: Alphabet;
    private _children: Record<Alphabet, TrieNode | null>;
    private _isTerminal: boolean;

    constructor(value: Alphabet, isTerminal: boolean){
        this._value = value;
        this._isTerminal = isTerminal;
    }
    // ...
}
```
