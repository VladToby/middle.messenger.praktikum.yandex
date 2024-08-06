import './login-form.less';
import LoginFormTmpl from './login-form.hbs?raw';
import { BaseForm } from '../../core/BaseForm';

export class LoginPage extends BaseForm {
    render(): string {
        return LoginFormTmpl;
    }

    protected onValid(formData: Record<string, string>) {
        console.log('Login successful', formData);

        this.navigate('ChatPage');
    }
}
