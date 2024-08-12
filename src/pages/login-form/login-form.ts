import './login-form.less';
import LoginFormTmpl from './login-form.hbs?raw';
import { BaseForm } from '../../core/BaseForm';
import { goToRegister, goToMessenger } from '../../utils/router';

export class LoginPage extends BaseForm {
    constructor(props: Record<string, any> = {}) {
        super({
            ...props,
            goToRegistration: () => {
                goToRegister();
            }
        });
    }

    render(): string {
        return LoginFormTmpl;
    }

    protected onValid(formData: Record<string, string>) {
        console.log('Login successful', formData);

        goToMessenger();
    }
}
