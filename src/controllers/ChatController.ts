import ChatAPI from '../api/ChatApi';
import Store from '../core/Store';
import { Chat } from '../utils/types';
import { MessageController } from "./MessageController";
const messageController = new MessageController();

class ChatController {
    async getChats(): Promise<Chat[]> {
        try {
            const chats = await ChatAPI.getChats();
            if (chats instanceof XMLHttpRequest) {
                const chatsData = chats.response;
                if (Array.isArray(chatsData)) {
                    Store.set('chats', chatsData);
                    return chatsData;
                } else {
                    return [];
                }
            } else if (Array.isArray(chats)) {
                Store.set('chats', chats);
                return chats;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
            throw error;
        }
    }

    async createChat(title: string): Promise<Chat> {
        try {
            const newChat = await ChatAPI.createChat(title);
            const currentChats = Store.getState().chats || [];
            Store.set('chats', [...currentChats, newChat]);
            return newChat;
        } catch (error) {
            console.error('Error creating chat:', error);
            throw error;
        }
    }

    async searchChats(query: string): Promise<Chat[]> {
        try {
            const allChats = await this.getChats();
            return allChats.filter(chat =>
                chat.title.toLowerCase().includes(query.toLowerCase())
            );
        } catch (error) {
            console.error('Error searching chats:', error);
            return [];
        }
    }

    public async getChatUsers(id: number): Promise<any> {
        try {
            const chatUsers = await ChatAPI.getChatUsers(id);
            if (chatUsers instanceof XMLHttpRequest) {
                const usersData = chatUsers.response;
                if (Array.isArray(usersData)) {
                    Store.set('currentChatUsers', usersData);
                }
                return usersData;
            }
        } catch (error) {
            console.error('Error fetching chatUsers:', error);
        }
    }

    public async addUsers(data: any) {
        if (!data.id || !data.user) return false;

        try {
            const response= await ChatAPI.addUsers(data.id, [data.user]);
            if (response instanceof XMLHttpRequest) {
                return true;
            } else if (Array.isArray(response)) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.error(e);
        }

        return false;
    }

    async removeUsers(data: { id: number, users: number[] }) {
        try {
            await ChatAPI.removeUsers(data.id, data.users);
            await this.getChatUsers(data.id);
        } catch (error) {
            console.error('Error removing users from chat:', error);
            throw error;
        }
    }

    public async deleteChat(): Promise<void> {
        const { chats, currentChat } = Store.getState();
        if (currentChat) {
            await ChatAPI.deleteChat({ chatId: currentChat });
            Store.set('chats', chats.filter((chat: { id: any; }) => (chat.id !== currentChat)));
            Store.set('currentChat', null);
        }
    }

    public async setCurrentChat(id: number) {
        const chats = Store.getState().chats;
        const selectedChat = chats.find((chat: Chat) => chat.id === id);

        if (selectedChat) {
            Store.set('currentChat', id);
            Store.set('selectedChat', selectedChat);
            Store.set('currentChatMessages', []);
            await messageController.disconnect();

            try {
                await messageController.connect();
                await this.getChats();
            } catch (error) {
                Store.set('websocketError', 'Failed to connect to chat');
            }
        } else {
            console.error('Chat not found:', id);
        }
    }
}

export default new ChatController();