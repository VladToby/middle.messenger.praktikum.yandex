import './error.less';
import Block, {Props} from "../../core/Block";
import ErrorTmpl from './error.hbs?raw';

export class Error extends Block {
    constructor(props: Props) {
        super(props);
    }

    render(): string {
        return ErrorTmpl;
    }
}
