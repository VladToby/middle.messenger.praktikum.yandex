import './chat-menu.less';
import ChatMenuTmpl from './chat-menu.hbs?raw';
import Block, {Props} from "../../core/Block";
import Store from "../../core/Store";
import {connect} from "../../utils/connect";
import ChatController from "../../controllers/ChatController";

export class ChatMenuBase extends Block {
    constructor(props: Props) {
        super({
            ...props,
            addUser: () => {
                Store.set('isAddUserOpen', true);
                Store.set('isUserSearchEnabled', true);
                Store.set('usersList', false);
                Store.set('isOpenChatMenu', false);
            },
            deleteUser: () => {
                Store.set('isAddUserOpen', true);
                Store.set('isUserSearchEnabled', false);
                Store.set('usersList', true);
                Store.set('isOpenChatMenu', false);

                if (Store.getState().usersList) {
                    this.getChatUsers();
                }
            },
            deleteChat: () => {
                Store.set('isOpenChatMenu', false);
                Store.set('selectedChat', false);
                ChatController.deleteChat();
            }
        });
    }

    private async getChatUsers() {
        const chatId = Store.getState().currentChat;
        await ChatController.getChatUsers(chatId);
    }

    render(): string {
        return ChatMenuTmpl;
    }
}

export const ChatMenu = connect((state) => {
    return {
        isOpenChatMenu: state.isOpenChatMenu,
        selectedChatId: state.selectedChat?.id,
        isAddUserOpen: state.isAddUserOpen || false,
        isUserSearchEnabled: state.isUserSearchEnabled || false,
        usersList: state.usersList || false
    };
})(ChatMenuBase);