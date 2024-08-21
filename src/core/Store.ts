import { EventBus } from './EventBus';
import { Indexed, set } from '../utils/utils'
import isEqual from "../utils/isEqual";
import { User } from '../utils/types';

export enum StoreEvents {
    Updated = 'updated',
}

class Store extends EventBus {
    private state: Indexed = {};

    constructor() {
        super();
    }

    public getState() {
        return this.state;
    }

    public set(path: string, value: unknown) {
        const oldValue = this.getState()[path];
        if (!isEqual(oldValue, value)) {
            set(this.state, path, value);
            this.emit(StoreEvents.Updated, oldValue, value);
        }
    }

    public setNotificationMessage(message: string | null) {
        this.set('notificationMessage', message);
    }

    public setSelectedUser(user: User | null) {
        this.set('selectedUser', user);
    }

    public setUsers(users: User[]) {
        this.set('users', users);
    }

    public emit(event: string, ...args: unknown[]) {
        if (!this.listeners[event]) {
            return;
        }

        this.listeners[event].forEach(listener => {
            listener(...args);
        });
    }

    public setResetState(): void {
        try {
            this.state = {
                auth: false,
                user: null,
                getPage: '/',
            };
            this.emit(StoreEvents.Updated);
        } catch (e) {
            console.error(e);
        }
    }
}

export default new Store();
