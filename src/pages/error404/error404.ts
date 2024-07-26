import '../../components/error/error.less';
import Block, {Props} from "../../core/Block";
import Error404PageTmpl from './error404.hbs?raw';

export class Error404Page extends Block {
    constructor(props: Props) {
        super(props);
    }

    render(): string {
        return Error404PageTmpl;
    }
}
