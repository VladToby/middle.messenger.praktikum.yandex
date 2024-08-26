import HTTPTransport from '../core/HTTPTransport';
import { Chat, User } from '../utils/types';

const chats = new HTTPTransport('/chats');

class ChatAPI {
    public async getChats(): Promise<Chat[]> {
        return chats.get('/');
    }

    public async createChat(title: string): Promise<Chat> {
        return chats.post('/', {data: { title }});
    }

    public async getUserToken(chatId: number): Promise<{ token: string }> {
        const response = await chats.post(`/token/${chatId}`);
        if (response instanceof XMLHttpRequest) {
            return response.response;
        }

        return response;
    }

    public async getChatUsers(chatId: number | undefined): Promise<User[]> {
        return chats.get(`/${chatId}/users`);
    }

    public async addUsers(data: any): Promise<Chat> {
        return chats.put('/users', {
            data: data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }

    public async removeUsers(data: any): Promise<void> {
        return chats.delete('/users', {
            data: data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
    }

    public async deleteChat(chatId: any): Promise<void> {
        return chats.delete('/', {
            data: chatId,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
    }

    public async uploadAvatar(data: any): Promise<unknown> {
        return chats.put('/avatar', {
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}

export default new ChatAPI();
