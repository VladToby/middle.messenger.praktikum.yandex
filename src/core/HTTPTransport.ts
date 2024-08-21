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
        const {headers = {}, method, data} = options;

        return new Promise(function(resolve, reject) {
            if (!method) {
                reject('No method');
                return;
            }

            const xhr = new XMLHttpRequest();
            const isGet = method === METHODS.GET;

            if (method === METHODS.GET && data) {
                url += queryStringify(data as Record<string, any>);
            }

            xhr.open(
                method,
                isGet && !!data
                    ? `${url}${queryStringify(data)}`
                    : url,
            );
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr);
                } else {
                    reject(xhr);
                }
            };

            xhr.onabort = reject;
            xhr.onerror = reject;
            xhr.timeout = timeout;
            xhr.ontimeout = reject;
            xhr.responseType = 'json';
            xhr.withCredentials = true;

            Object.keys(headers).forEach(key => {
                xhr.setRequestHeader(key, headers[key]);
            });

            if (isGet || !data) {
                xhr.send();
            } else {
                xhr.send(data instanceof FormData ? data : JSON.stringify(data));
            }
        });
    };
}

export default HTTPTransport;
