import ChatAPI from '../api/ChatApi';
import Store from '../core/Store';
import {Chat, User} from '../utils/types';
import { MessageController } from "./MessageController";
const messageController = new MessageController();

class ChatController {
    async getChats(): Promise<Chat[]> {
        try {
            const chats = await ChatAPI.getChats();
            if (chats) {
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
            Store.set({chats: [...currentChats, newChat]});
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

    public async getChatUsers(id: number | undefined): Promise<any> {
        try {
            const chatUsers = await ChatAPI.getChatUsers(id);
            Store.set({currentChatUsers: chatUsers});
            return chatUsers;
        } catch (error) {
            console.error('Error fetching chatUsers:', error);
        }
    }

    public async addUsers(user: User): Promise<void> {
        const { selectedChat, currentChatUsers } = Store.getState();
        if (user && selectedChat) {
            try {
                await ChatAPI.addUsers({ chatId: selectedChat.id, users: [user.id] });
            } catch (error) {
                console.error(error);
            }

            const newCurrentChatUsers = [...currentChatUsers, user];
            Store.set({currentChatUsers: newCurrentChatUsers});
        }
    }

    async removeUsers(data: { id: number, users: number[] }): Promise<void> {
        const { selectedChat, currentChatUsers } = Store.getState();

        if (data && selectedChat) {
            try {
                await ChatAPI.removeUsers({ users: [data.id], chatId: selectedChat.id });
            } catch (error) {
                console.error(error);
            }

            const newCurrentChatUsers = currentChatUsers.filter((user: { id: number; }) => user.id !== data.id);
            Store.set({currentChatUsers: newCurrentChatUsers});
        }
    }

    public async deleteChat(): Promise<void> {
        const { chats, currentChat } = Store.getState();
        if (currentChat) {
            await ChatAPI.deleteChat({ chatId: currentChat });
            Store.set({
                chats: chats.filter((chat: { id: any; }) => (chat.id !== currentChat)),
                currentChat: null
            })
        }
    }

    public async changeAvatar(data: FormData): Promise<any> {
        try {
            const response = await ChatAPI.uploadAvatar(data);
            if (response) {
                Store.set({selectedChat: response});
                return response;
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    }

    public async setCurrentChat(id: number | undefined) {
        const chats = Store.getState().chats;
        const selectedChat = chats.find((chat: Chat) => chat.id === id);
        const chatUsers = await this.getChatUsers(id);

        Store.set({ currentChat: id, selectedChat: selectedChat, currentChatUsers: chatUsers });

        messageController.disconnect();
        messageController.connect();
    }
}

export default new ChatController();
