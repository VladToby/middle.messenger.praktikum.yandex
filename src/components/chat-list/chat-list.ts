import Block, {Props} from '../../core/Block';
import ChatListTemplate from './chat-list.hbs?raw';
import ChatController from '../../controllers/ChatController';
import { connect } from '../../utils/connect';

export class ChatListBase extends Block {
    constructor(props: Props) {
        super({
            ...props,
            onSetCurrentChat: (id: number) => {
                ChatController.setCurrentChat(id);
            },
        });

        setInterval(() => {
            ChatController.getChats();
        }, 5000);
    }

    init() {
        this.loadChats();
    }

    private async loadChats() {
        try {
            await ChatController.getChats();
        } catch (error) {
            console.error('Error loading chats:', error);
        }
    }

    render(): string {
        return ChatListTemplate;
    }
}

export const ChatList = connect((state) => {
    return {
        chats: state.chats || [],
        currentChat: state.currentChat
    };
})(ChatListBase);