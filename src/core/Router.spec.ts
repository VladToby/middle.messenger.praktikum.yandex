import { expect } from 'chai';
import sinon from 'sinon';
import Router from './Router';
import Route from './Route';
import Block from './Block';

describe('Router', () => {
    let router: Router;

    beforeEach(() => {
        router = new Router('#root');
        sinon.stub(window, 'addEventListener');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should be a singleton', () => {
        const router2 = new Router('#root');
        expect(router).to.equal(router2);
    });

    it('should add a new route when use method is called', () => {
        class MockBlock extends Block {
            constructor() {
                super({});
            }
        }
        router.use('/', MockBlock);
        expect((router as any)._routes.length).to.equal(1);
    });

    it('should return itself when use method is called', () => {
        class MockBlock extends Block {
            constructor() {
                super({});
            }
        }
        const result = router.use('/', MockBlock);
        expect(result).to.equal(router);
    });

    it('should call _onRoute with current pathname when start is called', () => {
        const onRouteSpy = sinon.spy(router as any, '_onRoute');
        router.start();
        expect(onRouteSpy.calledWith(window.location.pathname)).to.be.true;
    });

    it('should call pushState when go method is called', () => {
        const historyPushStateSpy = sinon.spy(window.history, 'pushState');
        router.go('/test');
        expect(historyPushStateSpy.calledOnce).to.be.true;
    });

    it('should call _onRoute with correct pathname when go method is called', () => {
        const onRouteSpy = sinon.spy(router as any, '_onRoute');
        router.go('/test');
        expect(onRouteSpy.calledWith('/test')).to.be.true;
    });

    it('should call history.back when back method is called', () => {
        const historyBackSpy = sinon.spy(window.history, 'back');
        router.back();
        expect(historyBackSpy.calledOnce).to.be.true;
    });

    it('should call history.forward when forward method is called', () => {
        const historyForwardSpy = sinon.spy(window.history, 'forward');
        router.forward();
        expect(historyForwardSpy.calledOnce).to.be.true;
    });

    it('should return the correct route when getRoute is called', () => {
        class MockBlock extends Block {
            constructor() {
                super({});
            }
        }
        router.use('/test', MockBlock);
        const route = router.getRoute('/test');
        expect(route).to.be.instanceOf(Route);
    });

    it('should return undefined when getRoute is called with non-existent path', () => {
        const route = router.getRoute('/non-existent');
        expect(route).to.be.undefined;
    });

    it('should return the current route when getCurrentRoute is called', () => {
        class MockBlock extends Block {
            constructor() {
                super({});
            }
        }
        router.use('/test', MockBlock);
        (router as any)._currentRoute = router.getRoute('/test');
        const currentRoute = router.getCurrentRoute();
        expect(currentRoute).to.equal((router as any)._currentRoute);
    });
});
