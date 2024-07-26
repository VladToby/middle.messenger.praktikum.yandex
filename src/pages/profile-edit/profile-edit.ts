import '../profile/profile.less';
import ProfileEditPageTmpl from './profile-edit.hbs?raw';
import { BaseForm } from '../../core/BaseForm';

export class ProfileEditPage extends BaseForm {
    render(): string {
        return ProfileEditPageTmpl;
    }

    protected onValid(formData: Record<string, string>) {
        console.log('Profile edit successful', formData);

        this.navigate('ProfilePage');
    }
}
