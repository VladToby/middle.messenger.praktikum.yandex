import { expect } from 'chai';
import sinon from 'sinon';
import HTTPTransport, { METHODS } from "./HTTPTransport";
import { HOST } from '../utils/hosts';

describe('HTTPTransport', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should have a get request', async () => {
        const http = new HTTPTransport('/test');
        const requestStub = sinon.stub(http, 'request').resolves();

        await http.get('', {});

        const expectedUrl = `${HOST}/test`;
        expect(requestStub.calledWith(expectedUrl, {method: METHODS.GET})).to.be.true;
    });

    it('should have a post request', async () => {
        const http = new HTTPTransport('/test');
        const requestStub = sinon.stub(http, 'request').resolves();

        await http.post('', {});

        const expectedUrl = `${HOST}/test`;
        expect(requestStub.calledWith(expectedUrl, { method: METHODS.POST })).to.be.true;
    });

    it('should have a put request', async () => {
        const http = new HTTPTransport('/test');
        const requestStub = sinon.stub(http, 'request').resolves();

        await http.put('', {});

        const expectedUrl = `${HOST}/test`;
        expect(requestStub.calledWith(expectedUrl, { method: METHODS.PUT })).to.be.true;
    });

    it('should have a delete request', async () => {
        const http = new HTTPTransport('/test');
        const requestStub = sinon.stub(http, 'request').resolves();

        await http.delete('', {});

        const expectedUrl = `${HOST}/test`;
        expect(requestStub.calledWith(expectedUrl, { method: METHODS.DELETE })).to.be.true;
    });
});
