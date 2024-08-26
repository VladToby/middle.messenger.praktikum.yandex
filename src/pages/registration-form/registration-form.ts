import './registration-form.less';
import RegistrationFormTmpl from './registration-form.hbs?raw';
import { BaseForm } from '../../core/BaseForm';
import Block, { Props } from '../../core/Block';
import { goToMessenger } from '../../utils/router';
import { Input } from "../../components/input/input";
import AuthController from "../../controllers/AuthController";

export class RegistrationPage extends BaseForm {
    constructor(props: Props) {
        super({
            props,
            onRegistration: (event: Event | undefined) => {
                if (!event) return;
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
            }
        });
    }

    private async submitForm(formData: Record<string, string>) {
        try {
            const userData = {
                first_name: formData.first_name,
                second_name: formData.second_name,
                login: formData.login,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
            };

            const success = await AuthController.createUser(userData);
            if (success) {
                goToMessenger();
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    }

    render(): string {
        return RegistrationFormTmpl;
    }
}
