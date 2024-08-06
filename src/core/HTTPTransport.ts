enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export type Options = {
    headers?: Record<string, string>,
    method?: string,
    data?: any,
    timeout?: number,
}

export type HTTP = (url: string, options?: Options) => Promise<any>;

export default class HTTPTransport {
    get: HTTP = (url = '', options = {}) => {
        return this.request(url, {...options, method: METHODS.GET}, options.timeout);
    };

    post: HTTP = (url = '', options = {}) => {
        return this.request(url, {...options, method: METHODS.POST}, options.timeout);
    };

    put: HTTP = (url = '', options = {}) => {
        return this.request(url, {...options, method: METHODS.PUT}, options.timeout);
    };

    delete: HTTP = (url = '', options = {}) => {
        return this.request(url, {...options, method: METHODS.DELETE}, options.timeout);
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

            xhr.open(
                method,
                isGet && !!data
                    ? `${url}${queryStringify(data)}`
                    : url,
            );

            Object.keys(headers).forEach(key => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = function() {
                resolve(xhr);
            };

            xhr.onabort = reject;
            xhr.onerror = reject;

            xhr.timeout = timeout;
            xhr.ontimeout = reject;

            if (isGet || !data) {
                xhr.send();
            } else {
                xhr.send(data);
            }
        });
    };
}

function queryStringify(data: any): string {
    if (typeof data !== 'object') {
        throw new Error('Data must be object');
    }

    const keys: string[] = Object.keys(data);
    return keys.reduce((result: string, key: string, index: number) => {
        return `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`;
    }, '?');
}
