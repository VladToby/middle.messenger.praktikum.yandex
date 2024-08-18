import AuthApi from "../api/AuthApi";
import {TOptionsData} from "../core/HTTPTransport";
import { goToLogin, goToMessenger, goToError500 } from "../utils/router";
import Store from "../core/Store";

class AuthController {
    public async createUser(data: TOptionsData): Promise<boolean> {
        try {
            const { status, response } = await AuthApi.createUser(data);

            if (status === 200 && response) {
                this.getUser();
                return true;
            } else if (status === 500) {
                goToError500();
                return false;
            } else {
                alert(JSON.parse(response).reason ?? 'Bad request');
                return false;
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    public async login(data: TOptionsData): Promise<void> {
        try {
            const { status, response } = await AuthApi.login(data);
            if (status === 200) {
                Store.set('auth', true);
                goToMessenger();
                this.getUser();
            } else if (status === 500) {
                goToError500();
            } else {
                alert(JSON.parse(response).reason ?? 'Bad request');
            }
        } catch (e) {
            console.error(e);
        }
    }

    public async getUser(): Promise<boolean> {
        try {
            const response = await AuthApi.getUser();

            if (response.status === 200 && response) {
                Store.set('user', response.response);
                Store.set('auth', true);
                return true;
            } else {
                Store.set('auth', false);
                return false;
            }
        } catch (e) {
            console.error('Error in getUser:', e);
            Store.set('auth', false);
            return false;
        }
    }

    public async logout(): Promise<void> {
        try {
            const { status, response } = await AuthApi.logout();
            if (status === 200) {
                Store.setResetState();
                goToLogin();
            } else if (status === 500) {
                goToError500();
            } else {
                alert(JSON.parse(response).reason ?? 'Error response');
            }
        } catch (e) {
            console.error(e);
        }
    }
}

export default new AuthController();
