// import './avatar.less';
import AvatarTmpl from './avatar.hbs?raw';
import Block, {Props} from '../../core/Block';

export class Avatar extends Block {
    constructor(props: Props) {
        super({
            ...props,
            events: {
                ...(props.onClick ? { click: props.onClick } : {}),
            },
        });
    }

    render(): string {
        return AvatarTmpl;
    }
}
