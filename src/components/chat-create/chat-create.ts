import './chat-create.less';
import Block from '../../core/Block';
import CreateChatFormTemplate from './chat-create.hbs?raw';
import ChatController from '../../controllers/ChatController';
import Store from '../../core/Store';
import {connect} from "../../utils/connect";

interface CreateChatFormProps {
    isOpen: boolean;
    error: string | null;
    success: string | null;
}

export class ChatCreateBase extends Block {
    constructor(props: CreateChatFormProps) {
        super({
            ...props,
            events: {
                submit: (e: Event) => this.onSubmit(e),
                click: (e: Event) => this.onClick(e),
            },
            closeModal: () => {
                Store.set({isCreateChatModalOpen: false});
            }
        });
    }

    private onClick(e: Event) {
        const target = e.target as HTMLElement;
        if (target.classList.contains('create-chat-modal') || target.classList.contains('close-modal')) {
            e.preventDefault();
            this.closeModal();
        }
    }

    private closeModal() {
        Store.set({isCreateChatModalOpen: false});
    }

    private async onSubmit(e: Event) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const chatTitle = formData.get('chatTitle') as string;

        if (chatTitle) {
            try {
                await ChatController.createChat(chatTitle);
                form.reset();
                Store.set({createChatSuccess: 'Chat created successfully', createChatError: null });
                setTimeout(() => {
                    this.closeModal();
                    Store.set({createChatSuccess: null});
                }, 2000);
            } catch (error) {
                console.error('Error creating chat:', error);
                Store.set({createChatError: 'Failed to create chat', createChatSuccess: null});
            }
        } else {
            Store.set({createChatError: 'Failed to create chat', createChatSuccess: null});
        }
    }

    render(): string {
        return CreateChatFormTemplate;
    }
}

export const ChatCreate = connect((state) => {
    return {
        isOpen: state.isCreateChatModalOpen,
        error: state.createChatError,
        success: state.createChatSuccess
    };
})(ChatCreateBase);
