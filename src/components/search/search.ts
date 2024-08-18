import Block from '../../core/Block';
import SearchTemplate from './search.hbs?raw';
import { User } from '../../utils/types';
import UserController from '../../controllers/UserController';

interface SearchUsersProps {
    onUserSelect: (user: User) => void;
}

export class SearchUsers extends Block {
    private searchTimeout: number | null = null;

    constructor(props: SearchUsersProps) {
        super({
            ...props,
            users: [],
            searchQuery: '',
            events: {
                input: (e: Event) => {
                    const input = e.target as HTMLInputElement;
                    this.setProps({ searchQuery: input.value });
                    this.debouncedSearch();
                },
                search: (e: Event) => {
                    e.preventDefault();
                    this.searchUsers();
                }
            }
        });
    }

    private debouncedSearch() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
            this.searchUsers();
        }, 300) as unknown as number;
    }

    async searchUsers() {
        const query: string = this.props.searchQuery as string;
        if (query.length < 3) {
            this.setProps({ users: [] });
            return;
        }

        try {
            const users = await UserController.searchUsers(this.props.searchQuery as string);
            this.setProps({ users, error: '' });
        } catch (error) {
            console.error('Error searching users:', error);
            this.setProps({ users: [], error: 'Error searching users' });
        }
    }

    render() {
        return SearchTemplate;
    }
}
