import './profile.less';
import Block, {Props} from "../../core/Block";
import ProfilePageTmpl from './profile.hbs?raw';

export class ProfilePage extends Block {
    constructor(props: Props) {
        super(props);
    }

    render(): string {
        return ProfilePageTmpl;
    }
}
