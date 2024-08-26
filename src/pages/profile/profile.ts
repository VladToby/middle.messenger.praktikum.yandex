import './profile.less';
import Block, {Props} from '../../core/Block';
import ProfilePageTmpl from './profile.hbs?raw';
import {goToPasswordEdit, goToMessenger} from '../../utils/router';
import {connect} from '../../utils/connect';
import {Indexed} from '../../utils/utils';
import AuthController from '../../controllers/AuthController';
import {Input} from "../../components/input/input";
import UserController from "../../controllers/UserController";
import Store from '../../core/Store';

export class ProfilePageBase extends Block {
    private successMessageTimeout: number | null = null;

    constructor(props: Props) {
        super({
            ...props,
            readonly: true,
            editable: false,
            goToPasswordEdit() {
                goToPasswordEdit();
            },
            goBack() {
                goToMessenger();
            },
            goToLogout() {
                AuthController.logout();
            },
            toggleEdit: () => this.toggleEditMode(),
            saveUserChanges: (event: Event) => {
                if (!event) return;
                event.preventDefault();

                const formData: Record<string, string> = {};
                let isValid: boolean = true;
                let hasValues: boolean = false;

                Object.entries(this.children).forEach(([_key, child]) => {
                    if (child instanceof Input) {
                        const name = child.props.name as string;
                        const value = child.getValue() as string;
                        formData[name] = value;

                        if (value.trim() !== '') {
                            hasValues = true;
                            const validationResult = child.validate();

                            if (!validationResult) {
                                isValid = false;
                            }
                        }
                    }
                });

                if (hasValues && isValid) {
                    this.saveChanges(formData);
                } else if (!hasValues) {
                    return;
                } else {
                    console.error('Form validation failed, not saving changes');
                }
            },
            changeUserAvatar: (event: Event) => {
                if (!event) return;
                event.preventDefault();

                const input = event?.target as HTMLInputElement;
                if (input.files && input.files.length > 0) {
                    const file = input.files[0];
                    this.uploadAvatar(file);
                }
            },
            onClickAvatar: (event: Event) => {
                if (!event) return;
                event.preventDefault();
                this.onClickAvatar();
            }
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.checkAndStartTimer();
    }

    toggleEditMode() {
        this.setProps({
            isEditable: !this.props.isEditable,
            editable: !this.props.editable,
        });
        this.updateInputsReadonlyState();
    }

    updateInputsReadonlyState() {
        const inputs = this._element?.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
        inputs.forEach(input => {
            input.readOnly = !this.props.isEditable;
        });
    }

    private async saveChanges(formData: Record<string, string>) {
        try {
            const userData = {
                first_name: formData.first_name,
                second_name: formData.second_name,
                login: formData.login,
                email: formData.email,
                phone: formData.phone,
            };

            const updatedUser = await UserController.changeUserData(userData);

            if (updatedUser) {
                this.setProps({
                    user: updatedUser,
                    isEditable: false,
                    editable: false
                });
                Store.setNotificationMessage('Profile has been successfully updated.');
                this.updateInputsReadonlyState();
                this.checkAndStartTimer();
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    }

    async uploadAvatar(file: File) {
        try {
            const data = new FormData();
            data.append('avatar', file, file.name);
            const update = await UserController.changeAvatar(data);

            if (update) {
                this.setProps({user: update});
            }
        } catch (error) {
            console.error('AvatarUploader: Error uploading avatar:', error);
        }
    }

    static getStateToProps(state: Indexed): Indexed {
        return {
            user: state.user || null,
        };
    }

    private checkAndStartTimer() {
        if (this.props.notificationMessage) {
            this.startSuccessMessageTimer();
        }
    }

    private startSuccessMessageTimer() {
        if (this.successMessageTimeout) {
            clearTimeout(this.successMessageTimeout);
        }

        this.successMessageTimeout = window.setTimeout(() => {
            Store.setNotificationMessage('');
        }, 2500);
    }

    onClickAvatar() {
        const avatarUploader: HTMLInputElement | undefined = this._element?.querySelector('#avatar-uploader') as HTMLInputElement | undefined;
        if (avatarUploader) {
            avatarUploader.click();
        }
    }

    render(): string {
        return ProfilePageTmpl;
    }

    protected componentDidUpdate(oldProps: any, newProps: any): boolean {
        if (oldProps.notificationMessage !== newProps.notificationMessage) {
            this.checkAndStartTimer();
        }

        return true;
    }
}

export const ProfilePage = connect((state) => {
    return {
        user: state.user,
        notificationMessage: state.notificationMessage
    };
})(ProfilePageBase);
