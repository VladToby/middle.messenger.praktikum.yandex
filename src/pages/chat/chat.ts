import './chat.less';
import Block, {Props} from "../../core/Block";
import ChatPageTmpl from './chat.hbs?raw';

export class ChatPage extends Block {
    constructor(props: Props) {
        super(props);
    }

    render(): string {
        return ChatPageTmpl;
    }
}
