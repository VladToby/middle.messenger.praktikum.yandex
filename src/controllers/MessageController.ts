import { MessageProps } from '../utils/types';
import Socket, { Message, WebSocketProps } from '../core/Socket';
import ChatAPI from '../api/ChatApi';
import Store from '../core/Store';

const setLastMessage = (message: MessageProps) => {
    const { chats, currentChat, currentChatUsers } = Store.getState();
    if (chats && currentChat) {
        const chat = chats.find((c: { id: any; }) => c.id === currentChat);
        if (chat) {
            const user = currentChatUsers.find((u: { id: any; }) => u.id === message.user_id);
            const newChat = { ...chat };
            newChat.last_message = {
                user: {
                    id: user?.id || 0,
                    login: user?.login || '',
                    first_name: user?.first_name || '',
                    second_name: user?.second_name || '',
                    display_name: user?.display_name || '',
                    avatar: user?.avatar || '',
                    role: user?.role || '',
                },
                time: message.time,
                content: message.content,
            };
            Store.set({chats: chats.map((c: any) => (c === chat ? newChat : c))})
        }
    }
};

export class MessageController {
    static __instance: MessageController | undefined;

    protected socket: Socket | null = null;

    protected socketProps: WebSocketProps = {
        userId: 0,
        chatId: 0,
        token: '',
        callbackMessages: (data: MessageProps | MessageProps[]) => {
            this.addMessage(data);
        },
    };

    constructor() {
        if (MessageController.__instance) {
            return MessageController.__instance;
        }

        MessageController.__instance = this;
    }

    async getUserToken(chatId: number) {
        return await ChatAPI.getUserToken(chatId);
    }

    async connect() {
        const { user, currentChat } = Store.getState();
        if (user && currentChat) {
            this.socketProps.userId = user.id;
            this.socketProps.chatId = currentChat;

            const { token } = await this.getUserToken(currentChat);

            this.socketProps.token = token;

            this.socket = new Socket(this.socketProps);
        }
    }

    disconnect() {
        this.socket?.closeConnect();
    }

    sendMessage(message: string) {
        const mess: Message = {
            content: message,
            type: 'message',
        };
        this.socket?.send(mess);
    }

    addMessage(message: MessageProps | MessageProps[]) {
        const { currentChatMessages } = Store.getState();
        let newChatMessages: MessageProps[] = [];
        if (Array.isArray(message)) {
            newChatMessages = [...message].reverse();
        } else {
            newChatMessages = [...currentChatMessages, message];
            setLastMessage(message as any);
        }
        Store.set({currentChatMessages: newChatMessages});
    }
}
