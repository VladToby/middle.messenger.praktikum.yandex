import '../profile/profile.less';
import ProfileEditPasswordPageTmpl from './profile-edit-password.hbs?raw';
import { BaseForm } from '../../core/BaseForm';
import { Props } from '../../core/Block';
import {Input} from "../../components/input/input";
import { router, goToSettings } from '../../utils/router';
import UserController from "../../controllers/UserController";
import Store from '../../core/Store';

export class ProfileEditPasswordPage extends BaseForm {
    constructor(props: Props) {
        super({
            ...props,
            goBack() {
                router.back();
            },
            onPasswordSave: (event: Event) => {
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
                    this.savePassword(formData);
                } else if (!hasValues) {
                    return;
                } else {
                    console.error('Form validation failed, not saving changes');
                }
            }
        });
    }

    private async savePassword(formData: Record<string, string>) {
        try {
            const passwordData = {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            };

            await UserController.changePassword(passwordData);
            Store.setNotificationMessage('Password has been successfully changed.');
            goToSettings();
        } catch (error) {
            console.error('Ошибка при смене пароля:', error);
            this.setProps({
                error: error instanceof Error ? error.message : 'Произошла неизвестная ошибка при смене пароля'
            });
        }
    }

    render(): string {
        return ProfileEditPasswordPageTmpl;
    }
}
