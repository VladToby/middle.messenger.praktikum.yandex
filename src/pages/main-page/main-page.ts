import Block, {Children, Props} from "../../core/Block";
import MainPageTmpl from './main-page.hbs?raw';

export class MainPage extends Block {
    constructor(props: Props | Children) {
        super({props})}

    render(): string {
        return MainPageTmpl;
    }
}
