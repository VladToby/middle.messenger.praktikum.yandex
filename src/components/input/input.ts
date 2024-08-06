import Block, { Props } from '../../core/Block';
import template from './input.hbs?raw';
import { validateField } from '../../utils/validation';

export class Input extends Block {
    constructor(props: Props) {
        super({
            ...props,
            value: props.value || '',
            error: '',
            hasError: false,
            events: {
                blur: (e: FocusEvent) => {
                    this.validate();
                    if (typeof this.props.onBlur === 'function') {
                        this.props.onBlur(e);
                    }
                },
                input: (e: Event) => {
                    const input = e.target as HTMLInputElement;
                    this.props.value = input.value;
                }
            }
        });
    }

    public setValue(value: string): void {
        this.setProps({ value });
    }

    public getValue(): unknown {
        return this.props.value;
    }

    public validate(): boolean {
        const errorMessage: string | null = validateField(<string>this.props.name, <string>this.props.value);
        const hasError: boolean = !!errorMessage;
        this.setProps({
            error: errorMessage,
            hasError: hasError
        });
        return !errorMessage;
    }

    render(): string {
        return template;
    }

    protected componentDidUpdate(oldProps: any, newProps: any): boolean {
        if (this._element) {
            if (newProps.hasError !== oldProps.hasError) {
                this._element.classList.toggle('has-error', newProps.hasError);
            }

            const errorElement = this._element.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = newProps.error || '';
            }

            const inputElement = this._element.querySelector('input') as HTMLInputElement;
            if (inputElement && inputElement.value !== newProps.value) {
                inputElement.value = newProps.value;
            }
        }
        return false;
    }
}
