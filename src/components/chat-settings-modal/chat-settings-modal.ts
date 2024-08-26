import './chat-settings-modal.less';
import ChatSettingsModalTmpl from './chat-settings-modal.hbs?raw';
import Block, {Props} from '../../core/Block';
import Store from '../../core/Store';
import {connect} from "../../utils/connect";
import ChatController from "../../controllers/ChatController";

export class ChatSettingsModalBase extends Block {
    constructor(props: Props) {
        super({
            ...props,
            events: {
                click: (event: Event) => {
                    this.handleClick(event);
                }
            },
            onClose: () => {
                Store.set({isSettingsModalOpen: false});
            },
            changeChatAvatar: (event: Event) => {
                if (!event) return;
                event.preventDefault();

                const input = event?.target as HTMLInputElement;
                if (input.files && input.files.length > 0) {
                    const file = input.files[0];
                    this.uploadAvatar(file);
                }
            }
        });
    }

    private handleClick(event: Event) {
        const target = event.target as HTMLElement;
        const defaultAvatar = target.closest('.avatar');
        const avatarLoaded = target.closest('.image');

        if (defaultAvatar) {
            this.onClickAvatar();
        }

        if (avatarLoaded) {
            this.onClickAvatar();
        }
    }

    onClickAvatar() {
        const avatarUploader: HTMLInputElement | undefined = this._element?.querySelector('#avatar-uploader') as HTMLInputElement | undefined;
        if (avatarUploader) {
            avatarUploader.click();
        }
    }

    async uploadAvatar(file: File) {
        try {
            const data = new FormData();
            data.set('chatId', this.props.selectedChat.id);
            data.set('avatar', file, file.name);

            const update = await ChatController.changeAvatar(data);

            if (update) {
                this.setProps({selectedChat: update});
            }
        } catch (error) {
            console.error('AvatarUploader: Error uploading avatar:', error);
        }
    }

    render(): string {
        return ChatSettingsModalTmpl;
    }
}

export const ChatSettingsModal = connect((state) => {
    return {
        isSettingsModalOpen: state.isSettingsModalOpen || false,
    }
})(ChatSettingsModalBase);
