import './chat-list.less';
import Block, {Props} from '../../core/Block';
import ChatListTemplate from './chat-list.hbs?raw';
import ChatController from '../../controllers/ChatController';
import { connect } from '../../utils/connect';

export class ChatListBase extends Block {
    constructor(props: Props) {
        super({
            ...props,
            onSetCurrentChat: (id: number | undefined) => {
                ChatController.setCurrentChat(id);
            },
        });
    }

    render(): string {
        return ChatListTemplate;
    }
}

export const ChatList = connect((state) => {
    return {
        chats: state.chats || [],
        currentChat: state.currentChat,
        selectedChat: state.selectedChat,
    };
})(ChatListBase);
