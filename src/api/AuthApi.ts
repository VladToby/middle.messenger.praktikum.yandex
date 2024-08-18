import HTTPTransport, { TOptionsData } from "../core/HTTPTransport";

const auth = new HTTPTransport('/auth');

class AuthApi {
    public createUser(data: TOptionsData): Promise<any> {
        return auth.post('/signup', {
            data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
    }

    public login(data: TOptionsData): Promise<any> {
        return auth.post('/signin', {
            data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
    }

    public getUser(): Promise<any> {
        return auth.get('/user');
    }

    public logout(): Promise<any> {
        return auth.post('/logout');
    }
}

export default new AuthApi();
