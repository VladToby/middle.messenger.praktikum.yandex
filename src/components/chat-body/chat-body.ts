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
                submit: (event: Event) => this.onSubmit(event),
                click: (event: Event) => this.handleClick(event)
            },
            toggleMenu: (event: Event) => {
                event.stopPropagation();
                const isOpen = Store.getState().isOpenChatMenu;
                Store.set({isOpenChatMenu: !isOpen});
            },
            openSettingsModal: (event: Event) => {
                if (!event) return;
                event.preventDefault();
                Store.set({isSettingsModalOpen: true});
            }
        });
    }

    private closeMenu() {
        Store.set({isOpenChatMenu: false});
    }

    private handleClick(e: Event) {
        const target = e.target as HTMLElement;
        const isMenuOpen = Store.getState().isOpenChatMenu;

        if (target.closest('.chat-menu-button')) {
            this.props.toggleMenu(e);
        } else if (isMenuOpen && !target.closest('.menu__wrapper') && !target.closest('form')) {
            this.closeMenu();
        }

        if (target.closest('.chat-title')) {
            this.props.openSettingsModal(e);
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
        isSettingsModalOpen: state.isSettingsModalOpen || false,
        currentChatUsers: state.currentChatUsers || [],
    };
})(ChatBodyBase);
