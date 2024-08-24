import Block from './Block';

export function render(rootQuery: string, block: Block) {
    const root = document.querySelector(rootQuery) as HTMLElement;

    if (root) {
        root.innerHTML = '';
        const content = block.getContent();
        if (content) {
            root.appendChild(content);
        }

        block.dispatchComponentDidMount();

        return root;
    }

    return null;
}
