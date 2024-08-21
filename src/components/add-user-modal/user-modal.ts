import './user-modal.less';
import UserModalTmpl from './user-modal.hbs?raw';
import Block, {Props} from '../../core/Block';
import { Search } from '../search/search';
import ChatController from "../../controllers/ChatController";
import Store from '../../core/Store';
import { connect } from '../../utils/connect';
import {User} from "../../utils/types";

export class UserModalBase extends Block {
    constructor(props: Props) {
        super({
            ...props,
            onClose: () => {
                Store.set('isAddUserOpen', false);
                Store.set('selectedUser', null);
            },
            events: {
                click: (event: Event) => {
                    this.handleUserClick(event);
                }
            }
        });
    }

    init() {
        this.children.Search = new Search({} as any);
    }

    protected componentDidUpdate(oldProps: any, newProps: any) {
        if (oldProps.selectedUser !== newProps.selectedUser && newProps.selectedUser) {
            if (this.props.isUserSearchEnabled) {
                this.addUserToChat(newProps.selectedUser);
            } else {
                this.removeUserFromChat(newProps.selectedUser);
            }
            Store.set('selectedUser', null);
        }

        return true;
    }

    private async addUserToChat(user: any) {
        const chatId = Store.getState().selectedChat?.id;
        if (chatId) {
            try {
                await ChatController.addUsers({ id: chatId, user: user.id });
                await ChatController.getChatUsers(chatId);
                Store.set('isAddUserOpen', false);
            } catch (error) {
                console.error('Error adding user to chat:', error);
            }
        } else {
            console.error('No selected chat found');
        }
    }

    private async handleUserClick(e: Event) {
        const target = e.target as HTMLElement;
        const userItem = target.closest('.user-item');
        if (userItem) {
            const userId = userItem.getAttribute('data-user-id') || userItem.id;
            if (userId) {
                let user;
                if (this.props.isUserSearchEnabled) {
                    user = this.props.users.find((u: User) => u.id.toString() === userId);
                } else {
                    user = this.props.currentChatUsers.find((u: User) => u.id.toString() === userId);
                }
                if (user) {
                    Store.setSelectedUser(user);
                }
            }
        }
    }

    private async removeUserFromChat(user: any) {
        const chatId = Store.getState().selectedChat?.id;
        if (chatId) {
            try {
                await ChatController.removeUsers({ id: chatId, users: [user.id] });
                await ChatController.getChatUsers(chatId);
                Store.set('isAddUserOpen', false);
            } catch (error) {
                console.error('Error removing user from chat:', error);
            }
        } else {
            console.error('No selected chat found');
        }
    }

    render(): string {
        return UserModalTmpl;
    }
}

export const UserModal = connect((state) => {
    return {
        isAddUserOpen: state?.isAddUserOpen || false,
        isUserSearchEnabled: state?.isUserSearchEnabled || false,
        usersList: state?.usersList || false,
        selectedUser: state.selectedUser,
        selectedChatId: state.selectedChat?.id,
        currentChatUsers: state?.currentChatUsers || []
    }
})(UserModalBase);
