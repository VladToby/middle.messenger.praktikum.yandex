import './chat-body.less';
import Block from '../../core/Block';
import ChatBodyTemplate from './chat-body.hbs?raw';
import { connect } from '../../utils/connect';
import { Chat, MessageProps } from '../../utils/types';
import { MessageController } from "../../controllers/MessageController";
import Store from '../../core/Store';

const messageController = new MessageController();

interface ChatBodyProps {
    selectedChat: Chat | null;
    messages: MessageProps[];
    websocketError: string | null;
}

class ChatBodyBase extends Block {
    constructor(props: ChatBodyProps) {
        super({
            ...props,
            events: {
                submit: (e: Event) => this.onSubmit(e),
                click: (e: Event) => this.handleClick(e)
            },
            toggleMenu: (e: Event) => {
                e.stopPropagation();
                const isOpen = Store.getState().isOpenChatMenu;
                Store.set('isOpenChatMenu', !isOpen);
            }
        });
    }

    protected componentDidUpdate(_oldProps: ChatBodyProps, _newProps: ChatBodyProps): boolean {
        return true;
    }

    private closeMenu() {
        Store.set('isOpenChatMenu', false);
    }

    private handleClick(e: Event) {
        const target = e.target as HTMLElement;
        const isMenuOpen = Store.getState().isOpenChatMenu;

        if (target.closest('.chat-menu-button')) {
            this.props.toggleMenu(e);
        } else if (isMenuOpen && !target.closest('.menu__wrapper') && !target.closest('form')) {
            this.closeMenu();
        }
    }

    private onSubmit(e: Event) {
        e.preventDefault();
        const input = this._element?.querySelector('input[type="text"]') as HTMLInputElement;
        const message = input.value.trim();
        if (message) {
            messageController.sendMessage(message);
            input.value = '';
        }
    }

    render(): string {
        return ChatBodyTemplate;
    }
}

export const ChatBody = connect((state) => {
    return {
        selectedChat: state.selectedChat,
        currentUserId: state.user?.id,
        messages: state.currentChatMessages || [],
        websocketError: state.websocketError,
        isOpenChatMenu: state.isOpenChatMenu || false,
        isAddUserOpen: state.isAddUserOpen || false,
    };
})(ChatBodyBase);
