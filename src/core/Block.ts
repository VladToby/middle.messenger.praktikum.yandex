import { EventBus } from './EventBus';
import Handlebars from 'handlebars';
import { v4 as makeUUID } from 'uuid';
import { Indexed } from "../utils/utils";
import isEqual from "../utils/isEqual";

export type Events = Record<string, () => void>;
export type Props = Record<string, unknown>;
export type Children = Record<string, Element | Block>;
export type BlockType = {
    new(propsAndParent: Props): Block
};

class Block {
    static EVENTS: Record<string, string> = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_CDU: "flow:component-did-update",
        FLOW_CWU: 'flow:component-will-unmount',
        FLOW_RENDER: "flow:render"
    } as const;

    _element: HTMLElement | null = null;
    props: Props;
    id: string = makeUUID();
    children: Children;
    eventBus: () => EventBus;

    constructor(propsAndChildren: Props | Children) {
        const eventBus = new EventBus();
        const { props, children} = this._getChildrenAndProps(propsAndChildren);

        this.id = makeUUID();
        this.children = children;
        this.props = this._makePropsProxy({ ...props, __id: this.id });

        this.eventBus = () => eventBus;

        this._registerEvents(eventBus);
        eventBus.emit(Block.EVENTS.INIT);
    }

    private _getChildrenAndProps(propsAndChildren: Props): { props: Props, children: Children } {
        const props: Props = {};
        const children: Children = {};

        Object.entries(propsAndChildren).forEach(([key, value]) => {
            if (value instanceof Block || value instanceof Element) {
                children[key] = value;
            } else {
                props[key] = value;
            }
        });

        return { props, children };
    }

    private _addEvents() {
        const { events = {} } = this.props as { events: Record<string, () => void> }

        Object.keys(events).forEach(eventName => {
            this._element?.addEventListener(eventName, events[eventName], true)
        })
    }

    private _removeEvents() {
        const { events = {} } = this.props as { events: Events };

        Object.keys(events).forEach((eventName) => {
            this._element?.removeEventListener(eventName, events[eventName]);
        });
    }

    private _registerEvents(eventBus: EventBus): void {
        eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CWU, this._componentWillUnmount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    private _init() {
        this.init();

        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    public init() {
    }

    private _componentDidMount(): void {
        this.componentDidMount();

        Object.values(this.children).forEach(child => {
            if (child instanceof Block) {
                child.dispatchComponentDidMount();
            }
        });
    }

    public componentDidMount(): void {}

    public dispatchComponentDidMount(): void {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);

        Object.values(this.children).forEach((child: Block | Element): void => {
            if (child instanceof Block) {
                child.dispatchComponentDidMount();
            }
        });
    }

    private _componentDidUpdate(oldProps: Props, newProps: Props) {
        const response = this.componentDidUpdate(oldProps, newProps);
        if (response) {
            this._render();
        }
    }

    protected componentDidUpdate(oldProps: Props, newProps: Props) {
        return isEqual(oldProps, newProps);
    }

    protected _componentWillUnmount() {
        this.componentWillUnmount();
    }

    public componentWillUnmount() {}

    public setProps = (nextProps: Props) => {
        if (!nextProps) {
            return;
        }

        const oldProps = { ...this.props };
        Object.assign(this.props, nextProps);
        this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, this.props);
    }

    private _render() {
        const fragment = this._compile();

        const newElement = fragment.firstElementChild as HTMLElement;

        if (this._element) {
            this._removeEvents();
            this._element.replaceWith(newElement);
        }

        this._element = newElement;

        this._addEvents();

        Object.values(this.children).forEach(child => {
            if (child instanceof Block) {
                child.forceUpdate();
            }
        });
    }

    private _compile(): DocumentFragment {
        const template = this.render();
        const fragment = document.createElement('template');

        const context = {
            ...this.props,
            __children: this.children,
        };

        fragment.innerHTML = Handlebars.compile(template)(context);

        Object.entries(this.children).forEach(([id, child]) => {
            const stub = fragment.content.querySelector(`[data-id="${id}"]`);
            if (!stub) {
                return;
            }

            if (child instanceof Block) {
                const content = child.getContent();
                if (content) {
                    stub.replaceWith(content);
                }
            } else if (child instanceof Element) {
                stub.replaceWith(child);
            }
        });

        return fragment.content;
    }

    public render(): string {
        return '';
    }

    public getContent() {
        if (!this._element) {
            return this._createDocumentElement('template');
        }

        return this._element;
    }

    private _makePropsProxy(props: Props) {
        const self = this;

        return new Proxy(props, {
            get(target: Props, prop: string) {
                const value = target[prop];
                return typeof value === "function" ? value.bind(target) : value;
            },
            set(target: Props, prop: string, value: unknown){
                const oldTarget = { ...target };
                target[prop] = value;

                self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
                return true;
            },
            deleteProperty() {
                throw new Error("Access denied");
            }
        });
    }

    private _createDocumentElement(tagName: string): HTMLElement {
        return document.createElement(tagName);
    }

    show() {
        const content = this.getContent();
        if (content) {
            content.style.display = '';
        }
    }

    hide() {
        const content = this.getContent();
        if (content) {
            content.style.display = 'none';
        }
    }

    static getStateToProps(_state: Indexed): Props {
        return {};
    }

    public forceUpdate() {
        this._render();
    }
}

export default Block;
