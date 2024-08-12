import Block from './Block';

export function render(rootQuery: string, block: Block) {
    const root = document.querySelector(rootQuery);
    if (root) {
        root.innerHTML = '';
        root.append(block.getContent());
    }
}
