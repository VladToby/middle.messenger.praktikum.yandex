import Block, { Props } from './Block';
import { Input } from '../components/input/input';

export class BaseForm extends Block {
    constructor(props: Props) {
        super({
            ...props,
            events: {
                submit: (event: Event) => {
                    event.preventDefault();
                    this.onSubmit();
                },
            },
        });
    }

    protected onSubmit() {
        const formData: Record<string, string> = {};
        let isValid: boolean = true;

        Object.values(this.children).forEach((child: Block | Element) => {
            if (child instanceof Input) {
                const { name } = child.props;
                formData[name] = child.getValue();
                if (!child.validate()) {
                    isValid = false;
                }
            }
        });

        if (isValid) {
            this.onValid(formData);
        } else {
            this.onInvalid();
        }
    }

    protected onValid(formData: Record<string, string>) {
        // This method should be overridden in child classes
    }

    protected onInvalid() {
        // This method can be overridden in child classes if needed
    }

    protected navigate(page: string) {
        const event = new CustomEvent('navigate', {
            bubbles: true,
            detail: { page }
        });
        document.dispatchEvent(event);
    }
}
