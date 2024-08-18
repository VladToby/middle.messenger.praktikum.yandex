import Store, { StoreEvents } from '../core/Store';
import Block from '../core/Block';
import isEqual from '../utils/isEqual';

export function connect(mapStateToProps: (state: any) => any) {
    return function(Component: typeof Block) {
        return class extends Component {
            private onChangeStoreCallback: () => void;

            constructor(props: any) {
                let state = mapStateToProps(Store.getState());
                super({ ...props, ...mapStateToProps(state) });

                this.onChangeStoreCallback = () => {
                    const newState = mapStateToProps(Store.getState());

                    if (!isEqual(state, newState)) {
                        this.setProps({ ...newState });
                    }

                    state = newState;
                }

                Store.on(StoreEvents.Updated, this.onChangeStoreCallback);
            }

            componentWillUnmount() {
                super.componentWillUnmount();
                Store.off(StoreEvents.Updated, this.onChangeStoreCallback);
            }
        }
    }
}
