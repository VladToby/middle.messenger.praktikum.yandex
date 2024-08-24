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
                Store.set({isAddUserOpen: false});
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

    private async handleUserClick(e: Event) {
        const target = e.target as HTMLElement;
        const userItem = target.closest('.user-item');
        if (userItem) {
            const userId = userItem.getAttribute('data-user-id') || userItem.id;
            if (userId) {
                let user;
                if (this.props.isUserSearchEnabled) {
                    user = this.props.users.find((u: User) => u.id.toString() === userId);
                    await ChatController.addUsers(user);
                    Store.set({isAddUserOpen: false});
                } else {
                    user = this.props.currentChatUsers.find((u: User) => u.id.toString() === userId);
                    await ChatController.removeUsers(user);
                    Store.set({isAddUserOpen: false});
                }
            }
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
        selectedUser: state.selectedUser,
        selectedChatId: state.selectedChat?.id,
        currentChatUsers: state?.currentChatUsers || [],
        users: state?.users || [],
        usersList: state.usersList
    }
})(UserModalBase);
