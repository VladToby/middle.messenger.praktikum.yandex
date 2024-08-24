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
                Store.set({isAddUserOpen: true, isUserSearchEnabled: true, usersList: false, isOpenChatMenu: false});
            },
            deleteUser: () => {
                Store.set({isAddUserOpen: true, isUserSearchEnabled: false, usersList: true, isOpenChatMenu: false});
            },
            deleteChat: () => {
                Store.set({isOpenChatMenu: false, selectedChat: false});
                ChatController.deleteChat();
            }
        });
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
