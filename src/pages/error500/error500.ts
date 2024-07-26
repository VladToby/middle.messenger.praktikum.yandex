import '../../components/error/error.less';
import Block, {Props} from "../../core/Block";
import Error500PageTmpl from './error500.hbs?raw';

export class Error500Page extends Block {
    constructor(props: Props) {
        super(props);
    }

    render(): string {
        return Error500PageTmpl;
    }
}
