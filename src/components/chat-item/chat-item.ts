import ChatItemTmpl from './chat-item.hbs?raw'
import Block, { Props } from '../../core/Block';
import isEqual from "../../utils/isEqual";

export class ChatItem extends Block {
    constructor(props: Props) {
        super({
            ...props,
            select: () => (props?.chat.id === props?.currentChat),
            events: {
                click: (e: Event) => {
                    if (!e) return;
                    e.preventDefault();
                    if (props.onSetCurrentChat) {
                        props.onSetCurrentChat.call(this, this.props?.chat.id);
                    }
                },
            },
        });
    }

    protected componentDidUpdate(oldProps: Props, newProps: Props): boolean {
        return !isEqual(oldProps, newProps);
    }

    render(): string {
        return ChatItemTmpl;
    }
}
