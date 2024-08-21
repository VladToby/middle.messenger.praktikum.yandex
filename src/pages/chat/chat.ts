import './chat.less';
import Block, {Props} from "../../core/Block";
import ChatPageTmpl from './chat.hbs?raw';
import { goToSettings } from '../../utils/router';
import Store from '../../core/Store';
import { connect } from "../../utils/connect";

class ChatPageBase extends Block {
    constructor(props: Props) {
        super({
            ...props,
            goToSettings: () => {
                goToSettings();
            },
            onChatCreate: (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                Store.set('isCreateChatModalOpen', true);
            }
        });
    }

    render(): string {
        return ChatPageTmpl;
    }
}

export const ChatPage = connect((state) => {
    return {
        currentChat: state.chats?.find((chat: any) => chat.id === state.currentChat) || null,
        chats: state.chats,
    }
})(ChatPageBase);
