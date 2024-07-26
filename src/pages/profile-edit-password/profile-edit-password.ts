import '../profile/profile.less';
import ProfileEditPasswordPageTmpl from './profile-edit-password.hbs?raw';
import { BaseForm } from '../../core/BaseForm';

export class ProfileEditPasswordPage extends BaseForm {
    render(): string {
        return ProfileEditPasswordPageTmpl;
    }

    protected onValid(formData: Record<string, string>) {
        console.log('Profile password edit successful', formData);

        this.navigate('ProfilePage');
    }
}
