import './search.less';
import Block from '../../core/Block';
import SearchTemplate from './search.hbs?raw';
import { User, Chat } from '../../utils/types';
import UserController from '../../controllers/UserController';
import ChatController from '../../controllers/ChatController';
import Store from '../../core/Store';

interface SearchUsersProps {
    onUserSelect: (user: User) => void;
    onChatSelect?: (chat: Chat) => void;
}

export class Search extends Block {
    private searchTimeout: number | null = null;

    constructor(props: SearchUsersProps) {
        super({
            ...props,
            users: [],
            chats: [],
            searchQuery: '',
            events: {
                input: (e: Event) => {
                    const input = e.target as HTMLInputElement;
                    this.setProps({ searchQuery: input.value });
                    this.debouncedSearch();
                },
                search: (e: Event) => {
                    e.preventDefault();
                    this.search();
                },
                click: (e: Event) => {
                    this.handleClick(e);
                }
            }
        });
    }

    private handleClick(e: Event) {
        const target = e.target as HTMLElement;
        const userItem = target.closest('.user-item');
        const chatItem = target.closest('.chat-item');

        if (userItem) {
            const userId = userItem.getAttribute('data-user-id');
            if (userId) {
                const user = this.props.users.find((u: User) => u.id.toString() === userId);
                if (user) {
                    Store.setSelectedUser(user);
                }
            }
        }

        if (chatItem) {
            const chatId = chatItem.getAttribute('data-chat-id');
            if (chatId) {
                const chat = this.props.chats.find((c: Chat) => c.id.toString() === chatId);
                ChatController.setCurrentChat(chat.id);
            }
        }
    }

    private debouncedSearch() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
            this.search();
        }, 1000) as unknown as number;
    }

    private async search() {
        const query: string = this.props.searchQuery as string;
        if (query.length < 3) {
            this.setProps({ users: [], chats: [] });
            return;
        }

        try {
            const users = await UserController.searchUsers(query);
            const chats = await ChatController.searchChats(query);
            this.setProps({ users, chats, error: '' });
        } catch (error) {
            console.error('Error searching:', error);
            this.setProps({ users: [], chats: [], error: 'Error searching' });
        }
    }

    render() {
        return SearchTemplate;
    }
}
