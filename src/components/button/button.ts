import './button.less';
import Block, {Props} from '../../core/Block';
import ButtonTmpl from './button.hbs?raw';

export class Button extends Block {
    constructor(props: Props) {
        super({...props});
        this.props.events = {
            click: this.props.onClick || (() => {}),
        };
    }

    render(): string {
        return ButtonTmpl;
    }
}
