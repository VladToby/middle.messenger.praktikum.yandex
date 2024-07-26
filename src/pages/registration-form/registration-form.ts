import './registration-form.less';
import RegistrationFormTmpl from './registration-form.hbs?raw';
import { BaseForm } from '../../core/BaseForm';

export class RegistrationPage extends BaseForm {
    render(): string {
        return RegistrationFormTmpl;
    }

    protected onValid(formData: Record<string, string>) {
        console.log('Account registration successful', formData);

        this.navigate('ChatPage');
    }
}
