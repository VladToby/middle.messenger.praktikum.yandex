import './profile.less';
import Block, {Props} from "../../core/Block";
import ProfilePageTmpl from './profile.hbs?raw';
import { router, goToSettingsEdit, goToPasswordEdit } from '../../utils/router';

export class ProfilePage extends Block {
    constructor(props: Props) {
        super({
            ...props,
            goToSettingsEdit() {
                goToSettingsEdit();
            },
            goToPasswordEdit() {
                goToPasswordEdit();
            },
            goBack() {
                router.back();
            }
        });
    }

    render(): string {
        return ProfilePageTmpl;
    }
}
