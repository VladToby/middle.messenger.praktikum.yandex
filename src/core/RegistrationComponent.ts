import Handlebars from 'handlebars';
import Block from "./Block";

export function registerComponent(name: string, Component: typeof Block) {
    Handlebars.registerHelper(name, function(this: any, { hash, data }) {
        const component: Block = new Component(hash);
        const id = `${name}-${component.id}`;

        if (hash.ref) {
            (data.root.__refs = data.root.__refs || {})[hash.ref] = component;
        }

        (data.root.__children = data.root.__children || {})[id] = component;

        return `<div data-id="${id}"></div>`;
    });
}
