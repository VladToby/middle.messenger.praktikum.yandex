import queryStringify from '../utils/queryStringify';
import {HOST} from '../utils/hosts';

enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}
export type TOptionsData = Record<string, string | number | Array<string | number>>;
export type Options = {
    headers?: Record<string, string>,
    method?: string,
    data?: Record<string | symbol, any | FormData> | FormData | TOptionsData,
    timeout?: number,
}

export type HTTP = (url: string, options?: Options) => Promise<any>;

class HTTPTransport {
    protected apiUrl: string = '';

    constructor(apiPath: string) {
        this.apiUrl = `${HOST}${apiPath}`;
    }

    get: HTTP = (url = '', options = {}) => {
        return this.request(`${this.apiUrl}${url}`, {...options, method: METHODS.GET}, options.timeout);
    };

    post: HTTP = (url = '', options = {}) => {
        return this.request(`${this.apiUrl}${url}`, {...options, method: METHODS.POST}, options.timeout);
    };

    put: HTTP = (url = '', options = {}) => {
        return this.request(`${this.apiUrl}${url}`, {...options, method: METHODS.PUT}, options.timeout);
    };

    delete: HTTP = (url = '', options = {}) => {
        return this.request(`${this.apiUrl}${url}`, {...options, method: METHODS.DELETE}, options.timeout);
    };

    request = (url: string, options: Options = {}, timeout = 5000) => {
        const {method, data} = options;

        return new Promise(function(resolve, reject) {
            if (!method) {
                reject('No method');
                return;
            }

            const xhr = new XMLHttpRequest();

            if (method === METHODS.GET && data) {
                // eslint-disable-next-line no-param-reassign
                url += queryStringify(data as Record<string, unknown>);
            }

            xhr.open(method || METHODS.GET, url);

            if (data instanceof FormData) {
                xhr.setRequestHeader('Accept', 'application/json');
            } else {
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            }

            xhr.onload = () => {
                if (xhr.status !== 200) {
                    reject(new Error(`Error ${xhr.status}: ${xhr?.response?.reason || xhr.statusText}`));
                } else {
                    resolve(xhr.response);
                }
            };

            xhr.onabort = reject;
            xhr.onerror = reject;
            xhr.timeout = timeout;
            xhr.ontimeout = reject;
            xhr.responseType = 'json';
            xhr.withCredentials = true;

            if (method === METHODS.GET || !data) {
                xhr.send();
            } else if (data instanceof FormData) {
                xhr.send(data);
            } else {
                xhr.send(JSON.stringify(data));
            }
        });
    };
}

export default HTTPTransport;
