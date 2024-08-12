import './chat.less';
import Block, {Props} from "../../core/Block";
import ChatPageTmpl from './chat.hbs?raw';
import { goToSettings } from '../../utils/router';

export class ChatPage extends Block {
    constructor(props: Props) {
        super({
            ...props,
            goToSettings: () => {
                goToSettings();
            }
        });
    }

    render(): string {
        return ChatPageTmpl;
    }
}
