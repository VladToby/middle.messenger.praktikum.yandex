import './login-form.less';
import LoginFormTmpl from './login-form.hbs?raw';
import { BaseForm } from '../../core/BaseForm';
import { goToRegister } from '../../utils/router';
import Block from "../../core/Block";
import {Input} from "../../components/input/input";
import AuthController from "../../controllers/AuthController";

export class LoginPage extends BaseForm {
    constructor(props: Record<string, any> = {}) {
        super({
            ...props,
            onLogin: (event: Event | undefined) => {
                if (!event) {
                    return;
                }
                event.preventDefault();

                const formData: Record<string, string> = {};
                let isValid: boolean = true;

                Object.values(this.children).forEach((child: Block | Element) => {
                    if (child instanceof Input) {
                        const name = child.props.name as string;
                        formData[name] = <string>child.getValue();
                        if (!child.validate()) {
                            isValid = false;
                        }
                    }
                });

                if (isValid) {
                    this.submitForm(formData);
                } else {
                    console.error('Form validation failed');
                }
            },
            goToRegistration: () => {
                goToRegister();
            }
        });
    }

    private async submitForm(formData: Record<string, string>) {
        try {
            const userData = {
                login: formData.login,
                password: formData.password
            };

            await AuthController.login(userData);
        } catch (error) {
            console.error('Registration error:', error);
        }
    }

    render(): string {
        return LoginFormTmpl;
    }
}
