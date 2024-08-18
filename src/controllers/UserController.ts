import UserApi from "../api/UserApi";
import {goToError500} from "../utils/router";
import Store from "../core/Store";

class UserController {
    public async changeUserData(data: any): Promise<any> {
        try {
            const response = await UserApi.changeData(data);

            if (response && typeof response === 'object') {
                if (response instanceof XMLHttpRequest) {
                    const userData = response.response;
                    Store.set('user', userData);
                    return userData;
                } else {
                    Store.set('user', response);
                    return response;
                }
            } else {
                goToError500();
            }
        } catch (e) {
            console.error(e);
        }
    }

    public async changePassword(data: any): Promise<any> {
        try {
            const response = await UserApi.changePassword(data);

            if (response && typeof response === 'object') {
                if (response instanceof XMLHttpRequest) {
                    return response.response;
                } else {
                    return response;
                }
            } else {
                goToError500();
            }
        } catch (e) {
            console.error(e);
        }
    }

    public async changeAvatar(data: FormData) {
        try {
            const response = await UserApi.changeAvatar(data);
            if (response && typeof response === 'object') {
                if (response instanceof XMLHttpRequest) {
                    const userData = response.response;
                    Store.set('user', userData);
                    return userData;
                } else {
                    Store.set('user', response);
                    return response;
                }
            } else {
                goToError500();
            }
        } catch (e) {
            console.error(e);
        }
    }
}

export default new UserController();
