import { EventBus } from './EventBus';
import isEqual from "../utils/isEqual";
import { User } from '../utils/types';

export enum StoreEvents {
    Updated = 'updated',
}

interface StoreState {
    notificationMessage?: string;
    selectedUser?: User;
    users?: User[];
    [key: string]: any;
}

class Store extends EventBus {
    private state: StoreState = {};

    constructor() {
        super();
    }

    public getState() {
        return this.state;
    }

    public set(nextState: Partial<StoreState>) {
        const prevState = { ...this.state };
        const newState = { ...this.state, ...nextState };

        if (!isEqual(prevState, newState)) {
            this.state = newState;
            this.emit(StoreEvents.Updated, prevState, newState);
        }
    }

    public setNotificationMessage(message: string) {
        this.set({notificationMessage: message});
    }

    public emit(event: string, ...args: unknown[]) {
        if (!this.listeners[event]) {
            return;
        }

        this.listeners[event].forEach(listener => {
            listener(...args);
        });
    }
}

export default new Store();
