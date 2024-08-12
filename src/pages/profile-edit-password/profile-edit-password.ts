import '../profile/profile.less';
import ProfileEditPasswordPageTmpl from './profile-edit-password.hbs?raw';
import { BaseForm } from '../../core/BaseForm';
import { Props } from '../../core/Block';
import { router, goToSettings } from '../../utils/router';

export class ProfileEditPasswordPage extends BaseForm {
    constructor(props: Props) {
        super({
            ...props,
            goBack() {
                router.back();
            }
        });
    }
    render(): string {
        return ProfileEditPasswordPageTmpl;
    }

    protected onValid(formData: Record<string, string>) {
        console.log('Profile password edit successful', formData);

        goToSettings();
    }
}
