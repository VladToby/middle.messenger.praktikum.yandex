import { EventBus } from './EventBus';
import { Indexed, set } from '../utils/utils'

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
        set(this.state, path, value);
        this.emit(StoreEvents.Updated);
    }

    public setNotificationMessage(message: string | null) {
        this.set('notificationMessage', message);
    }

    public emit(event: string, ...args: unknown[]) {
        if (!this.listeners[event]) {
            console.warn(`Попытка вызвать несуществующее событие: ${event}`);
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