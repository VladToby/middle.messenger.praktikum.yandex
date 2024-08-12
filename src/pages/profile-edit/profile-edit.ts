import '../profile/profile.less';
import ProfileEditPageTmpl from './profile-edit.hbs?raw';
import { BaseForm } from '../../core/BaseForm';
import { Props } from '../../core/Block';
import { router, goToSettings } from '../../utils/router';

export class ProfileEditPage extends BaseForm {
    constructor(props: Props) {
        super({
            ...props,
            goBack() {
                router.back();
            }
        });
    }
    render(): string {
        return ProfileEditPageTmpl;
    }

    protected onValid(formData: Record<string, string>) {
        console.log('Profile edit successful', formData);

        goToSettings();
    }
}
