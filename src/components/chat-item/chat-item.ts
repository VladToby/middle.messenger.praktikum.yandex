import ChatItemTmpl from './chat-item.hbs?raw'
import Block, { Props } from '../../core/Block';
import ChatController from '../../controllers/ChatController';

export class ChatItem extends Block {
    constructor(props: Props) {
        super({
            ...props,
            select: () => (props?.id === props?.currentChat),
            events: {
                click: (e: Event) => {
                    e.preventDefault();
                    const chatId = this.props.chat.id;
                    if (chatId !== undefined) {
                        ChatController.setCurrentChat(chatId);
                    } else {
                        console.error('Chat id is undefined');
                    }
                },
            },
        });
    }

    protected componentDidUpdate(_oldProps: Props, _newProps: Props): boolean {
        return true;
    }

    render(): string {
        return ChatItemTmpl;
    }
}
