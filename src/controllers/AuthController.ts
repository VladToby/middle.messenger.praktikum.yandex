import AuthApi from "../api/AuthApi";
import {TOptionsData} from "../core/HTTPTransport";
import { goToLogin, goToMessenger, goToError500 } from "../utils/router";
import ChatController from "./ChatController";
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
            await AuthApi.login(data);
            const user = await this.getUser();
            const chats = await ChatController.getChats();
            Store.set({user: user, chats});
            goToMessenger();
        } catch (error) {
            console.error(error);
        }
    }

    public async getUser(): Promise<boolean> {
        try {
            const response = await AuthApi.getUser();

            if (response) {
                Store.set({user: response});
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.error('Error in user:', e);
            return false;
        }
    }

    public async logout(): Promise<void> {
        await AuthApi.logout();
        Store.set({user: null, currentChat: null});
        goToLogin();
    }
}

export default new AuthController();
