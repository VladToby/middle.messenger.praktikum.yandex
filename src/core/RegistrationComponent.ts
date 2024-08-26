import Handlebars from 'handlebars';
import Block from "./Block";

export function registerComponent(name: string, Component: typeof Block) {
    if (!Handlebars.helpers[name]) {
        Handlebars.registerHelper(name, function (this: any, {hash, data, fn}) {
            const component: Block = new Component(hash);
            const id: string = `${name}-${component.id}`;

            if (hash.ref) {
                (data.root.__refs = data.root.__refs || {})[hash.ref] = component;
            }

            (data.root.__children = data.root.__children || {})[id] = component;

            const contents = fn ? fn(this) : '';


            return `<div data-id="${id}">${contents}</div>`;
        });
    }
}
