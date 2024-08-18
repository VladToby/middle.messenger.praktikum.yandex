import HTTPTransport, {TOptionsData} from "../core/HTTPTransport";

const user = new HTTPTransport('/user');

class UserApi {
    public changeData(data: TOptionsData): Promise<unknown> {
        return user.put('/profile', {
            data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
    }

    public changePassword(data: TOptionsData): Promise<unknown> {
        return user.put('/password', {
            data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
    }

    public changeAvatar(data: FormData): Promise<unknown> {
        return user.put('/profile/avatar', { data });
    }

    public searchUsers(login: string): Promise<any> {
        return user.post('/search', {
            data: { login },
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
    }
}

export default new UserApi();
