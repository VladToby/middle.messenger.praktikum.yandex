import './menu-button.less';
import MenuButtonTmpl from './menu-button.hbs?raw';
import Block, {Props} from '../../core/Block';

export class MenuButton extends Block {
    constructor(props: Props) {
        super({...props});
        this.props.events = {
            click: this.props.onClick || (() => {}),
        };
    }

    render(): string {
        return MenuButtonTmpl;
    }
}
